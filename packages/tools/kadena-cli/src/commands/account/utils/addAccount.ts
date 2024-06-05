import type { CommandResult } from '../../../utils/command.util.js';
import type { IAddAccountConfig } from '../types.js';
import { getAccountFilePath } from './addHelpers.js';
import { createAccountConfigFile } from './createAccountConfigFile.js';

export async function addAccount(
  config: IAddAccountConfig,
): Promise<CommandResult<string>> {
  try {
    const { accountAlias, ...rest } = config;
    const filePath = getAccountFilePath(accountAlias);

    const result = await createAccountConfigFile(filePath, rest);
    return {
      status: 'success',
      data: result,
    };
  } catch (error) {
    return {
      status: 'error',
      errors: [error.message],
    };
  }
}
