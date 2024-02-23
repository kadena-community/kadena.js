import { join } from 'path';
import { ACCOUNT_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import { isEmpty } from '../utils/addHelpers.js';

async function removeAccount(
  accountAlias: string,
): Promise<[string[], string[]]> {
  const deletedFiles = [];
  const nonDeletedFiles = [];
  const aliases = accountAlias.split(',');
  for (const alias of aliases) {
    const filePath = join(ACCOUNT_DIR, alias.trim());
    if (await services.filesystem.fileExists(filePath)) {
      await services.filesystem.deleteFile(filePath);
      deletedFiles.push(alias);
    } else {
      nonDeletedFiles.push(alias);
    }
  }
  return [deletedFiles, nonDeletedFiles];
}

export const createAccountDeleteCommand = createCommandFlexible(
  'delete',
  'Delete local account',
  [
    accountOptions.accountMultiSelect(),
    accountOptions.accountDeleteConfirmation({ isOptional: false }),
  ],
  async (option) => {
    const { accountAlias } = await option.accountAlias();

    if (isEmpty(accountAlias) || accountAlias.trim().length === 0) {
      log.error('Account alias is not provided or Invalid.');
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
      log.info(log.color.yellow(`\nThe account alias will not be deleted.\n`));
      return;
    }

    const [deletedFiles, nonDeletedFiles] = await removeAccount(accountAlias);

    if (deletedFiles.length) {
      log.info(
        log.color.green(
          `\nThe account alias "${deletedFiles.join(
            ', ',
          )}" file(s) has been deleted.\n`,
        ),
      );
    }

    if (nonDeletedFiles.length) {
      log.info(
        log.color.yellow(
          `\nThe account configuration "${nonDeletedFiles.join(
            ', ',
          )}" file(s) does not exist.\n`,
        ),
      );
    }
  },
);
