import { validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

import {
  getAllKeys,
  getAllPlainKeys,
  getWallet,
  isIWalletKey,
  parseKeyPairsInput,
} from '../keys/utils/keysHelpers.js';

import type { IPrompt } from '../utils/createOption.js';
import {
  isValidFilename,
  maskStringPreservingStartAndEnd,
} from '../utils/helpers.js';
import { input, select } from '../utils/prompts.js';

export const keyGetAllPlainFilesPrompt: IPrompt<string> = async () => {
  const choices = (await getAllPlainKeys()).map((data) => {
    return {
      value: data.key,
      name: `${data.key}: ${maskStringPreservingStartAndEnd(data.publicKey)}`,
    };
  });

  if (choices.length === 0) {
    throw new Error('No plain keys found');
  }

  choices.unshift({
    value: 'all',
    name: 'All keys',
  });

  const choice = await select({
    message: 'Select a key file:',
    choices: choices,
  });

  return choice;
};

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
    message: `Enter an alias for your key:`,
    validate: function (input) {
      if (!isValidFilename(input)) {
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
      if (!isValidFilename(input)) {
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
