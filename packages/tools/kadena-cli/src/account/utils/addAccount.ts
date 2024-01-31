import type { CommandResult } from '../../utils/command.util.js';
import type { IAddAccountManualConfig } from '../types.js';
import { getAccountFilePath, getUpdatedConfig } from './addHelpers.js';
import { validateAccountDetails } from './validateAccountDetails.js';
import { writeConfigInFile } from './writeConfigInFile.js';

export async function addAccount(
  config: IAddAccountManualConfig,
  callback: () => Promise<boolean>,
): Promise<CommandResult<string>> {
  try {
    const filePath = getAccountFilePath(config.accountAlias);
    const { isConfigAreSame, accountDetails, configWithAccountName } =
      await validateAccountDetails(config);

    if (isConfigAreSame === false) {
      const overrideFromChain = await callback();
      const updatedConfig = getUpdatedConfig(
        configWithAccountName,
        accountDetails,
        overrideFromChain,
      );
      const result = await writeConfigInFile(filePath, updatedConfig);
      return {
        success: true,
        data: result,
      };
    }

    const result = await writeConfigInFile(filePath, configWithAccountName);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (
      error.message.includes('row not found') === true &&
      config.publicKeysConfig.length
    ) {
      const accountName = error.message.split('row not found:')[1].trim();
      return {
        success: true,
        data: '',
        warnings: [
          `The account "${accountName}" is not on chain yet. To create it on-chain, transfer funds to it from ${config.networkConfig.network} and use "fund" command.`,
        ],
      };
    }
    return {
      success: false,
      errors: [error.message],
    };
  }
}
