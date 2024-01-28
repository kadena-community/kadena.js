import yaml from 'js-yaml';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import type { IAddAccountManualConfig } from '../types.js';

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
): Promise<CommandResult<string>> {
  if (await services.filesystem.fileExists(filePath)) {
    return {
      success: false,
      errors: [`The account configuration "${filePath}" already exists.`],
    };
  }

  await writeAlias(config, filePath);

  return {
    success: true,
    data: filePath,
  };
}
