import yaml from 'js-yaml';
import { services } from '../../services/index.js';
import type { IAccountAliasFileConfig } from '../types.js';
import { accountAliasFileSchema, formatZodErrors } from './accountHelpers.js';

export async function writeAccountAlias(
  config: IAccountAliasFileConfig,
  filePath: string,
): Promise<void> {
  const { publicKeysConfig, predicate, accountName, fungible } = config;
  await services.filesystem.ensureDirectoryExists(filePath);
  try {
    const aliasData = {
      name: accountName,
      fungible,
      publicKeys: publicKeysConfig,
      predicate,
    };
    accountAliasFileSchema.parse(aliasData);
    await services.filesystem.writeFile(filePath, yaml.dump(aliasData));
  } catch (error) {
    const errorMessage = formatZodErrors(error);
    throw new Error(`Error writing alias file: ${filePath}\n ${errorMessage}`);
  }
}

export async function createAccountConfigFile(
  filePath: string,
  config: IAccountAliasFileConfig,
): Promise<string> {
  if (await services.filesystem.fileExists(filePath)) {
    throw new Error(`The account configuration "${filePath}" already exists.`);
  }

  await writeAccountAlias(config, filePath);

  return filePath;
}
