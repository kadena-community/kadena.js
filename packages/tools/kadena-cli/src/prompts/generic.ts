import { input } from '@inquirer/prompts';

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

// Utility function to get user input
export async function getInput(message: string): Promise<string> {
  return await input({
    message,
  });
}
