import { input, select } from '@inquirer/prompts';

import { program } from 'commander';
import path from 'path';

import type { ICustomKeysetsChoice } from '../keyset/keysetHelpers.js';

import { ensureFileExists } from '../utils/filesystem.js';
import { getExistingKeysets } from '../utils/helpers.js';

import { defaultKeysetsPath } from '../constants/keysets.js';
import { networkSelectPrompt } from './network.js';

export const keysetSelectPrompt = async (): Promise<string> => {
  const existingKeysets: ICustomKeysetsChoice[] = getExistingKeysets();

  if (existingKeysets.length > 0) {
    return await select({
      message: 'Select a keyset',
      choices: existingKeysets,
    });
  }

  // At this point there is no keyset defined yet.
  // Create and select a new keyset.
  await program.parseAsync(['', '', 'keyset', 'create']);

  return await networkSelectPrompt();
};

export const keysetOverwritePrompt = async (name?: string): Promise<string> => {
  const message =
    typeof name === 'string' && name.length > 0
      ? `Are you sure you want to save the keyset "${name}"?`
      : 'A keyset with this name already exists. Do you want to update it?';

  return await select({
    message,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
};

export const keysetNamePrompt = async (): Promise<string> => {
  const name = await input({
    message: 'Enter a keyset name',
  });

  const filePath = path.join(defaultKeysetsPath, `${name}.yaml`);
  if (ensureFileExists(filePath)) {
    const overwrite = await keysetOverwritePrompt();
    if (overwrite === 'no') {
      return await keysetNamePrompt();
    }
  }

  return name;
};

export const keysetPredicatePrompt = async (): Promise<string> =>
  await select({
    message: 'Select a keyset predicate',
    choices: [
      { value: 'keys-all', name: 'keys-all' },
      { value: 'keys-one', name: 'keys-one' },
      { value: 'keys-two', name: 'keys-two' },
    ],
  });

export const keysetPrompt = async (): Promise<string> => {
  const existingKeysets: ICustomKeysetsChoice[] = getExistingKeysets();

  if (existingKeysets.length > 0) {
    const selectedKeyset = await select({
      message: 'Select a keyset',
      choices: [
        ...existingKeysets,
        { value: undefined, name: 'Create a new keyset' },
      ],
    });

    if (selectedKeyset !== undefined) {
      return selectedKeyset;
    }
  }

  // At this point there is either no keyset defined yet,
  // or the user chose to create a new keyset.
  // Create and select new keyset.
  await program.parseAsync(['', '', 'keyset', 'create']);

  return await keysetPrompt();
};

export const keysetDeletePrompt = async (name: string): Promise<string> =>
  await select({
    message: `Are you sure you want to delete the keyset "${name}"?`,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
