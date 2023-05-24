import { $ } from 'execa';
import { readFileSync, writeFileSync } from 'fs';
import inquirer from 'inquirer';
import { parse } from 'jsonc-parser';
import { join } from 'path';

interface IMismatchedVersion {
  dependencyName: string;
  versions: {
    version: string;
    projects: string[];
  }[];
}
interface IRushCheckJson {
  mismatchedVersions: IMismatchedVersion[];
}
interface IRushJson {
  projects: { packageName: string; projectFolder: string }[];
}

interface IPackageJson {
  dependencies: { [key: string]: string };
  devDependencies: { [key: string]: string };
}

async function main(): Promise<void> {
  // run command `rush check --json`
  const { stdout } = await $`rush check --json`;
  const rushCheckJson: IRushCheckJson = JSON.parse(stdout);

  // read rush.json in root of git repo
  const gitRootPath = (await $`git rev-parse --show-toplevel`).stdout;
  const rushJson: IRushJson = parse(
    readFileSync(gitRootPath + '/rush.json', 'utf-8'),
  );

  const questions = rushCheckJson.mismatchedVersions.map(
    (mismatchedVersion) => ({
      type: 'list',
      name: mismatchedVersion.dependencyName,
      message: `Which version of ${
        mismatchedVersion.dependencyName
      } should be used?
${mismatchedVersion.versions
  .map((mv) => `${mv.version} used by:\n  - ${mv.projects.join(',\n  - ')}`)
  .join('\n')}
      `,
      choices: mismatchedVersion.versions.map((version) => version.version),
    }),
  );

  type PackageName = string;
  type Version = string;

  // ask which version to use
  const answers: { [key: PackageName]: Version } = await inquirer.prompt(
    questions,
  );

  rushCheckJson.mismatchedVersions.forEach(async (mismatchedVersion) => {
    // search for the package by packageName in rushJson
    const packageJsons = await getPackageJsonsThatNeedChange(
      mismatchedVersion.dependencyName,
      answers[mismatchedVersion.dependencyName],
      rushCheckJson,
      rushJson,
      gitRootPath,
    );

    // update the package.json files
    packageJsons?.forEach(({ path }) => {
      const contents = JSON.parse(readFileSync(path, 'utf-8'));

      if (contents.dependencies[mismatchedVersion.dependencyName]) {
        contents.dependencies[mismatchedVersion.dependencyName] =
          answers[mismatchedVersion.dependencyName];
      }
      if (contents.devDependencies[mismatchedVersion.dependencyName]) {
        contents.devDependencies[mismatchedVersion.dependencyName] =
          answers[mismatchedVersion.dependencyName];
      }

      // write the package.json files
      const packageJsonContents = JSON.stringify(contents, null, 2);

      console.log(
        `Writing ${path}, changed ${mismatchedVersion.dependencyName} to ${
          answers[mismatchedVersion.dependencyName]
        }`,
      );

      writeFileSync(path, packageJsonContents + '\n');
    });
  });
}

async function getPackageJsonsThatNeedChange(
  packageName: string,
  newVersion: string,
  rushCheckJson: IRushCheckJson,
  rushJson: IRushJson,
  rootPath: string,
): Promise<{ path: string }[] | undefined> {
  const projectsThatNeedChange = rushCheckJson.mismatchedVersions
    .find((m) => m.dependencyName === packageName)
    ?.versions.find((v) => v.version !== newVersion)?.projects;

  if (projectsThatNeedChange) {
    const projectFolders = rushJson.projects
      .filter((p) => projectsThatNeedChange.includes(p.packageName))
      .map((p) => p.projectFolder);

    if (projectFolders.length === 0) {
      throw new Error(`Could not find projectFolder for ${packageName}`);
    }

    const packageJsonPaths = projectFolders.map((projectFolder) =>
      join(rootPath, projectFolder, 'package.json'),
    );

    return Promise.all(
      packageJsonPaths.map((packageJsonPath) => ({
        path: packageJsonPath,
      })),
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
