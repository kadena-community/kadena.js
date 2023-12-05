import { input, select } from '@inquirer/prompts';
import { program } from 'commander';
import { getAllHDKeys } from '../keys/utils/keysHelpers.js';
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

  if (isOptional === true) {
    choices.unshift({
      value: 'skip',
      name: 'Seed selection is optional. Continue to next step',
    });
  }

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
