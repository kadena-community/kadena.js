import type { CommandResult } from '../../utils/command.util.js';
import type { IAddAccountManualConfig } from '../types.js';
import { getAccountFilePath, getUpdatedConfig, isEmpty } from './addHelpers.js';
import { createAccountName } from './createAccountName.js';
import { writeConfigInFile } from './writeConfigInFile.js';

export async function addAccount(
  config: IAddAccountManualConfig,
): Promise<CommandResult<string>> {
  try {
    const filePath = getAccountFilePath(config.accountAlias);

    const accountName =
      config.accountName === undefined || isEmpty(config.accountName)
        ? await createAccountName({
            networkConfig: config.networkConfig,
            chainId: config.chainId,
            publicKeys: config.publicKeysConfig,
            predicate: config.predicate,
          })
        : config.accountName;

    const configWithAccountName = {
      ...config,
      accountName,
    };

    const updatedConfig =
      configWithAccountName.accountDetailsFromChain === undefined
        ? configWithAccountName
        : getUpdatedConfig(
            configWithAccountName,
            configWithAccountName.accountDetailsFromChain,
            configWithAccountName.accountOverwrite,
          );

    const result = await writeConfigInFile(filePath, updatedConfig);
    return {
      success: true,
      data: result,
      warnings: !config.accountDetailsFromChain
        ? [
            `The account "${config.accountName}" is not on chain yet. To create it on-chain, transfer funds to it from ${config.networkConfig.network} and use "fund" command.`,
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
