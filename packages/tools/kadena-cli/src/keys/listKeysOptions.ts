import type { IQuestion } from '../utils/helpers.js';
import { capitalizeFirstLetter } from '../utils/helpers.js';

import { password, select } from '@inquirer/prompts';
import { z } from 'zod';

// eslint-disable-next-line @rushstack/typedef-var
export const ListKeysOptions = z.object({
  keyType: z.string(),
  password: z.string().optional(),
});

export type TListKeysOptions = z.infer<typeof ListKeysOptions>;

interface ICustomChoice {
  value: string;
  name?: string;
  description?: string;
  disabled?: boolean | string;
}

export async function askForKeyType(): Promise<string> {
  const keyTypes: ICustomChoice[] = ['hd', 'plain'].map((type) => {
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

export async function askForPassword(
  responses: Partial<TListKeysOptions>,
): Promise<string | undefined> {
  if (responses.keyType === 'plain') {
    return undefined;
  }
  return await password({
    message: 'Enter a password for your HD key:',
    validate: function (value) {
      if (value.length < 8) {
        return 'Password should be at least 6 characters long.';
      }
      return true;
    },
  });
}

export const listKeysQuestions: IQuestion<TListKeysOptions>[] = [
  {
    key: 'keyType',
    prompt: async () => await askForKeyType(),
  },
  {
    key: 'password',
    prompt: async (config, responses) => await askForPassword(responses),
  },
];
