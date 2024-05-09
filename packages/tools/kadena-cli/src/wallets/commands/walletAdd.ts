import type { Command } from 'commander';
import { services } from '../../services/index.js';

import { accountOptions } from '../../account/accountOptions.js';
import { getAccountDirectory } from '../../account/utils/accountHelpers.js';
import { KadenaError } from '../../services/service-error.js';
import { createCommand } from '../../utils/createCommand.js';
import { notEmpty } from '../../utils/globalHelpers.js';
import { globalOptions, securityOptions } from '../../utils/globalOptions.js';
import { handleNoKadenaDirectory } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import {
  createAccountAliasByPublicKey,
  logAccountCreation,
  logWalletInfo,
} from '../utils/walletHelpers.js';
import { walletOptions } from '../walletOptions.js';

/**
 * Creates a command to generate wallets.
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the program.
 */
export const createGenerateWalletCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'add',
  'Add a new wallet',
  [
    walletOptions.walletName({ isOptional: false }),
    securityOptions.createPasswordOption({
      message: 'Enter the new wallet password:',
      confirmPasswordMessage: 'Re-enter the password:',
      confirmEmptyPassword: true,
    }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
    walletOptions.createAccount(),
    accountOptions.accountAlias({ isOptional: true }),
  ],
  async (option) => {
    const accountDir = getAccountDirectory();
    if (accountDir === null) {
      throw new KadenaError('no_kadena_directory');
    }

    const walletName = await option.walletName();
    const passwordFile = await option.passwordFile();
    const legacy = await option.legacy();
    const createAccount = await option.createAccount();

    let accountAlias = null;
    if (createAccount.createAccount === 'true') {
      accountAlias = await option.accountAlias();
    }

    const config = {
      walletName: walletName.walletName,
      passwordFile: passwordFile.passwordFile,
      legacy: legacy.legacy,
      createAccount: createAccount.createAccount,
      accountAlias: accountAlias?.accountAlias,
    };

    log.debug('create-wallet:action', config);

    try {
      const created = await services.wallet.create({
        alias: config.walletName,
        legacy: config.legacy,
        password: config.passwordFile,
      });
      let wallet = created.wallet;
      const key = await services.wallet.generateKey({
        seed: wallet.seed,
        legacy: wallet.legacy,
        password: config.passwordFile,
        index: 0,
      });
      wallet = await services.wallet.storeKey(wallet, key);

      logWalletInfo(created.words, wallet.filepath, key.publicKey);

      log.info();
      if (config.createAccount === 'true') {
        // when --quiet is passed and account alias is not provided
        // we will not create an account
        if (!notEmpty(config.accountAlias)) {
          log.error(
            'Account alias is required when creating an account: -l, --account-alias <accountAlias>',
          );
          return;
        }

        const { accountName, accountFilepath } =
          await createAccountAliasByPublicKey(
            config.accountAlias,
            wallet.keys[0].publicKey,
            accountDir,
          );
        logAccountCreation(accountName, accountFilepath);
        log.info(`\nTo fund the account, use the following command:`);
        log.info(`kadena account fund --account ${config.accountAlias}`);
      }

      log.output(null, {
        words: created.words,
        wallet,
      });
    } catch (error) {
      if (handleNoKadenaDirectory(error)) return;
      if (error instanceof Error) {
        log.error(error.message);
      } else {
        throw error;
      }
    }
  },
);
