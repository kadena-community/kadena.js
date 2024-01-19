import { dirname, join } from "path";
import { shallowFindFile } from "./shallowFindFile.js";
import { rimraf } from "rimraf";
import { existsSync } from "fs";
import mkdirp from "mkdirp";

export const TARGET_PACKAGE: '.kadena/pactjs-generated' =
  '.kadena/pactjs-generated' as const;

export const findPackageJson = (): string | never => {
  const packageJson: string | undefined = shallowFindFile(
    process.cwd(),
    'package.json',
  );

  if (
    packageJson === undefined ||
    packageJson.length === 0 ||
    packageJson === '/'
  ) {
    throw new Error('Could not find package.json');
  }

  return packageJson;
};

export const getTargetDirectory = (packageJson: string): string => {
  return join(
    dirname(packageJson),
    'node_modules',
    TARGET_PACKAGE,
  );
}

export const prepareTargetDirectory = (targetDirectory: string, clean: boolean = true): void => {
  if (clean === true) {
    rimraf.sync(targetDirectory);
  }

  if (!existsSync(targetDirectory)) {
    mkdirp.sync(targetDirectory);
  }
}
