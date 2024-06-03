import { join } from 'path';
import { NO_ACCOUNTS_FOUND_ERROR_MESSAGE } from '../../../constants/account.js';
import { services } from '../../../services/index.js';
import { KadenaError } from '../../../services/service-error.js';
import type { CommandResult } from '../../../utils/command.util.js';
import { assertCommandError } from '../../../utils/command.util.js';
import { createCommand } from '../../../utils/createCommand.js';
import { isNotEmptyString } from '../../../utils/globalHelpers.js';
import { log } from '../../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import {
  ensureAccountAliasFilesExists,
  getAccountDirectory,
} from '../utils/accountHelpers.js';

async function deleteAccountDir(): Promise<CommandResult<null>> {
  const accountDir = getAccountDirectory();
  if (accountDir === null) {
    throw new KadenaError('no_kadena_directory');
  }

  try {
    await services.filesystem.deleteDirectory(accountDir);
    return {
      data: null,
      status: 'success',
    };
  } catch (error) {
    return {
      status: 'error',
      errors: ['Failed to delete all account aliases.'],
    };
  }
}

async function removeAccount(
  accountAlias: string,
): Promise<CommandResult<null>> {
  const accountDir = getAccountDirectory();
  if (accountDir === null) {
    throw new KadenaError('no_kadena_directory');
  }

  if (accountAlias === 'all') {
    return await deleteAccountDir();
  }

  const filePath = join(accountDir, `${accountAlias}.yaml`);
  if (await services.filesystem.fileExists(filePath)) {
    await services.filesystem.deleteFile(filePath);
    return {
      data: null,
      status: 'success',
    };
  } else {
    return {
      status: 'error',
      errors: [`The account alias "${accountAlias}" does not exist`],
    };
  }
}

export const createAccountDeleteCommand = createCommand(
  'delete',
  'Delete account',
  [
    accountOptions.accountSelectWithAll(),
    accountOptions.accountDeleteConfirmation({ isOptional: false }),
  ],
  async (option) => {
    const isAccountAliasesExist = await ensureAccountAliasFilesExists();
    if (!isAccountAliasesExist) {
      return log.error(NO_ACCOUNTS_FOUND_ERROR_MESSAGE);
    }

    const { accountAlias } = await option.accountAlias();

    if (!isNotEmptyString(accountAlias.trim())) {
      return log.error('Account alias is not provided or invalid.');
    }

    const { confirm } = await option.confirm({
      accountAlias,
    });

    log.debug('delete-account:action', {
      accountAlias,
      confirm,
    });

    if (confirm === false) {
      return log.warning('The account alias will not be deleted.');
    }

    const result = await removeAccount(accountAlias);
    assertCommandError(result);
    const deleteSuccessMsg =
      accountAlias === 'all'
        ? 'All account aliases has been deleted'
        : `The selected account alias "${accountAlias}" has been deleted`;
    log.info(log.color.green(`\n${deleteSuccessMsg}`));
  },
);
