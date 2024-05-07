import { INVALID_FILE_NAME_ERROR_MSG } from '../constants/global.js';
import { services } from '../services/index.js';
import type { IWallet } from '../services/wallet/wallet.types.js';
import { CommandError } from '../utils/command.util.js';

import { isValidFilename } from '../utils/globalHelpers.js';
import { input, select } from '../utils/prompts.js';

export async function walletNamePrompt(): Promise<string> {
  return await input({
    message: `Enter your wallet name:`,
    validate: function (input) {
      if (!isValidFilename(input)) {
        return `Name is used as a filename. ${INVALID_FILE_NAME_ERROR_MSG}`;
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
    message: 'Select a wallet:',
    choices: choices,
  });

  return selectedWallet;
}

export async function walletSelectPrompt(): Promise<string> {
  return walletSelectionPrompt();
}

export async function walletSelectAllPrompt(): Promise<string> {
  const wallets = await services.wallet.list();

  // Prevent uselessly prompting the user if there are no wallets
  // 'all' is a safe fallback as the option will result in an empty array
  if (wallets.length === 0) return 'all';

  return await select({
    message: 'Select a wallet:',
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
  wallets: IWallet[] = [],
): Promise<string> {
  if (wallets.length === 0) {
    throw new CommandError({
      errors: [
        'No wallets found containing keys to sign this transaction with. Please use "kadena wallet add" to add a new wallet and generate keys to use for signing, or use "kadena wallet import to import a wallet."',
      ],
    });
  }

  const choices = wallets.map((wallet) => {
    return {
      value: wallet.alias,
      name: `Wallet: ${wallet.alias}`,
    };
  });

  const selectedWallet = await select({
    message: `${wallets.length} wallets found containing the keys for signing this transaction, please select a wallet to sign this transaction with first:`,
    choices: choices,
  });

  return selectedWallet;
}

export async function createWalletPrompt(): Promise<string> {
  return await select({
    message: 'Would you like to create a wallet?',
    choices: [
      { value: 'true', name: 'Yes' },
      { value: 'false', name: 'No' },
    ],
  });
}
