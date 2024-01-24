import yaml from 'js-yaml';
import { services } from '../../services/index.js';
import { IAddAccountManualConfig } from '../types.js';

export async function writeAlias(
  config: IAddAccountManualConfig,
  filePath: string,
): Promise<void> {
  const { publicKeysConfig, predicate, accountName, fungible } = config;
  await services.filesystem.ensureDirectoryExists(filePath);
  await services.filesystem.writeFile(
    filePath,
    yaml.dump({
      name: accountName,
      fungible,
      publicKeys: publicKeysConfig.filter((key: string) => !!key),
      predicate,
    }),
  );
}

export async function writeConfigInFile(
  filePath: string,
  config: IAddAccountManualConfig,
): Promise<void> {
  if (await services.filesystem.fileExists(filePath)) {
    throw new Error(`The account configuration "${filePath}" already exists.`);
  }

  await writeAlias(config, filePath);
}
