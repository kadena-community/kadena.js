import { join, parse } from 'path';
import { ACCOUNT_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import { isEmpty } from '../utils/addHelpers.js';

async function getAllAccountAliases(): Promise<string[]> {
  const files = await services.filesystem.readDir(ACCOUNT_DIR);
  return files.map((file) => parse(file).name);
}

async function removeAccount(
  accountAlias: string,
): Promise<CommandResult<string[]>> {
  const deletedFiles = [];
  const nonDeletedFiles = [];
  const aliases =
    accountAlias === 'all'
      ? await getAllAccountAliases()
      : [accountAlias.trim()];
  for (const alias of aliases) {
    const filePath = join(ACCOUNT_DIR, `${alias}.yaml`);
    if (await services.filesystem.fileExists(filePath)) {
      await services.filesystem.deleteFile(filePath);
      deletedFiles.push(alias);
    } else {
      nonDeletedFiles.push(alias);
    }
  }

  const warnings =
    nonDeletedFiles.length === 1
      ? `\nThe account alias "${nonDeletedFiles[0]}" does not exist`
      : `\nThe following account aliases do not exist:\n${nonDeletedFiles.join(
          '\n',
        )}`;

  return {
    data: deletedFiles,
    success: true,
    warnings: nonDeletedFiles.length > 0 ? [warnings] : undefined,
  };
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
    if (result.data.length > 0) {
      const deleteSuccessMsg =
        accountAlias === 'all'
          ? 'All account aliases has been deleted'
          : `The selected account alias "${accountAlias}" has been deleted`;
      log.info(log.color.green(`\n${deleteSuccessMsg}`));
    }
  },
);
