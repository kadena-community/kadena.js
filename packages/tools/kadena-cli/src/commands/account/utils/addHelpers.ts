import type { IAccount } from '../../../services/account/account.types.js';
import { log } from '../../../utils/logger.js';
import { relativeToCwd } from '../../../utils/path.util.js';

export const displayAddAccountSuccess = (account: IAccount): void => {
  log.info(
    log.color.green(
      `\nThe account configuration "${account.alias}" has been saved in ${relativeToCwd(
        account.filepath,
      )}\n`,
    ),
  );
};
