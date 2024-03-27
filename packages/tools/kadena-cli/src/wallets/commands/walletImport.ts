import type { Command } from 'commander';
import ora from 'ora';

import { services } from '../../services/index.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions, securityOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { relativeToCwd } from '../../utils/path.util.js';
import { walletOptions } from '../walletOptions.js';

export const createImportWalletCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'import',
  'Import (restore) wallet from mnemonic phrase',
  [
    walletOptions.keyMnemonic(),
    securityOptions.createPasswordOption({
      message: 'Enter the new wallet password',
      confirmPasswordMessage: 'Re-enter the password',
    }),
    walletOptions.walletName(),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (option, { collect }) => {
    const config = await collect(option);
    log.debug('import-wallet:action', config);

    const loading = ora('Importing...').start();
    try {
      const wallet = await services.wallet.import({
        alias: config.walletName,
        legacy: config.legacy,
        password: config.passwordFile,
        mnemonic: config.keyMnemonic,
      });

      loading.succeed('Wallet imported successfully');

      log.info(
        log.generateTableString(['Mnemonic Phrase'], [[config.keyMnemonic]]),
      );
      log.info(
        log.color.yellow(
          `\nPlease store the mnemonic phrase in a safe place. You will need it to recover your wallet.\n`,
        ),
      );
      log.info(
        log.generateTableString(
          ['Wallet Storage Location'],
          [[relativeToCwd(wallet.filepath)]],
        ),
      );
      log.output(null, {
        words: config.keyMnemonic,
        wallet,
      });
    } catch (error) {
      loading.fail('Failed to import wallet');
      if (error instanceof Error) {
        log.error(error.message);
      } else {
        throw error;
      }
    }
  },
);
