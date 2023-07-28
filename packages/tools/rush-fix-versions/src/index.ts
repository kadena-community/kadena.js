#!/usr/bin/env node

import { $ } from 'execa';
import { readFileSync, writeFileSync } from 'fs';
import inquirer from 'inquirer';
import { parse } from 'jsonc-parser';
import { basename, dirname, join } from 'path';

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
    readFileSync(`${gitRootPath}/rush.json`, 'utf-8'),
  );

  if (rushCheckJson.mismatchedVersions.length === 0) {
    console.log('No mismatched versions found');
    return;
  }

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
  const newVersions: { [key: PackageName]: Version } = await inquirer.prompt(
    questions,
  );

  const packageJsonsToFix = Object.keys(newVersions)
    .map((newVersionPackageName) => {
      const projects = rushCheckJson.mismatchedVersions
        .find((m) => m.dependencyName === newVersionPackageName)
        ?.versions.filter(
          (v) => v.version !== newVersions[newVersionPackageName],
        )
        .map((v) => v.projects)
        .reduce((a, b) => a.concat(b), []);
      if (!projects) {
        throw new Error(`Could not find projects for ${newVersionPackageName}`);
      }
      return projects.map((p) => getPackageJson(p, rushJson, gitRootPath));
    })
    .reduce((a, b) => a.concat(b), [])
    .reduce(
      (acc, curr) => {
        if (acc.find((a) => a.path === curr.path)) {
          return acc;
        } else {
          acc.push(curr);
          return acc;
        }
      },
      [] as { path: string; contents: IPackageJson }[],
    );

  packageJsonsToFix.forEach(({ path, contents }) => {
    console.log(`Fixing ${dirname(path)}/${basename(path)}`);

    const fixedPackages: string[] = [];
    Object.keys(newVersions).forEach((newVersionPackageName) => {
      const newVersion = newVersions[newVersionPackageName];

      if (contents.dependencies[newVersionPackageName] !== undefined) {
        contents.dependencies[newVersionPackageName] = newVersion;
        fixedPackages.push(newVersionPackageName);
        console.log(`  updating ${newVersionPackageName} to ${newVersion}`);
      }
      if (contents.devDependencies[newVersionPackageName] !== undefined) {
        contents.devDependencies[newVersionPackageName] = newVersion;
        fixedPackages.push(newVersionPackageName);
        console.log(
          `  updating ${newVersionPackageName} to ${newVersion} (dev)`,
        );
      }
    });

    console.log(`Writing ${path}`);

    // write the package.json files
    const packageJsonContents = JSON.stringify(contents, null, 2);
    writeFileSync(path, `${packageJsonContents}\n`);
  });
}

function getPackageJson(
  p: string,
  rushJson: IRushJson,
  gitRootPath: string,
): {
  path: string;
  contents: IPackageJson;
} {
  const project = rushJson.projects.find(
    (project) => project.packageName === p,
  );
  if (!project) {
    throw new Error(`Could not find project ${p} in rush.json`);
  }

  const packageJsonPath = join(
    gitRootPath,
    project.projectFolder,
    'package.json',
  );
  const packageJsonContents = JSON.parse(
    readFileSync(packageJsonPath, 'utf-8'),
  );

  return {
    path: packageJsonPath,
    contents: packageJsonContents,
  };
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
