import { askForNetwork } from '../networks/networksCreateQuestions';
import type { IQuestion } from '../utils/helpers';
import { isAlphanumeric, isNumeric } from '../utils/helpers';

import { input } from '@inquirer/prompts';
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
