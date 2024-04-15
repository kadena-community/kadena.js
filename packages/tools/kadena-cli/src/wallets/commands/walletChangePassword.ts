import type { Command } from 'commander';
import { Option } from 'commander';
import { z } from 'zod';

import { services } from '../../services/index.js';
import { CommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { createOption } from '../../utils/createOption.js';
import { globalOptions, securityOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { relativeToCwd } from '../../utils/path.util.js';
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
      confirmPasswordMessage: 'Re-enter the password',
    }),
    confirmOption(),
  ],
  async (option) => {
    const { walletNameConfig, walletName } = await option.walletName();
    const wallet = walletNameConfig;
    if (!wallet) {
      throw new Error(`Wallet: ${walletName} does not exist.`);
    }

    const { passwordFile } = await option.passwordFile({ wallet });
    const { newPasswordFile } = await option.newPasswordFile();
    const { confirm } = await option.confirm();

    log.debug('change-wallet-password:action', {
      walletName,
      wallet,
      passwordFile,
      newPasswordFile,
      confirm,
    });

    if (confirm !== true) {
      return log.error(`\nWallet password won't be updated. Exiting..\n`);
    }

    if (wallet === null) {
      throw new CommandError({ errors: ['Invalid wallet'], exitCode: 1 });
    }

    const result = await services.wallet.changePassword(
      wallet,
      passwordFile,
      newPasswordFile,
    );

    log.info(log.color.green(`\nWallet password successfully updated..\n`));
    log.info('Wallet location: ', relativeToCwd(result.filepath));
  },
);
