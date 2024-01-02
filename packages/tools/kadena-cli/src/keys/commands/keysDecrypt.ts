import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaDecrypt } from '@kadena/hd-wallet';

import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { toHexStr } from '../utils/keysHelpers.js';

export const createDecryptCommand: (program: Command, version: string) => void =
  createCommand(
    'decrypt',
    'decrypt message',
    [globalOptions.keyMessage(), globalOptions.securityCurrentPassword()],
    async (config) => {
      console.log(config);
      try {
        debug('decrypt:action')({ config });

        if (config.keyMessage === undefined) {
          throw new Error('Missing keyMessage');
        }
        const keyMessage = config.keyMessage as EncryptedString;

        console.log(
          chalk.yellow(`\nYou are about to decrypt this this message.\n`),
        );

        const isLegacy =
          kadenaDecrypt(config.securityCurrentPassword, keyMessage)
            .byteLength >= 128;

        if (isLegacy === true) {
          console.log(
            chalk.red(`\nDecryption is not available for legacy keys.\n`),
          );
          process.exit(1);
        }

        const decryptedMessage = kadenaDecrypt(
          config.securityCurrentPassword,
          keyMessage,
        );

        console.log(
          chalk.green(`\nDecrypted message: ${toHexStr(decryptedMessage)}`),
        );
        console.log(chalk.yellow(`\nPlease store it in a safe place.\n`));
      } catch (error) {
        console.log(chalk.red(`\n${error.message}\n`));
        process.exit(1);
      }
    },
  );
