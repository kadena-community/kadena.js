import type { Command } from 'commander';
import { services } from '../../services/index.js';

import { getAccountDirectory } from '../../account/utils/accountHelpers.js';
import { createCommand } from '../../utils/createCommand.js';
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
  ],
  async (option, { collect }) => {
    const accountDir = await getAccountDirectory();

    const config = await collect(option);
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
        const { accountName, accountFilepath } =
          await createAccountAliasByPublicKey(
            wallet.alias,
            wallet.keys[0].publicKey,
            accountDir,
          );
        logAccountCreation(accountName, accountFilepath);
        log.info(`\nTo fund the account, use the following command:`);
        log.info(`kadena account fund --account ${accountName}`);
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
