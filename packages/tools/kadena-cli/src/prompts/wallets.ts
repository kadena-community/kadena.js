import { services } from '../services/index.js';
import { CommandError } from '../utils/command.util.js';

import { isValidFilename } from '../utils/helpers.js';
import { input, select } from '../utils/prompts.js';

export async function walletNamePrompt(): Promise<string> {
  return await input({
    message: `Enter your wallet name:`,
    validate: function (input) {
      if (!isValidFilename(input)) {
        return `Name is used as a filename. Do not use these characters: \\ / : * ? " < > |. Please choose a different name without these characters.`;
      }
      return true;
    },
  });
}

async function walletSelectionPrompt(
  specialOptions: ('none' | 'all')[] = [],
): Promise<string> {
  const existingKeys = await services.wallet.list();

  if (existingKeys.length === 0 && !specialOptions.includes('none')) {
    throw new CommandError({
      errors: [
        'No wallets found. use "kadena wallet add" to add a new wallet.',
      ],
    });
  }

  const choices = existingKeys.map((key) => ({
    value: key.alias,
    name: `Wallet: ${key.alias}`,
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
  const wallets = await services.wallet.list();
  return await select({
    message: 'Select a wallet',
    choices: [
      {
        value: 'all',
        name: 'All Wallets',
      },
      ...wallets.map((wallet) => ({
        value: wallet.alias,
        name: wallet.alias,
      })),
    ],
  });
}

export async function walletSelectByWalletPrompt(
  wallets: string[] = [],
): Promise<string> {
  if (wallets.length === 0) {
    throw new CommandError({
      errors: [
        'No wallets found containing keys to sign this transaction with. Please use "kadena wallet add" to add a new wallet and generate keys to use for signing, or use "kadena wallet import to import a wallet."',
      ],
    });
  }

  const choices = wallets.map((key) => {
    return {
      value: key,
      name: `Wallet: ${key}`,
    };
  });

  const selectedWallet = await select({
    message: `${wallets.length} wallets found containing the keys for signing this transaction, please select a wallet to sign this transaction with first:`,
    choices: choices,
  });

  return selectedWallet;
}
