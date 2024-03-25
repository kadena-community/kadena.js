import type { Command } from 'commander';

import { kadenaDecrypt } from '@kadena/hd-wallet';

import jsYaml from 'js-yaml';
import { toHexStr } from '../../keys/utils/keysHelpers.js';
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
      log.debug('decrypt:action', {
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

        const decrypted = {
          publicKey: keypair.publicKey,
          secretKey: toHexStr(
            await kadenaDecrypt(passwordFile, keypair.secretKey),
          ),
        };
        log.output(jsYaml.dump(decrypted, { lineWidth: -1 }));
      } catch (e) {
        log.error(`Failed to export keypair: ${e.message}`);
      }
    },
  );
