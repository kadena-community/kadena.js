import type { CommandResult } from '../../utils/command.util.js';
import type { IAddAccountConfig } from '../types.js';
import { getAccountFilePath, getUpdatedConfig } from './addHelpers.js';
import { createAccountConfigFile } from './createAccountConfigFile.js';

export async function addAccount(
  config: IAddAccountConfig,
): Promise<CommandResult<string>> {
  try {
    const filePath = getAccountFilePath(config.accountAlias);
    const updatedConfig =
      config.accountDetailsFromChain === undefined
        ? config
        : getUpdatedConfig(
            config,
            config.accountDetailsFromChain,
            config.accountOverwrite,
          );

    const result = await createAccountConfigFile(filePath, updatedConfig);
    return {
      success: true,
      data: result,
      warnings: !config.accountDetailsFromChain
        ? [
            `The account "${config.accountName}" is not on chain yet. To create it on-chain, transfer funds to it from ${config.networkConfig.network} and use "kadena account fund" command.`,
          ]
        : [],
    };
  } catch (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }
}
