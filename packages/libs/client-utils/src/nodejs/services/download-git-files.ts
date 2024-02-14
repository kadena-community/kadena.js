import https from 'https';
import { join } from 'path';
import { createDirAndWriteFile } from './path';

export async function downloadGitFiles({
  owner,
  name,
  path,
  branch,
  localPath = process.cwd(),
  fileExtension,
  drillDown = false,
  excludeFolder = [],
  githubToken,
}: {
  owner: string;
  name: string;
  path: string;
  branch: string;
  localPath: string;
  fileExtension: string;
  drillDown?: boolean;
  excludeFolder?: string[];
  githubToken?: string;
}): Promise<void> {
  const folderUrl = buildGitApiUrl(owner, name, path, branch);

  console.log(`Downloading file: ${folderUrl}`);

  const gitData = await getGitData(folderUrl, false, githubToken);

  if (gitData instanceof Array) {
    // if gitData is an array, it means that it is a folder and we can download the files
    await Promise.all(
      gitData.map(async (file) => {
        if (
          file.type === 'dir' &&
          drillDown &&
          !excludeFolder.includes(file.name)
        ) {
          // If the file is a directory and we're drilling down, recursively download its files
          await downloadGitFiles({
            owner,
            name,
            path: file.path,
            branch,
            localPath: join(localPath, file.name),
            fileExtension,
            drillDown,
            excludeFolder,
            githubToken,
          });
        } else if (
          !file.name.endsWith(fileExtension) ||
          file.type !== 'file' ||
          !file.download_url
        ) {
          return;
        } else if (file.type === 'file' && file.name.endsWith(fileExtension)) {
          await donwloadGitFile(
            file.download_url,
            file.name,
            localPath,
            githubToken,
          );
        }
      }),
    );
  } else if (gitData instanceof Object) {
    if (!gitData.download_url) {
      throw new Error(
        `An error occurred while downloading the file: ${gitData}`,
      );
    }
    // if gitData is an object, it means that it's a file and we can download it
    await donwloadGitFile(
      gitData.download_url,
      gitData.name,
      localPath,
      githubToken,
    );
  } else {
    throw new Error('Provided path is not a valid');
  }
}

export async function getGitData(
  url: string,
  rawResponse: boolean = false,
  githubToken?: string,
): Promise<any> {
  const options: https.RequestOptions = {
    headers: {
      'User-Agent': 'node.js',
    },
  };

  if (githubToken && options.headers) {
    options.headers.Authorization = `token ${githubToken}`;
  }

  const data = await new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(rawResponse ? data : JSON.parse(data)));
      res.on('error', reject);
    });
  });

  return data;
}

async function donwloadGitFile(
  url: string,
  filename: string,
  path: string,
  githubToken?: string,
): Promise<void> {
  const content = await getGitData(url, true, githubToken);
  await createDirAndWriteFile(path, filename, content);
}

function buildGitApiUrl(
  owner: string,
  name: string,
  path: string,
  branch: string,
): string {
  return `https://api.github.com/repos/${owner}/${name}/contents/${path}?ref=${branch}`;
}

export function getGitAbsolutePath(
  base: string,
  relative: string,
  removeFilename: boolean = false,
): string {
  const baseSplit = base.split('/');
  const relativeSplit = relative.split('/');

  // Remove the last component of the base path(should be the file name)
  if (removeFilename) baseSplit.pop();

  for (const component of relativeSplit) {
    if (component === '..') {
      baseSplit.pop();
    } else if (component !== '.') {
      // If the component is not '.', add it to the end of the base path
      baseSplit.push(component);
    }
  }

  // Join the components of the base path back into a single string
  const absolutePath = baseSplit.join('/');
  return absolutePath;
}
