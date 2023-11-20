import { input } from '@inquirer/prompts';
import type { IPrompt } from '../utils/createOption.js';
import { isAlphanumeric } from '../utils/helpers.js';

export async function genericFileName(type?: string): Promise<string> {
  return await input({
    message: `Enter a filename${type !== '' ? ` for your ${type}` : ''}`,
    validate: function (input) {
      if (!isAlphanumeric(input)) {
        return 'Filenames must be alphabetic! Please enter a valid name.';
      }
      return true;
    },
  });
}

export async function getInput(
  message: string,
  defaultValue?: string,
): Promise<string> {
  const promptConfig: { message: string; default?: string } = { message };

  if (defaultValue !== undefined) {
    promptConfig.default = defaultValue;
  }

  return await input(promptConfig);
}

export function externalPrompt(
  promptFunction: IPrompt,
): (defaultValue?: string) => Promise<string> {
  return async function wrappedPrompt(defaultValue?: string): Promise<string> {
    return await promptFunction({}, { defaultValue }, false);
  };
}
