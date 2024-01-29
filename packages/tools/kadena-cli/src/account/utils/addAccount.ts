import type { CommandResult } from '../../utils/command.util.js';
import type { IAddAccountManualConfig } from '../types.js';
import { getAccountFilePath, getUpdatedConfig } from './addHelpers.js';
import { validateAccountDetails } from './validateAccountDetails.js';
import { writeConfigInFile } from './writeConfigInFile.js';

export async function addAccount(
  config: IAddAccountManualConfig,
  callback: () => Promise<boolean>,
): Promise<CommandResult<string>> {
  const result = await validateAccountDetails(config);
  if (result.success === false) {
    return result;
  }

  const filePath = getAccountFilePath(config.accountAlias);

  if (result.data.isConfigAreSame === false) {
    const overrideFromChain = await callback();
    const updatedConfig = getUpdatedConfig(
      result.data.config,
      result.data.accountDetails,
      overrideFromChain,
    );
    return writeConfigInFile(filePath, updatedConfig);
  }

  return writeConfigInFile(filePath, result.data.config);
}
