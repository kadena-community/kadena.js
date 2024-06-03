import { dirname, join } from 'path';
import { services } from '../../../services/index.js';
import { shallowFindFile } from './shallowFindFile.js';

export const TARGET_PACKAGE: '.kadena/pactjs-generated' =
  '.kadena/pactjs-generated' as const;

export const findPackageJson = async (): Promise<string | never> => {
  const packageJson: string | undefined = await shallowFindFile(
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
  return join(dirname(packageJson), 'node_modules', TARGET_PACKAGE);
};

export const prepareTargetDirectory = async (
  targetDirectory: string,
  clean: boolean = true,
): Promise<void> => {
  if (clean === true) {
    await services.filesystem.deleteDirectory(targetDirectory);
  }

  await services.filesystem.ensureDirectoryExists(targetDirectory);
};
