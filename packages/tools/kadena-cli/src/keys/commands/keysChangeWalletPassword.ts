import chalk from 'chalk';
import type { Command } from 'commander';
import { Option } from 'commander';
import debug from 'debug';
import { z } from 'zod';

import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaDecrypt, kadenaEncrypt } from '@kadena/hd-wallet';
import { kadenaChangePassword } from '@kadena/hd-wallet/chainweaver';

import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { createOption } from '../../utils/createOption.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { select } from '../../utils/prompts.js';
import type { IWallet } from '../utils/keysHelpers.js';
import { getWalletContent } from '../utils/keysHelpers.js';
import * as storageService from '../utils/storage.js';

/**
kadena keys delete-wallet --key-wallet "test01.wallet" --confirm-delete
kadena keys create-wallet --key-wallet "test01" --security-password 12345678 --security-verify-password 12345678
kadena keys change-wallet-password --key-wallet "test01.wallet" --security-current-password 12345678 --security-new-password 87654321 --security-verify-password 87654321 --confirm
*/

const confirmOption = createOption({
  key: 'confirm',
  defaultIsOptional: false,
  validation: z.boolean(),
  option: new Option('--confirm', 'Confirm changing wallet password'),
  async prompt() {
    console.log(
      chalk.yellow(
        `\nYou are about to update the password for this wallet. If you lose your password the wallet can not be recovered.\n`,
      ),
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
  'change-wallet-password',
  'update the password for your wallet',
  [
    globalOptions.keyWalletSelect(),
    globalOptions.securityCurrentPassword({ isOptional: false }),
    globalOptions.securityNewPassword({ isOptional: false }),
    globalOptions.securityVerifyPassword({ isOptional: false }),
    confirmOption(),
  ],
  async (config) => {
    try {
      debug('change-wallet-password:action')({ config });

      if (config.confirm !== true) {
        console.log(
          chalk.red(`\nWallet password won't be updated. Exiting..\n`),
        );
        return;
      }

      if (config.securityNewPassword !== config.securityVerifyPassword) {
        console.log(chalk.red(`\nPasswords don't match. Please try again.\n`));
        process.exit(1);
      }

      if (config.keyWalletConfig === null) {
        throw new Error('Invalid wallet');
      }

      const result = await changeWalletPassword(
        config.keyWallet,
        config.keyWalletConfig,
        config.securityCurrentPassword,
        config.securityNewPassword,
      );
      assertCommandError(result);

      console.log(chalk.green(`\nWallet password successfully updated..\n`));
      console.log('Walletname: ', result.data.filename);
    } catch (error) {
      console.log(chalk.red(`\n${error.message}\n`));
      process.exit(1);
    }
  },
);
