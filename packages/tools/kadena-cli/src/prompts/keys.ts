import { input, select } from '@inquirer/prompts';
import { validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

import { program } from 'commander';
import {
  getAllWallets,
  getKeysFromWallet,
  getLegacyKeysFromWallet,
  getLegacyWallets,
  getWallets,
} from '../keys/utils/keysHelpers.js';

import chalk from 'chalk';
import type { KeyContent } from '../keys/utils/storage.js';
import { readKeyFileContent } from '../keys/utils/storage.js';
import type { IPrompt } from '../utils/createOption.js';
import { isAlphanumeric } from '../utils/helpers.js';

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

export async function keyMnemonicPrompt(): Promise<string> {
  return await input({
    message: `Enter your 12-word mnemonic phrase:`,
    validate: function (input) {
      const words = input.split(' ');
      if (words.length !== 12) {
        return 'The mnemonic phrase must contain exactly 12 words.';
      }
      if (!validateMnemonic(input, wordlist)) {
        return 'Invalid mnemonic phrase. Please enter a valid 12-word mnemonic.';
      }
      return true;
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
    message: `Enter the index or range of indices for key generation (e.g., 5 or 1-5). Default is 1`,
    default: '1',
  });
}

export async function keyMessagePrompt(): Promise<string> {
  return await input({
    message: `Enter message to decrypt:`,
  });
}

export async function genFromChoicePrompt(): Promise<string> {
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
  specialOptions: string[] = [], // Array of special options
): Promise<string> {
  const existingKeys: string[] = getAllWallets();

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

export const keyWalletSelectPrompt: IPrompt = async (
  previousQuestions,
  args,
  isOptional,
): Promise<string> => {
  return walletSelectionPrompt(); // No special options
};

export const keyWalletSelectAllPrompt: IPrompt = async (
  previousQuestions,
  args,
  isOptional,
): Promise<string> => {
  return walletSelectionPrompt(['all']); // Include "all" option
};

export const keyWalletSelectNonePrompt: IPrompt = async (
  previousQuestions,
  args,
  isOptional,
): Promise<string> => {
  return walletSelectionPrompt(['none']); // Include "no wallet" option
};

export const keyWalletSelectAllOrNonePrompt: IPrompt = async (
  previousQuestions,
  args,
  isOptional,
): Promise<string> => {
  return walletSelectionPrompt(['all', 'none']); // Include both "all" and "no wallet" options
};

export const selectDecryptMessagePrompt: IPrompt = async (
  prev,
  args,
  isOptional,
) => {
  const walletName = await keyWalletSelectPrompt(prev, args, isOptional);
  const keys = getKeysFromWallet(walletName).map((file) => ({
    file,
    type: 'plain' as KeyType,
  }));
  const wallets = getWallets(walletName).map((file) => ({
    file,
    type: 'wallet' as KeyType,
  }));

  const allKeyFiles = [...keys, ...wallets];

  const choices = allKeyFiles.reduce(
    (acc, { file, type }) => {
      const keyContent = readKeyFileContent(file);
      if (keyContent !== undefined) {
        acc.push({
          value: file,
          name: `${file} - ${formatKey(keyContent, type)}`,
        });
      }
      return acc;
    },
    [] as { value: string; name: string }[],
  );

  // Option to enter own key
  choices.push({
    value: 'enterOwnMessage',
    name: 'Enter message to decrypt',
  });

  const selectedKey = await select({
    message: 'Select a key',
    choices: choices,
  });

  if (selectedKey === 'enterOwnMessage') {
    return await input({
      message: `Message to decrypt`,
    });
  }

  return selectedKey;
};

export const keyWalletPrompt: IPrompt = async (prev, args, isOptional) => {
  const existingKeys: string[] = getAllWallets();

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
    return keyWalletPrompt(prev, args, isOptional);
  }

  if (selectedWallet === 'createLegacyWallet') {
    await program.parseAsync(['', '', 'keys', 'create-wallet', '--legacy']);
    return keyWalletPrompt(prev, args, isOptional);
  }

  return selectedWallet;
};

type KeyType = 'plain' | 'plainLegacy' | 'hd' | 'hdLegacy';

export const keyDeleteSelectPrompt: IPrompt = async (
  prev,
  args,
  isOptional,
) => {
  const walletName = await keyWalletSelectPrompt(prev, args, isOptional);
  const plainKeys = getKeysFromWallet(walletName).map((file) => ({
    file,
    type: 'plain' as KeyType,
  }));
  const plainLegacyKeys = getLegacyKeysFromWallet(walletName).map((file) => ({
    file,
    type: 'plainLegacy' as KeyType,
  }));
  const wallets = getWallets(walletName).map((file) => ({
    file,
    type: 'wallet' as KeyType,
  }));
  const legacyWallets = getLegacyWallets(walletName).map((file) => ({
    file,
    type: 'walletLegacy' as KeyType,
  }));

  const allKeyFiles = [
    ...plainKeys,
    ...plainLegacyKeys,
    ...wallets,
    ...legacyWallets,
  ];

  if (allKeyFiles.length === 0) {
    console.log(chalk.red('No files found. Exiting.'));
    process.exit(0);
  }

  const choices = allKeyFiles.reduce(
    (acc, { file, type }) => {
      const keyContent = readKeyFileContent(file);
      if (keyContent !== undefined) {
        // no file content
        acc.push({
          value: file,
          name: `${file} - ${formatKey(keyContent, type)}`,
        });
      }
      return acc;
    },
    [] as { value: string; name: string }[],
  );

  choices.push({
    value: 'all',
    name: '** Delete all keys ** ',
  });

  const selectedKey = await select({
    message: 'Select a key',
    choices: choices,
  });

  return selectedKey;
};

export const confirmDeleteAllKeysPrompt: IPrompt = async (
  previousQuestions,
  args,
  isOptional,
) => {
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

export const keyDeletePrompt: IPrompt = async (
  previousQuestions,
  args,
  isOptional,
) => {
  if (args.defaultValue === undefined) {
    throw new Error('Key file name is required for the delete prompt.');
  }
  const message = `Are you sure you want to delete the key file "${args.defaultValue}"?`;
  return await select({
    message,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
};

export const confirmWalletDeletePrompt: IPrompt = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const message = 'Are you sure you want to delete ALL wallets';

  return await select({
    message,
    choices: [
      { value: 'yes', name: 'Yes, delete all wallets' },
      { value: 'no', name: 'No, do not delete any wallet' },
    ],
  });
};

export const walletDeletePrompt: IPrompt = async (
  previousQuestions,
  args,
  isOptional,
) => {
  if (args.defaultValue === undefined) {
    throw new Error('Walletis required for the delete prompt.');
  }
  const message = `Are you sure you want to delete the wallet: "${args.defaultValue}"?`;
  return await select({
    message,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
};

/**
 * Formats a key based on its type.
 *
 * @param {KeyContent} keyContent - The content of the key to format.
 * @param {KeyType} type - The type of the key (plain, plainLegacy, hd, hdLegacy).
 * @returns {string} The formatted key as a string.
 * @throws {Error} Throws an error if an invalid key type is provided.
 */
function formatKey(keyContent: KeyContent, type: KeyType): string {
  switch (type) {
    case 'plain':
    case 'plainLegacy':
      if (typeof keyContent === 'string') {
        throw new Error(`Invalid key type for plain key: ${type}`);
      }
      return formatTruncated(keyContent.publicKey);

    case 'hd':
    case 'hdLegacy':
      if (typeof keyContent !== 'string') {
        throw new Error(`Invalid key type: ${type}`);
      }
      return formatTruncated(keyContent);

    default:
      throw new Error(`Unrecognized key type: ${type}`);
  }
}

/**
 * Truncates a key string to show only the beginning and end, with ellipsis in the middle.
 *
 * @param {string} key - The key string to be truncated.
 * @returns {string} The truncated key string.
 */
function formatTruncated(key: string): string {
  const start = key.substring(0, 5);
  const end = key.substring(key.length - 5);
  return `${start}..........${end}`;
}
