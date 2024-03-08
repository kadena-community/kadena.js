import type { Command } from 'commander';
import { Option } from 'commander';
import { z } from 'zod';

import { WALLET_DIR } from '../../constants/config.js';
import type { IWallet } from '../../keys/utils/keysHelpers.js';
import { getWallet } from '../../keys/utils/keysHelpers.js';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import { CommandError, assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { createOption } from '../../utils/createOption.js';
import { log } from '../../utils/logger.js';
import { select } from '../../utils/prompts.js';
import { walletOptions } from '../walletOptions.js';

export const deleteWallet = async (
  wallet: string,
  walletConfig: IWallet,
): Promise<CommandResult<{}>> => {
  const walletFolderPath = `${WALLET_DIR}/${walletConfig?.folder}`;
  await services.filesystem.deleteDirectory(walletFolderPath);

  return { success: true, data: {} };
};

export const deleteAllWallets = async (): Promise<CommandResult<{}>> => {
  await services.filesystem.deleteDirectory(WALLET_DIR);
  return { success: true, data: {} };
};

const confirmDelete = createOption({
  key: 'confirm',
  defaultIsOptional: false,
  async prompt(args) {
    if (typeof args.walletName !== 'string') return false;

    if (args.walletName === 'all') {
      return await select({
        message: 'Are you sure you want to delete ALL wallets',
        choices: [
          { value: true, name: 'Yes, delete all wallets' },
          { value: false, name: 'No, do not delete any wallet' },
        ],
      });
    }

    const walletData = await getWallet(args.walletName);

    if (!walletData) return false;

    const keysText =
      walletData.keys.length > 0
        ? ` with keys: ${walletData.keys.map((key) => `"${key}"`).join(', ')}`
        : '';

    return await select({
      message: `Are you sure you want to delete the wallet: "${args.walletName}"${keysText}?`,
      choices: [
        { value: true, name: 'Yes' },
        { value: false, name: 'No' },
      ],
    });
  },
  validation: z.boolean(),
  option: new Option('--confirm', 'Confirm wallet deletion'),
});

export const createDeleteWalletsCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'delete',
  'Delete wallet from your local filesystem',
  [walletOptions.walletNameSelectWithAll(), confirmDelete()],
  async (option, { collect }) => {
    const config = await collect(option);
    if (config.confirm !== true) {
      log.warning('\nNo wallets were deleted.\n');
      return;
    }

    log.debug('delete-wallet:action', config);
    if (config.walletName === 'all') {
      const result = await deleteAllWallets();
      assertCommandError(result);
      log.info(log.color.green('\nAll wallets have been deleted.\n'));
    } else {
      if (config.walletNameConfig === null) {
        throw new CommandError({
          errors: [`Wallet: ${config.walletName} does not exist.`],
          exitCode: 1,
        });
      }

      const result = await deleteWallet(
        config.walletName,
        config.walletNameConfig,
      );
      assertCommandError(result);
      log.info(
        log.color.green(
          `\nThe wallet: "${config.walletName}" and associated key files have been deleted.\n`,
        ),
      );
    }
  },
);
