import type { IQuestion } from '../utils/helpers.js';
import {
  capitalizeFirstLetter,
  getExistingDevnets,
  isAlphabetic,
} from '../utils/helpers.js';

import { input, select } from '@inquirer/prompts';
import { z } from 'zod';

// eslint-disable-next-line @rushstack/typedef-var
export const DevnetsCreateOptions = z.object({
  name: z.string(),
  port: z.number().optional(),
  useVolume: z.boolean().optional(),
  mountPactFolder: z.string().optional(),
  version: z.string().optional(),
});

export type TDevnetsCreateOptions = z.infer<typeof DevnetsCreateOptions>;

interface IDevnetManageQuestionsQuestions
  extends Pick<IQuestion<TDevnetsCreateOptions>, 'key' | 'prompt'> {}

interface ICustomChoice {
  value: string;
  name?: string;
  description?: string;
  disabled?: boolean | string;
}

export async function askForDevnet(): Promise<string> {
  const existingDevnets: ICustomChoice[] = getExistingDevnets();

  const allDevnetChoices: ICustomChoice[] = [...existingDevnets]
    .filter((v, i, a) => a.findIndex((v2) => v2.name === v.name) === i)
    .map((devnet) => {
      return {
        value: devnet.value,
        name: capitalizeFirstLetter(devnet.value),
      };
    });

  const devnetChoice = await select({
    message:
      'Select an (default) existing devnet configuration or create a new one:',
    choices: [
      ...allDevnetChoices,
      { value: 'CREATE_NEW', name: 'Create a New Devnet' } as ICustomChoice,
    ],
  });

  if (devnetChoice === 'CREATE_NEW') {
    const newDevnetName = await input({
      validate: function (input) {
        if (input === '') {
          return 'Devnet name cannot be empty! Please enter something.';
        }
        if (!isAlphabetic(input)) {
          return 'Devnet name must be alphabetic! Please enter a valid name.';
        }
        return true;
      },
      message: 'Enter the name for your new devnet container:',
    });
    return newDevnetName.toLowerCase();
  }

  return devnetChoice.toLowerCase();
}

export const devnetsCreateQuestions: IQuestion<TDevnetsCreateOptions>[] = [
  {
    key: 'name',
    prompt: async () => await askForDevnet(),
  },
  {
    key: 'port',
    prompt: async () => {
      const port = await input({
        default: '8080',
        message: 'Enter a port number to forward to the Chainweb node API',
        validate: function (input) {
          const port = parseInt(input);
          if (isNaN(port)) {
            return 'Port must be a number! Please enter a valid port number.';
          }
          return true;
        },
      });
      return parseInt(port);
    },
  },
  {
    key: 'useVolume',
    prompt: async () =>
      await select({
        message: 'Would you like to create a persistent volume?',
        choices: [
          { value: false, name: 'No' },
          { value: true, name: 'Yes' },
        ],
      }),
  },
  {
    key: 'mountPactFolder',
    prompt: async () =>
      await input({
        default: '',
        message:
          'Enter the relative path to a folder containing your Pact files to mount (e.g. ./pact) or leave empty to skip.',
      }),
  },
  {
    key: 'version',
    prompt: async () =>
      await input({
        default: 'latest',
        message:
          'Enter the version of the kadena/devnet image you would like to use.',
      }),
  },
];

export const devnetManageQuestions: IDevnetManageQuestionsQuestions[] = [
  ...devnetsCreateQuestions.filter((question) => question.key !== 'name'),
];
