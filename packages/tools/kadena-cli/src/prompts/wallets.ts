import { getAllWallets } from '../keys/utils/keysHelpers.js';

import { isValidFilename } from '../utils/helpers.js';
import { log } from '../utils/logger.js';
import { input, select } from '../utils/prompts.js';

export async function walletNamePrompt(): Promise<string> {
  return await input({
    message: `Enter your wallet name:`,
    validate: function (input) {
      if (!isValidFilename(input)) {
        return 'Wallet must be alphanumeric! Please enter a valid name.';
      }
      return true;
    },
  });
}

async function walletSelectionPrompt(
  specialOptions: string[] = [],
): Promise<string> {
  const existingKeys: string[] = await getAllWallets();

  if (existingKeys.length === 0 && !specialOptions.includes('none')) {
    log.error('No wallets found. Exiting.');
    process.exit(0);
  }

  const choices = existingKeys.map((key) => ({
    value: key,
    name: `Wallet: ${key}`,
  }));

  // Check for special options and add them
  if (specialOptions.includes('all')) {
    choices.unshift({
      value: 'all',
      name: 'All Wallets',
    });
  }
  if (specialOptions.includes('none')) {
    choices.unshift({
      value: 'none',
      name: 'No Wallet',
    });
  }

  const selectedWallet = await select({
    message: 'Select a wallet',
    choices: choices,
  });

  return selectedWallet;
}

export async function walletSelectPrompt(): Promise<string> {
  return walletSelectionPrompt();
}

export async function walletSelectAllPrompt(): Promise<string> {
  return walletSelectionPrompt(['all']);
}

export async function walletSelectNonePrompt(): Promise<string> {
  return walletSelectionPrompt(['none']);
}

export async function walletSelectAllOrNonePrompt(): Promise<string> {
  return walletSelectionPrompt(['all', 'none']);
}
