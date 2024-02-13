import type { IPrompt } from '../utils/createOption.js';
import { isAlphanumeric } from '../utils/helpers.js';
import { input } from '../utils/prompts.js';

export async function genericFileNamePrompt(type?: string): Promise<string> {
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

export async function getInputPrompt(
  message: string,
  defaultValue?: string,
): Promise<string> {
  const promptConfig: { message: string; default?: string } = { message };

  if (defaultValue !== undefined) {
    promptConfig.default = defaultValue;
  }

  return await input(promptConfig);
}

/**
 * Wraps an IPrompt function for external usage, allowing it to be called with an optional default value.
 *
 * @param {IPrompt} promptFunction - The original prompt function to be wrapped.
 * @returns {(defaultValue?: string) => Promise<string>} A wrapped version of the prompt function that takes an optional default value and returns a Promise resolving to a string.
 */
export function externalPrompt(
  promptFunction: IPrompt<any>,
): (defaultValue?: string) => Promise<string> {
  return async function wrappedPrompt(defaultValue?: string): Promise<string> {
    return await promptFunction({}, { defaultValue }, false);
  };
}

/**
 * Creates a map of external prompt functions from a record of IPrompt functions.
 *
 * @template T - A record type where keys are string and values are IPrompt functions.
 * @param {T} prompts - An object containing original prompt functions.
 * @returns {Record<keyof T, (defaultValue?: string) => Promise<string>>} A record where each key is a prompt function name and each value is the corresponding externalized prompt function.
 */
export function createExternalPrompt<T extends Record<string, IPrompt<any>>>(
  prompts: T,
  config?: { [x: string]: any },
): Record<keyof T, (defaultValue?: string) => Promise<string>> {
  return Object.keys(prompts).reduce(
    (acc, key) => {
      acc[key as keyof T] = externalPrompt(prompts[key]);
      return acc;
    },
    {} as Record<keyof T, (defaultValue?: string) => Promise<string>>,
  );
}

export function logFolderPrompt(): Promise<string> {
  return input({
    message: 'Specify the directory where the log file will be generated',
    default: `${process.cwd()}/logs/simulate`,
  });
}
