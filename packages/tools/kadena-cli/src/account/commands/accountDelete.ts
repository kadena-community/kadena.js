import { join } from 'path';
import { ACCOUNT_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import { isEmpty } from '../utils/addHelpers.js';

async function deleteAccountDir(): Promise<CommandResult<null>> {
  try {
    await services.filesystem.deleteDirectory(ACCOUNT_DIR);
    return {
      data: null,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      errors: ['Failed to delete all keys'],
    };
  }
}

async function removeAccount(
  accountAlias: string,
): Promise<CommandResult<null>> {
  if (accountAlias === 'all') {
    return await deleteAccountDir();
  }

  const filePath = join(ACCOUNT_DIR, `${accountAlias}.yaml`);
  if (await services.filesystem.fileExists(filePath)) {
    await services.filesystem.deleteFile(filePath);
    return {
      data: null,
      success: true,
    };
  } else {
    return {
      success: false,
      errors: [`The account alias "${accountAlias}" does not exist`],
    };
  }
}

export const createAccountDeleteCommand = createCommand(
  'delete',
  'Delete local account',
  [
    accountOptions.accountSelectWithAll(),
    accountOptions.accountDeleteConfirmation({ isOptional: false }),
  ],
  async (option) => {
    const { accountAlias } = await option.accountAlias();

    if (isEmpty(accountAlias) || accountAlias.trim().length === 0) {
      log.error('\nAccount alias is not provided or Invalid.\n');
      return;
    }

    const { confirm } = await option.confirm({
      accountAlias,
    });

    log.debug('delete-account:action', {
      accountAlias,
      confirm,
    });

    if (confirm === false) {
      log.info(log.color.yellow(`\nThe account alias will not be deleted.`));
      return;
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
