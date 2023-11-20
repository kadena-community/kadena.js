import { input, select } from '@inquirer/prompts';
import { program } from 'commander';
import type { ICustomKeysetsChoice } from '../keys/utils/keysetHelpers.js';
import type { ICustomNetworkChoice } from '../networks/utils/networkHelpers.js';
import {
  capitalizeFirstLetter,
  getExistingKeysets,
  isAlphabetic,
} from '../utils/helpers.js';

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
    message: `Enter the amount of keyPairs you want to generate. (aliases can only be used when generating one key pair) (optional) (default: 1)`,
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

export async function keysetSelectPrompt(
  isOptional: boolean = false,
): Promise<string | 'skip'> {
  const existingKeysets: ICustomKeysetsChoice[] = await getExistingKeysets();

  const choices: ICustomKeysetsChoice[] = existingKeysets.map((keyset) => ({
    value: keyset.value,
    name: keyset.name,
  }));

  if (isOptional) {
    choices.push({
      value: 'skip',
      name: 'Keyset is optional. Continue to next step',
    });
  }

  choices.push({ value: 'createNewKeyset', name: 'Create a new keyset' });

  const selectedKeyset = await select({
    message: 'Select a keyset',
    choices: choices,
  });

  if (selectedKeyset === 'createNewKeyset') {
    await program.parseAsync(['', '', 'keysets', 'create']);
    return keysetSelectPrompt(isOptional);
  } else if (selectedKeyset !== 'skip') {
    return selectedKeyset;
  }

  return 'skip';
}
