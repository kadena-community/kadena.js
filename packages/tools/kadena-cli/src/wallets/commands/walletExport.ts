import type { Command } from 'commander';

import jsYaml from 'js-yaml';
import { services } from '../../services/index.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions, securityOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { walletOptions } from '../walletOptions.js';

export const createExportCommand: (program: Command, version: string) => void =
  createCommand(
    'export',
    'Export unencrypted keypair(s) from a wallet',
    [
      globalOptions.walletSelect(),
      walletOptions.keyIndex(),
      securityOptions.createPasswordOption({
        message: 'Enter the wallet password:',
      }),
    ],
    async (option) => {
      const { walletNameConfig: wallet } = await option.walletName();
      const { keyIndex } = await option.keyIndex({ wallet });
      log.warning(`Warning: this will print the keypair unencrypted.`);
      const { passwordFile } = await option.passwordFile();
      log.debug('wallet-export:action', {
        wallet,
        keyIndex,
        passwordFile,
      });

      if (!wallet) throw new Error(`Wallet does not exist.`);
      const key = wallet.keys.find((key) => key.index === Number(keyIndex));
      if (!key) throw new Error(`Invalid wallet key index`);
      try {
        const keypair = await services.wallet.getKeyPair(
          wallet,
          key,
          passwordFile,
        );
        log.output(jsYaml.dump(keypair, { lineWidth: -1 }));
      } catch (e) {
        log.error(
          `Failed to export keypair: Incorrect password. Please verify the password and try again.`,
        );
      }
    },
  );
