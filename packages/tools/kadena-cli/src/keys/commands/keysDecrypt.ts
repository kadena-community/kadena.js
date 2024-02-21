import type { Command } from 'commander';

import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaDecrypt } from '@kadena/hd-wallet';

import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
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
    'Decrypt message',
    [
      globalOptions.keyMessage({ isOptional: false }),
      globalOptions.securityCurrentPassword({ isOptional: false }),
    ],
    async (config) => {
      log.debug('decrypt:action', { config });

      if (config.keyMessage === undefined) {
        throw new Error('Missing keyMessage');
      }

      log.warning(`You are about to decrypt this message.\n`);

      const result = await decrypt(
        config.securityCurrentPassword,
        config.keyMessage as EncryptedString,
      );

      assertCommandError(result);

      log.info(log.color.green(`\nDecrypted message: ${result.data.value}`));
      log.info(log.color.yellow(`\nPlease store it in a safe place.\n`));
    },
  );
