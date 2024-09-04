import { services } from '../../../services/index.js';
import { createCommand } from '../../../utils/createCommand.js';
import { isNotEmptyString } from '../../../utils/globalHelpers.js';
import { log } from '../../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';

export const createAccountDeleteCommand = createCommand(
  'delete',
  'Delete account',
  [
    accountOptions.accountSelectWithAll(),
    accountOptions.accountDeleteConfirmation({ isOptional: false }),
  ],
  async (option) => {
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

    if (accountAlias === 'all') {
      const accounts = await services.account.list();
      if (accounts.length === 0) {
        return log.error(
          'No account aliases found. To add an account use `kadena account add` command.',
        );
      }
      for (const account of accounts) {
        await services.account.delete(account.filepath);
      }
    } else {
      const account = await services.account.getByAlias(accountAlias);
      if (!account) {
        return log.error(`Account "${accountAlias}" not found`);
      }

      await services.account.delete(account.filepath);
    }

    const deleteSuccessMsg =
      accountAlias === 'all'
        ? 'All account aliases has been deleted'
        : `The selected account alias "${accountAlias}" has been deleted`;
    log.info(log.color.green(`\n${deleteSuccessMsg}`));
  },
);
