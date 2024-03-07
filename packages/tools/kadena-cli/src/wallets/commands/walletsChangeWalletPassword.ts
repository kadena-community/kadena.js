import type { Command } from 'commander';
import { Option } from 'commander';
import { z } from 'zod';

import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaDecrypt, kadenaEncrypt } from '@kadena/hd-wallet';
import { kadenaChangePassword } from '@kadena/hd-wallet/chainweaver';

import type { IWallet } from '../../keys/utils/keysHelpers.js';
import { getWalletContent } from '../../keys/utils/keysHelpers.js';
import * as storageService from '../../keys/utils/storage.js';
import type { CommandResult } from '../../utils/command.util.js';
import { CommandError, assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { createOption } from '../../utils/createOption.js';
import { globalOptions, securityOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { select } from '../../utils/prompts.js';

const confirmOption = createOption({
  key: 'confirm',
  defaultIsOptional: false,
  validation: z.boolean(),
  option: new Option('--confirm', 'Confirm changing wallet password'),
  async prompt() {
    log.warning(
      `\nYou are about to update the password for this wallet. If you lose your password the wallet can not be recovered.\n`,
    );

    return await select({
      message: 'Do you wish to update your password?',
      choices: [
        { value: true, name: 'Yes' },
        { value: false, name: 'No' },
      ],
    });
  },
});

export const changeWalletPassword = async (
  wallet: string,
  walletConfig: IWallet,
  currentPassword: string,
  newPassword: string,
): Promise<CommandResult<{ filename: string }>> => {
  const seed = (await getWalletContent(wallet)) as EncryptedString;
  if (walletConfig.wallet === null || seed === null) {
    return {
      success: false,
      errors: [`Wallet: ${walletConfig.wallet} does not exist.`],
    };
  }

  let encryptedNewSeed: EncryptedString;
  if (walletConfig.legacy === true) {
    encryptedNewSeed = await kadenaChangePassword(
      seed,
      currentPassword,
      newPassword,
    );
  } else {
    const decryptedCurrentSeed = await kadenaDecrypt(currentPassword, seed);
    encryptedNewSeed = await kadenaEncrypt(newPassword, decryptedCurrentSeed);
  }

  await storageService.storeWallet(
    encryptedNewSeed,
    walletConfig.folder,
    walletConfig.legacy,
  );

  return { success: true, data: { filename: walletConfig.wallet } };
};

export const createChangeWalletPasswordCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'change-password',
  'Update the password for your wallet',
  [
    globalOptions.walletSelect(),
    securityOptions.createPasswordOption({
      message: 'Enter your current password',
    }),
    securityOptions.createNewPasswordOption({
      message: 'Enter the new wallet password',
      confirmPasswordMessage: 'Re-enter the new password',
    }),
    confirmOption(),
  ],
  async (option, { collect }) => {
    const config = await collect(option);
    log.debug('change-wallet-password:action', config);

    if (config.confirm !== true) {
      return log.error(`\nWallet password won't be updated. Exiting..\n`);
    }

    if (config.walletNameConfig === null) {
      throw new CommandError({ errors: ['Invalid wallet'], exitCode: 1 });
    }

    const result = await changeWalletPassword(
      config.walletName,
      config.walletNameConfig,
      config.passwordFile,
      config.newPasswordFile,
    );
    assertCommandError(result);

    log.info(log.color.green(`\nWallet password successfully updated..\n`));
    log.info('Walletname: ', result.data.filename);
  },
);
