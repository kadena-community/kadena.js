import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaDecrypt } from '@kadena/hd-wallet';

import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { toHexStr } from '../utils/keysHelpers.js';

export const decrypt = async (
  password: string,
  keyMessage: EncryptedString,
): Promise<CommandResult<{ value: string }>> => {
  try {
    const decryptedMessage = await kadenaDecrypt(password, keyMessage);

    const isLegacy = decryptedMessage.byteLength >= 128;

    if (isLegacy === true) {
      return {
        success: false,
        errors: [`Decryption is not available for legacy keys.`],
      };
    }

    return { success: true, data: { value: toHexStr(decryptedMessage) } };
  } catch (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }
};

export const createDecryptCommand: (program: Command, version: string) => void =
  createCommand(
    'decrypt',
    'decrypt message',
    [globalOptions.keyMessage(), globalOptions.securityCurrentPassword()],
    async (config) => {
      debug('decrypt:action')({ config });

      if (config.keyMessage === undefined) {
        throw new Error('Missing keyMessage');
      }

      console.log(
        chalk.yellow(`You are about to decrypt this this message.\n`),
      );

      const result = await decrypt(
        config.securityCurrentPassword,
        config.keyMessage as EncryptedString,
      );

      assertCommandError(result);

      console.log(chalk.green(`\nDecrypted message: ${result.data.value}`));
      console.log(chalk.yellow(`\nPlease store it in a safe place.\n`));
    },
  );
