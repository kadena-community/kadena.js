import { select } from '@inquirer/prompts';
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
import { removeAfterFirstDot } from '../../utils/path.util.js';
import { getWallet, getWalletContent } from '../utils/keysHelpers.js';
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
  keyWallet: string,
  currentPassword: string,
  newPassword: string,
): Promise<CommandResult<{}>> => {
  const wallet = await getWallet(keyWallet);
  const walletContent = await getWalletContent(keyWallet);
  if (wallet === null || walletContent === null) {
    return { success: false, errors: [`Wallet: ${keyWallet} does not exist.`] };
  }

  let encryptedNewSeed: EncryptedString | undefined;
  if (wallet.legacy === true) {
    encryptedNewSeed = await kadenaChangePassword(
      walletContent as EncryptedString,
      currentPassword,
      newPassword,
    );
  } else {
    const decryptedCurrentSeed = kadenaDecrypt(
      currentPassword,
      walletContent as EncryptedString,
    );
    encryptedNewSeed = kadenaEncrypt(newPassword, decryptedCurrentSeed);
  }

  await storageService.storeWallet(
    encryptedNewSeed,
    wallet.folder,
    wallet.legacy,
  );
  console.log(chalk.green(`\nWallet password successfully updated..\n`));
  console.log('filename: ', wallet.wallet);

  return { success: true, data: {} };
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

      // compare passwords
      if (config.securityNewPassword !== config.securityVerifyPassword) {
        console.log(chalk.red(`\nPasswords don't match. Please try again.\n`));
        process.exit(1);
      }

      if (typeof config.keyWallet === 'string') {
        throw new Error('Invalid wallet name');
      }

      const result = await changeWalletPassword(
        config.keyWallet.fileName,
        config.securityCurrentPassword,
        config.securityNewPassword,
      );
      assertCommandError(result);

      const { wallet: keyWallet, fileName } = config.keyWallet;

      const isLegacy = fileName.includes('.legacy');

      let encryptedNewSeed: EncryptedString | undefined;

      if (isLegacy === true) {
        encryptedNewSeed = await kadenaChangePassword(
          keyWallet as EncryptedString,
          config.securityCurrentPassword,
          config.securityNewPassword,
        );
      } else {
        const decryptedCurrentSeed = kadenaDecrypt(
          config.securityCurrentPassword,
          keyWallet as EncryptedString,
        );
        encryptedNewSeed = kadenaEncrypt(
          config.securityNewPassword,
          decryptedCurrentSeed,
        );
      }

      console.log(chalk.green(`\nWallet password successfully updated..\n`));
      console.log('filename: ', fileName);
      await storageService.storeWallet(
        encryptedNewSeed,
        removeAfterFirstDot(fileName),
        isLegacy,
      );
    } catch (error) {
      console.log(chalk.red(`\n${error.message}\n`));
      process.exit(1);
    }
  },
);
