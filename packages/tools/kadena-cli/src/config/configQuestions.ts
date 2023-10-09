import type { IQuestion } from '../utils/helpers.js';
import {
  capitalizeFirstLetter,
  getExistingNetworks,
  isAlphanumeric,
  isNumeric,
} from '../utils/helpers.js';

import { input, select } from '@inquirer/prompts';
import { z } from 'zod';

// eslint-disable-next-line @rushstack/typedef-var
export const ConfigOptions = z.object({
  projectName: z.string(),
  network: z.string(),
  chainId: z
    .number({
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      invalid_type_error: 'Error: -c, --chain must be a number',
    })
    .min(0)
    .max(19),
});

export type TConfigOptions = z.infer<typeof ConfigOptions>;

interface ICustomChoice {
  value: string;
  name?: string;
  description?: string;
  disabled?: boolean | string;
}

export async function askForNetwork(): Promise<string> {
  const existingNetworks: ICustomChoice[] = getExistingNetworks();
  existingNetworks
    .filter((v, i, a) => a.findIndex((v2) => v2.name === v.name) === i)
    .map((network) => {
      return {
        value: network.value,
        name: capitalizeFirstLetter(network.value),
      };
    });

  const networkChoice = await select({
    message: 'Select an existing network',
    choices: existingNetworks,
  });

  return networkChoice.toLowerCase();
}

export const configQuestions: IQuestion<TConfigOptions>[] = [
  {
    key: 'projectName',
    prompt: async () =>
      await input({
        validate: function (input) {
          if (input === '') {
            return 'Network name cannot be empty! Please enter something.';
          }
          if (!isAlphanumeric(input)) {
            return 'Project name must be alphanumeric! Please enter a valid projectname.';
          }
          return true;
        },
        message: 'Enter your project name',
      }),
  },
  {
    key: 'network',
    prompt: async () => await askForNetwork(),
  },
  {
    key: 'chainId',
    prompt: async () => {
      const chainID = await input({
        default: '0',
        validate: function (input) {
          if (input === '') {
            return 'ChainId cannot be empty! Please enter a number.';
          }
          if (!isNumeric(input)) {
            return 'ChainId must be numeric! Please enter a valid chain.';
          }
          return true;
        },
        message: 'Enter chainId (0-19)',
      });
      return parseInt(chainID, 10);
    },
  },
];
