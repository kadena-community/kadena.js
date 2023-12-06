import { input, select } from '@inquirer/prompts';
import { program } from 'commander';
import {
  getAllHDKeys,
  getHDKeys,
  getHDLegacyKeys,
  getPlainKeys,
  getPlainLegacyKeys,
} from '../keys/utils/keysHelpers.js';

import type { KeyContent } from '../keys/utils/storage.js';
import { readKeyFileContent } from '../keys/utils/storage.js';
import type { ICustomNetworkChoice } from '../networks/utils/networkHelpers.js';
import type { IPrompt } from '../utils/createOption.js';
import { capitalizeFirstLetter, isAlphabetic } from '../utils/helpers.js';

export async function keyAlias(): Promise<string> {
  return await input({
    message: `Enter a alias for your key:`,
    validate: function (input) {
      if (!isAlphabetic(input)) {
        return 'Alias must be alphabetic! Please enter a valid name.';
      }
      return true;
    },
  });
}

export async function keyAmount(): Promise<string> {
  return await input({
    message: `Enter the amount of keyPairs you want to generate. (alias-{amount} will increment) (optional) (default: 1)`,
  });
}

export async function keyAskForKeyType(): Promise<string> {
  const keyTypes: ICustomNetworkChoice[] = ['hd', 'plain'].map((type) => {
    return {
      value: type,
      name: `${capitalizeFirstLetter(type)} key`,
    };
  });

  const keyTypeChoice = await select({
    message: 'Select a key type to generate:',
    choices: keyTypes,
  });

  return keyTypeChoice.toLowerCase();
}

export async function genFromHdChoicePrompt(): Promise<string> {
  return await select({
    message: 'Select an action',
    choices: [
      {
        value: 'genPublicKeyFromHDKey',
        name: 'Generate Public key from HD key',
      },
      {
        value: 'genPublicPrivateKeysFromHDKey',
        name: 'Generate Public and Private key from HD key',
      },
    ],
  });
}

export const keySeed: IPrompt = async (prev, args, isOptional) => {
  const existingKeys: string[] = getAllHDKeys();

  const choices = existingKeys.map((key) => ({
    value: key,
    name: `alias: ${key}`,
  }));

  // Option to enter own key
  choices.push({ value: 'enterOwnSeed', name: 'Enter my own seed' });

  // Option to create a new key
  choices.push({ value: 'createSeed', name: 'Generate a new HD key' });

  const selectedSeed = await select({
    message: 'Select or enter a seed',
    choices: choices,
  });

  if (selectedSeed === 'createSeed') {
    await program.parseAsync(['', '', 'keys', 'generate', 'hd']);
    return keySeed(prev, args, isOptional);
  }

  if (selectedSeed === 'enterOwnSeed') {
    return await input({
      message: `Enter your seed`,
    });
  }

  return selectedSeed;
};

type KeyType = 'plain' | 'plainLegacy' | 'hd' | 'hdLegacy';

export const keySelectPrompt: IPrompt = async (prev, args, isOptional) => {
  const plainKeys = getPlainKeys().map((file) => ({
    file,
    type: 'plain' as KeyType,
  }));
  const plainLegacyKeys = getPlainLegacyKeys().map((file) => ({
    file,
    type: 'plainLegacy' as KeyType,
  }));
  const hdKeys = getHDKeys().map((file) => ({ file, type: 'hd' as KeyType }));
  const hdLegacyKeys = getHDLegacyKeys().map((file) => ({
    file,
    type: 'hdLegacy' as KeyType,
  }));

  const allKeyFiles = [
    ...plainKeys,
    ...plainLegacyKeys,
    ...hdKeys,
    ...hdLegacyKeys,
  ];

  if (allKeyFiles.length === 0) {
    console.log('No keys found. Exiting.');
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
    name: 'Delete all keys ( warning: cannot be undone )',
  });

  const selectedKey = await select({
    message: 'Select a key to delete',
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
    'Are you sure you want to delete ALL key files? This action cannot be undone.';

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
        throw new Error(`Invalid key type for HD key: ${type}`);
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
