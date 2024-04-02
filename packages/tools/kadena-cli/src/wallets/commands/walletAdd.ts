import type { Command } from 'commander';
import { services } from '../../services/index.js';

import path from 'node:path';
import { writeAccountAliasMinimal } from '../../account/utils/createAccountConfigFile.js';
import { ACCOUNT_DIR } from '../../constants/config.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions, securityOptions } from '../../utils/globalOptions.js';
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
      message: 'Enter the new wallet password',
      confirmPasswordMessage: 'Re-enter the password',
    }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
    walletOptions.createAccount(),
  ],
  async (option, { collect }) => {
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

      log.info(log.generateTableString(['Mnemonic Phrase'], [[created.words]]));
      log.info(
        log.color.yellow(
          `\nPlease store the mnemonic phrase in a safe place. You will need it to recover your wallet.\n`,
        ),
      );

      log.info(log.color.green(`First keypair generated`));
      log.info(`publicKey: ${key.publicKey}\n`);

      log.info(
        log.generateTableString(
          ['Wallet Storage Location'],
          [[relativeToCwd(wallet.filepath)]],
        ),
      );
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
        log.info(
          log.generateTableString(
            ['Account Storage Location'],
            [[relativeToCwd(accountFilepath)]],
          ),
        );
        // TODO: ask to fund created account
        // - prompt "Do you want to fund the account?"
        // - prompt network
        // - prompt chainId
        log.info(`\nTo fund the account, use the following command:`);
        log.info(`kadena account fund --account ${accountName}`);
      }

      log.output(null, {
        words: created.words,
        wallet,
      });
    } catch (error) {
      if (error instanceof Error) {
        log.error(error.message);
      } else {
        throw error;
      }
    }
  },
);
