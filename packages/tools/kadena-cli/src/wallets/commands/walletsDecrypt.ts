import type { Command } from 'commander';

import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaDecrypt } from '@kadena/hd-wallet';

import { toHexStr } from '../../keys/utils/keysHelpers.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions, securityOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';

export const decrypt = async (
  password: string,
  message: EncryptedString,
): Promise<CommandResult<{ value: string }>> => {
  try {
    const decryptedMessage = await kadenaDecrypt(password, message);

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
    'Decrypt message',
    [
      globalOptions.message({ isOptional: false }),
      securityOptions.createPasswordOption({
        message: 'Enter the password used to encrypt',
      }),
    ],
    async (option, { collect }) => {
      const config = await collect(option);
      log.debug('decrypt:action', config);

      if (config.message === undefined) {
        throw new Error('Missing message');
      }

      log.warning(`You are about to decrypt this message.\n`);

      const result = await decrypt(
        config.passwordFile,
        config.message as EncryptedString,
      );

      assertCommandError(result);

      const header = ['Decrypted Message'];
      const rows = [[result.data.value]];

      log.output(log.generateTableString(header, rows));
      log.info(log.color.yellow(`\nPlease store it in a safe place.\n`));
    },
  );
