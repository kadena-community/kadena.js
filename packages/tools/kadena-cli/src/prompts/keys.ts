import { checkbox, input, select } from '@inquirer/prompts';

import { program } from 'commander';
import path from 'path';

import type { ICustomKeypairsChoice } from '../keypair/keypairHelpers.js';

import { ensureFileExists } from '../utils/filesystem.js';
import { getExistingKeypairs } from '../utils/helpers.js';
import { networkSelectPrompt } from './network.js';

import { defaultKeypairsPath } from '../constants/keypairs.js';

export const keypairSelectPrompt = async (): Promise<string> => {
  const existingKeypairs: ICustomKeypairsChoice[] = await getExistingKeypairs();

  if (existingKeypairs.length > 0) {
    return await select({
      message: 'Select a keypair',
      choices: existingKeypairs,
    });
  }

  // At this point there is no keypair defined yet.
  // Create and select a new keypair.
  await program.parseAsync(['', '', 'keypair', 'create']);

  return await networkSelectPrompt();
};

export const keypairPrompt = async (): Promise<string> => {
  const existingKeypairs: ICustomKeypairsChoice[] = await getExistingKeypairs();

  if (existingKeypairs.length > 0) {
    const selectedKeypair = await select({
      message: 'Select a keypair',
      choices: [
        ...existingKeypairs,
        { value: undefined, name: 'Create a new keypair' },
      ],
    });

    if (selectedKeypair !== undefined) {
      return selectedKeypair;
    }
  }

  // At this point there is either no keypair defined yet,
  // or the user chose to create a new keypair.
  // Create and select new keypair.
  await program.parseAsync(['', '', 'keypair', 'create']);

  return await keypairPrompt();
};

export const publicKeysPrompt = async (): Promise<string> =>
  await input({
    message: 'Enter zero or more public keys (comma separated).',
  });

export const selectKeypairsPrompt = async (): Promise<string[]> => {
  const existingKeypairs: ICustomKeypairsChoice[] = await getExistingKeypairs();

  if (existingKeypairs.length === 0) {
    return [];
  }

  return await checkbox({
    message: 'Select zero or more keypairs',
    choices: existingKeypairs,
  });
};

export const keypairOverwritePrompt = async (
  name?: string,
): Promise<string> => {
  const message =
    name === 'string' && name.length > 0
      ? `Are you sure you want to save this keypair "${name}"?`
      : 'A keypair with this name already exists. Do you want to update it?';

  return await select({
    message,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
};

export const keypairNamePrompt = async (): Promise<string> => {
  const name = await input({
    message: 'Enter a keypair name',
  });

  const filePath = path.join(defaultKeypairsPath, `${name}.yaml`);
  if (ensureFileExists(filePath)) {
    const overwrite = await keypairOverwritePrompt();
    if (overwrite === 'no') {
      return await keypairNamePrompt();
    }
  }

  return name;
};

export const keypairDeletePrompt = async (name: string): Promise<string> =>
  await select({
    message: `Are you sure you want to delete the keypair "${name}"?`,
    choices: [
      { value: 'yes', name: 'Yes' },
      { value: 'no', name: 'No' },
    ],
  });
