import yaml from 'js-yaml';
import { services } from '../../services/index.js';
import type { IAddAccountConfig } from '../types.js';

export async function writeAccountAlias(
  config: IAddAccountConfig,
  filePath: string,
): Promise<void> {
  const { publicKeysConfig, predicate, accountName, fungible } = config;
  await services.filesystem.ensureDirectoryExists(filePath);
  await services.filesystem.writeFile(
    filePath,
    yaml.dump({
      name: accountName,
      fungible,
      publicKeys: publicKeysConfig,
      predicate,
    }),
  );
}

export async function createAccountConfigFile(
  filePath: string,
  config: IAddAccountConfig,
): Promise<string> {
  if (await services.filesystem.fileExists(filePath)) {
    throw new Error(`The account configuration "${filePath}" already exists.`);
  }

  await writeAccountAlias(config, filePath);

  return filePath;
}
