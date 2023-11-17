import { input, select } from '@inquirer/prompts';
import type { ICustomNetworkChoice } from '../networks/utils/networkHelpers.js';
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
