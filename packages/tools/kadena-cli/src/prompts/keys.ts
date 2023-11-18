import { input, select } from '@inquirer/prompts';
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

export const keySelectKeyset = async (): Promise<string | undefined> => {
  const existingKeysets: ICustomKeysetsChoice[] = await getExistingKeysets();

  if (existingKeysets.length > 0) {
    const selectedKeyset = await select({
      message: 'Select a keyset',
      choices: existingKeysets,
    });

    if (selectedKeyset !== undefined) {
      return selectedKeyset;
    }
  }
  return undefined;
};
