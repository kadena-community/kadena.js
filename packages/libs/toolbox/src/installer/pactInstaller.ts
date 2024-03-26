import { createWriteStream } from 'node:fs';
import { chmod, mkdir } from 'node:fs/promises';
import { arch, homedir, platform, tmpdir } from 'node:os';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';
import { join } from 'pathe';
import tar from 'tar';
import { execAsync, logger } from '../utils';

const PACT_INSTALL_DIR = join(homedir(), '.local', 'bin');
// pact --version returns something like "pact version 4.0.0"
const PACT_VERSION_REGEX = /(\d+)\.(\d+)(?:\.(\d+))?(-[A-Za-z0-9]+)?/;

export interface GithubRelease {
  id: number;
  tag_name: string;
  body: string;
  published_at: string;
  created_at: string;
  prerelease: boolean;
  draft: boolean;
  html_url: string;
  url: string;
  user: {
    login: string;
    id: number;
    url: string;
  };
  assets: {
    name: string;
    browser_download_url: string;
  }[];
}
interface PactReleaseInfo {
  latestRelease: GithubRelease;
  releases: GithubRelease[];
}
export async function getPactReleaseInfo(): Promise<PactReleaseInfo> {
  const res = await fetch(
    'https://api.github.com/repos/kadena-io/pact/releases',
  );
  const data: GithubRelease[] = await res.json();
  const latestRelease = data[0];
  return {
    latestRelease,
    releases: data,
  };
}

export function getDownloadUrl(version: string, binaryName: string) {
  version = version.replace('v', '');
  return `https://github.com/kadena-io/pact/releases/download/v${version}/${binaryName}`;
}

const Z3_URL =
  'https://github.com/kadena-io/pact/releases/download/v4.1/z3-4.8.10-osx.tar.gz';
interface SystemInfo {
  platform: string;
  arch: string;
  version: string;
  binaryName: string;
  isSupported: boolean;
  downloadUrl: string;
}

export function getSystemInfo(version: string): SystemInfo {
  const p = platform();
  const a = arch();
  version = normalizeVersion(version).replace('v', '');
  const info: SystemInfo = {
    platform: p,
    arch: a,
    version,
    binaryName: '',
    isSupported: false,
    downloadUrl: '',
  };

  if (p === 'darwin') {
    // const binaryName = a === 'arm64' ? `pact-${version}-aarch64-osx.zip` : `pact-${version}-osx.zip`;
    const binaryName = `pact-${version}-osx.tar.gz`;
    return {
      ...info,
      binaryName,
      isSupported: true,
      downloadUrl: getDownloadUrl(version, binaryName),
    };
  }

  if (p === 'linux' && a === 'x64') {
    const binaryName = `pact-${version}-linux-22.04.tar.gz`;
    return {
      ...info,
      binaryName,
      isSupported: true,
      downloadUrl: getDownloadUrl(version, binaryName),
    };
  }

  return info;
}

export async function downloadAndExtract(
  downloadUrl: string,
  dest: string,
  filename: string,
) {
  try {
    const res = await fetch(downloadUrl);
    const binaryName = downloadUrl.split('/').pop() as string;
    const path = join(tmpdir(), binaryName);

    if (!res.ok) {
      throw new Error(`Failed to download ${downloadUrl}`);
    }

    // Save the file locally
    const writer = createWriteStream(path);
    if (!res.body) {
      throw new Error('Response body is undefined');
    }
    // @ts-ignore
    await finished(Readable.fromWeb(res.body).pipe(writer));
    await mkdir(dest, { recursive: true });
    // Extract the file
    await tar.extract({
      file: path,
      cwd: dest,
      filter: (path) => path === filename,
    });
    // make it executable
    await chmod(join(dest, filename), 0o755);
  } catch (error) {
    logger.error('Error during download and unzip:', error);
  }
}

async function getInstalledVersion() {
  try {
    const { stdout } = await execAsync('pact --version');
    const match = stdout.match(PACT_VERSION_REGEX);
    if (match) {
      return match[0];
    }
  } catch (error) {
    return undefined;
  }
}

export function compareVersions(version1: string, version2: string) {
  version1 = normalizeVersion(version1).replace('v', '');
  version2 = normalizeVersion(version2).replace('v', '');

  const parts1 = version1.split('.').map(Number);
  const parts2 = version2.split('.').map(Number);

  // Pad the shorter array with zeros
  while (parts1.length < parts2.length) parts1.push(0);
  while (parts2.length < parts1.length) parts2.push(0);

  for (let i = 0; i < parts1.length; i++) {
    if (parts1[i] > parts2[i]) return 1; // version1 is greater
    if (parts1[i] < parts2[i]) return -1; // version2 is greater
  }

  return 0; // versions are equal
}

export async function checkPactVersion(version?: string) {
  const { latestRelease } = await getPactReleaseInfo();
  const latestVersion = latestRelease.tag_name;
  if (!version) {
    version = latestVersion;
  }

  const installedVersion = await getInstalledVersion();

  const info = {
    isInstalled: false,
    isMatching: false,
    isOlder: false,
    isNewer: false,
    installedVersion,
    latestVersion,
  };

  if (!installedVersion) {
    return info;
  }

  if (!version) {
    return {
      ...info,
      isInstalled: true,
    };
  }

  const comparison = compareVersions(version, installedVersion);
  if (comparison === 0) {
    return {
      ...info,
      isInstalled: true,
      isMatching: true,
    };
  }

  if (comparison === 1) {
    return {
      ...info,
      isInstalled: true,
      isOlder: true,
    };
  }

  return {
    ...info,
    isInstalled: true,
    isNewer: true,
  };
}

export function normalizeVersion(version: string) {
  return version.replace('v', '');
}
export async function lookupPactVersion(version: string) {
  version = normalizeVersion(version);
  const { releases } = await getPactReleaseInfo();
  const release = releases.find((r) =>
    normalizeVersion(r.tag_name).includes(version),
  );
  if (!release) {
    throw new Error(`Pact version ${version} not found`);
  }
  return release;
}

export async function installPact(version?: string) {
  if (!version) {
    const { latestRelease } = await getPactReleaseInfo();
    version = latestRelease.tag_name;
  }
  version = normalizeVersion(version);
  const { isInstalled, isMatching } = await checkPactVersion(version);
  if (isInstalled && isMatching) {
    logger.info(`Pact is already installed at version ${version}`);
    return;
  }
  const info = getSystemInfo(version);
  if (!info.isSupported) {
    logger.error(`Unsupported platform: ${platform()}-${arch()}`);
  }

  logger.start(`Installing Pact version ${version}`);
  await downloadAndExtract(info.downloadUrl, PACT_INSTALL_DIR, 'pact');
  logger.success(`Pact installed successfully 🎉`);
  logger.start(`Installing Z3`);
  await downloadAndExtract(Z3_URL, PACT_INSTALL_DIR, 'z3');
  logger.success(`Z3 installed successfully 🎉`);
  logger.box(
    `Make sure it's in your shell PATH \n\`export PATH="$PATH:${PACT_INSTALL_DIR}"\``,
  );
}

export async function isPactUpToDate() {
  const { latestRelease } = await getPactReleaseInfo();
  const { isInstalled, isMatching } = await checkPactVersion(
    latestRelease.tag_name,
  );
  return isInstalled && isMatching;
}

export async function upgradePact() {
  const { isInstalled, isMatching, isNewer, installedVersion, latestVersion } =
    await checkPactVersion();

  if (isInstalled && isMatching) {
    logger.info(`Pact is already up to date at version ${installedVersion}`);
    return;
  }

  if (isNewer) {
    logger.info(
      `Pact version ${installedVersion} is newer than ${latestVersion}`,
    );
    return;
  }

  if (!isInstalled) {
    logger.start(`Pact is not installed, Installing version ${latestVersion}`);
  } else {
    logger.start(`Upgrading Pact from ${installedVersion} to ${latestVersion}`);
  }
  await installPact(latestVersion);
  logger.box(`Pact upgraded successfully 🎉`);
}

export async function versionCheckMiddleware() {
  const { isInstalled, isMatching, isNewer, installedVersion, latestVersion } =
    await checkPactVersion();

  if (!isInstalled) {
    logger.error(
      `Pact is not installed, please install it first using \`pact-toolbox pact install\``,
    );
    process.exit(1);
  }

  if (!isMatching) {
    logger.info(
      `Pact version ${latestVersion} is released, please upgrade using \`pact-toolbox pact upgrade\` or \`pact-toolbox pact install ${latestVersion}\``,
    );
  }

  if (isNewer) {
    logger.warn(
      `Pact version ${installedVersion} is newer than latest released version ${latestVersion}!`,
    );
  }
}
