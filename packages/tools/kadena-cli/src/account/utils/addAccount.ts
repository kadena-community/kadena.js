import type { CommandResult } from '../../utils/command.util.js';
import type { IAddAccountManualConfig } from '../types.js';
import { getFilePath, getUpdatedConfig } from './addHelpers.js';
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

  if (result.data.isConfigAreSame === false) {
    const overrideFromChain = await callback();
    const updatedConfig = getUpdatedConfig(
      result.data.config,
      result.data.accountDetails,
      overrideFromChain,
    );
    const writeResult = await writeConfigInFile(
      getFilePath(config.accountAlias),
      updatedConfig,
    );
    return writeResult;
  }

  const writeResult = await writeConfigInFile(
    getFilePath(config.accountAlias),
    result.data.config,
  );

  return writeResult;
}
