import { program } from 'commander';

import { getAllWallets } from '../keys/utils/keysHelpers.js';

import { isValidFilename } from '../utils/helpers.js';
import { log } from '../utils/logger.js';
import { input, select } from '../utils/prompts.js';

export async function walletWallet(): Promise<string> {
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

export async function walletWalletSelectPrompt(): Promise<string> {
  return walletSelectionPrompt();
}

export async function walletWalletSelectAllPrompt(): Promise<string> {
  return walletSelectionPrompt(['all']);
}

export async function walletWalletSelectNonePrompt(): Promise<string> {
  return walletSelectionPrompt(['none']);
}

export async function walletWalletSelectAllOrNonePrompt(): Promise<string> {
  return walletSelectionPrompt(['all', 'none']);
}

export async function walletWalletPrompt(): Promise<string> {
  const existingKeys: string[] = await getAllWallets();

  const choices = existingKeys.map((key) => ({
    value: key,
    name: `alias: ${key}`,
  }));

  // Option to create a new key
  choices.push({ value: 'createWallet', name: 'Create a new wallet' });
  choices.push({
    value: 'createLegacyWallet',
    name: 'Create a new legacy wallet',
  });

  const selectedWallet = await select({
    message: 'Select a wallet',
    choices: choices,
  });

  if (selectedWallet === 'createWallet') {
    await program.parseAsync(['', '', 'keys', 'create-wallet']);
    return walletWalletPrompt();
  }

  if (selectedWallet === 'createLegacyWallet') {
    await program.parseAsync(['', '', 'keys', 'create-wallet', '--legacy']);
    return walletWalletPrompt();
  }

  return selectedWallet;
}
