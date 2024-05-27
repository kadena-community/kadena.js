import type { IPrompt } from '../utils/createOption.js';
import { input, select } from '../utils/prompts.js';

export const typescriptClean: IPrompt<boolean> = async () =>
  await select({
    message: 'Would you like to remove pact generated types from your project?',
    choices: [
      { value: false, name: 'No' },
      { value: true, name: 'Yes' },
    ],
  });

export const typescriptCapsInterface: IPrompt<string> = async () =>
  await input({
    default: '',
    message: 'Enter a custom name for the interface of the capabilities:',
  });

export const typescriptFile: IPrompt<string> = async () =>
  await input({
    message: 'Enter zero or more local Pact contract files (comma separated):',
  });

export const typescriptContract: IPrompt<string> = async () =>
  await input({
    message:
      'Enter zero or more contracts that exist on the blockchain (comma separated):',
  });

export const typescriptNamespace: IPrompt<string> = async () =>
  await input({
    default: '',
    message:
      'Enter the namespace of the contract if its not clear in the contract:',
  });
