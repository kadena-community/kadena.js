import type { Command } from 'commander';
import { services } from '../../services/index.js';

import path from 'node:path';
import { writeAccountAliasMinimal } from '../../account/utils/createAccountConfigFile.js';
import { ACCOUNT_DIR } from '../../constants/config.js';
import { KadenaError } from '../../services/service-error.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions, securityOptions } from '../../utils/globalOptions.js';
import { handleNoKadenaDirectory } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { relativeToCwd } from '../../utils/path.util.js';
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
    if (ACCOUNT_DIR === null) {
      throw new KadenaError('no_kadena_directory');
    }

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

      log.info(log.color.green('Mnemonic Phrase'));
      log.info(created.words);
      log.info(
        log.color.yellow(
          `\nPlease store the mnemonic phrase in a safe place. You will need it to recover your wallet.\n`,
        ),
      );

      log.info(log.color.green(`First keypair generated`));
      log.info(`publicKey: ${key.publicKey}\n`);

      log.info(log.color.green('Wallet Storage Location'));
      log.info(relativeToCwd(wallet.filepath));
      log.info();
      if (config.createAccount === 'true') {
        const accountFilepath = path.join(ACCOUNT_DIR, `${wallet.alias}.yaml`);
        const accountName = `k:${wallet.keys[0].publicKey}`;
        await writeAccountAliasMinimal(
          {
            accountName,
            fungible: 'coin',
            predicate: `keys-all`,
            publicKeysConfig: [wallet.keys[0].publicKey],
          },
          accountFilepath,
        );
        log.info(log.color.green(`Account created`));
        log.info(`accountName: ${accountName}\n`);

        log.info(log.color.green('Account Storage Location'));
        log.info(relativeToCwd(accountFilepath));

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
