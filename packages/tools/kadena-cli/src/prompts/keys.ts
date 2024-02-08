import { validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

import { program } from 'commander';
import {
  getAllKeys,
  getAllWallets,
  getWallet,
  isIWalletKey,
  parseKeyPairsInput,
} from '../keys/utils/keysHelpers.js';

import chalk from 'chalk';

import type { IPrompt } from '../utils/createOption.js';
import { isAlphanumeric } from '../utils/helpers.js';
import { input, select } from '../utils/prompts.js';

export async function keyWallet(): Promise<string> {
  return await input({
    message: `Enter your wallet name:`,
    validate: function (input) {
      if (!isAlphanumeric(input)) {
        return 'Wallet must be alphanumeric! Please enter a valid name.';
      }
      return true;
    },
  });
}

export const keyGetAllKeyFilesPrompt: IPrompt<string> = async (args) => {
  let keys: string[] = [];

  if (args.wallet === 'all') {
    keys = (await getAllKeys()).map(
      (file) =>
        `${file.alias} (${
          isIWalletKey(file) ? `wallet ${file.wallet}` : 'plain'
        })`,
    );
  } else {
    const wallet = await getWallet(args.wallet as string);
    keys = wallet?.keys ?? [];
  }

  const choices = keys.map((key) => ({
    value: key,
    name: `${args.wallet}: ${key}`,
  }));

  const choice = await select({
    message: 'Select a key file:',
    choices: choices,
  });

  return choice;
};

export async function keyAliasPrompt(): Promise<string> {
  return await input({
    message: `Enter a alias for your key:`,
    validate: function (input) {
      if (!isAlphanumeric(input)) {
        return 'Alias must be alphanumeric! Please enter a valid name.';
      }
      return true;
    },
  });
}

export async function keyPublicKeyPrompt(): Promise<string> {
  return await input({
    message: `Enter a public key:`,
    validate: function (input) {
      if (!isAlphanumeric(input)) {
        return 'Public key must be alphanumeric! Please enter a valid public key.';
      }
      return true;
    },
  });
}

export async function keySecretKeyPrompt(): Promise<string> {
  return await input({
    message: `Enter a secret key:`,
  });
}

export async function keyMnemonicPrompt(): Promise<string> {
  return await input({
    message: `Enter your 12-word mnemonic phrase:`,
    validate: function (input) {
      const words = input
        .split(' ')
        .map((word) => word.trim())
        .filter((word) => word.length > 0);
      if (words.length !== 12) {
        return 'The mnemonic phrase must contain exactly 12 words.';
      }
      if (!validateMnemonic(input, wordlist)) {
        return 'Invalid mnemonic phrase. Please enter a valid 12-word mnemonic.';
      }
      return true;
    },
    transformer(input) {
      return input
        .split(' ')
        .map((word) => word.trim())
        .filter((word) => word.length > 0)
        .join(' ');
    },
  });
}

export async function keyAmountPrompt(): Promise<string> {
  return await input({
    message: `Enter the amount of keys you want to generate. (alias-{amount} will increment) (default: 1)`,
    default: '1',
  });
}

export async function keyIndexOrRangePrompt(): Promise<string> {
  return await input({
    message: `Enter the index or range of indices for key generation (e.g., 5 or 1-5). Default is 0`,
    default: '0',
  });
}

export async function keyMessagePrompt(): Promise<string> {
  return await input({
    message: `Enter message to decrypt:`,
  });
}

export async function genFromChoicePrompt(): Promise<
  'genPublicKey' | 'genPublicSecretKey' | 'genPublicSecretKeyDec'
> {
  return await select({
    message: 'Select an action',
    choices: [
      {
        value: 'genPublicKey',
        name: 'Generate Public key',
      },
      {
        value: 'genPublicSecretKey',
        name: 'Generate Public and Secret Key',
      },
      {
        value: 'genPublicSecretKeyDec',
        name: 'Generate Public and Secret Key (decrypted)',
      },
    ],
  });
}

async function walletSelectionPrompt(
  specialOptions: string[] = [],
): Promise<string> {
  const existingKeys: string[] = await getAllWallets();

  if (existingKeys.length === 0 && !specialOptions.includes('none')) {
    console.log(chalk.red('No wallets found. Exiting.'));
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

export async function keyWalletSelectPrompt(): Promise<string> {
  return walletSelectionPrompt();
}

export async function keyWalletSelectAllPrompt(): Promise<string> {
  return walletSelectionPrompt(['all']);
}

export async function keyWalletSelectNonePrompt(): Promise<string> {
  return walletSelectionPrompt(['none']);
}

export async function keyWalletSelectAllOrNonePrompt(): Promise<string> {
  return walletSelectionPrompt(['all', 'none']);
}

export async function keyWalletPrompt(): Promise<string> {
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
    return keyWalletPrompt();
  }

  if (selectedWallet === 'createLegacyWallet') {
    await program.parseAsync(['', '', 'keys', 'create-wallet', '--legacy']);
    return keyWalletPrompt();
  }

  return selectedWallet;
}

export const confirmDeleteAllKeysPrompt: IPrompt<string> = async () => {
  const message =
    'Are you sure you want to delete ALL key files? ( Warning: This action cannot be undone. Wallets need to be manually selected for deletion. )';

  return await select({
    message,
    choices: [
      { value: 'yes', name: 'Yes, delete all key files' },
      { value: 'no', name: 'No, do not delete any key files' },
    ],
  });
};

export async function keyPairsPrompt(): Promise<string> {
  return await input({
    message: 'Enter key pairs as a string publicKey=xxx,secretKey=xxx;...',
    validate: function (input) {
      try {
        parseKeyPairsInput(input);
        return true;
      } catch (error) {
        return error.message;
      }
    },
  });
}
