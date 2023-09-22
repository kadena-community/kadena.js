import type { IQuestion } from '../utils/helpers';
import { getExistingNetworks } from '../utils/helpers';

import { input, select } from '@inquirer/prompts';
import { z } from 'zod';

// eslint-disable-next-line @rushstack/typedef-var
export const FundQuestions = z.object({
  receiver: z
    .string()
    .min(60, { message: 'Wallet must be 60 or more characters long' })
    .startsWith('k:', { message: 'Wallet should start with k:' }),
  chainId: z
    .number({
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      invalid_type_error: 'Error: -c, --chain must be a number',
    })
    .min(0)
    .max(19),
  network: z.enum(['testnet', 'devnet']),
  networkId: z.string({}),
  project: z.string({}).optional(),
});

export type TFundQuestions = z.infer<typeof FundQuestions>;

export const fundQuestions: IQuestion<TFundQuestions>[] = [
  {
    key: 'receiver',
    prompt: async (config, prevAnswers, args) => {
      const answer = await select({
        message: 'Which account to use?',
        choices: [
          { value: 'fakeaccuntname', name: 'fakeaccountname' },
          { value: undefined, name: `don't pick from listNot from list` },
        ],
      });

      if (answer !== undefined) {
        return answer;
      }

      return await input({
        message:
          'Enter the k:receiver wallet address that will receive the funds',
      });
    },
  },
  {
    key: 'network',
    prompt: async () =>
      await select({
        message: 'Choose your network',
        choices: getExistingNetworks(),
      }),
  },
  {
    key: 'chainId',
    prompt: async (config) =>
      parseInt(
        await input({
          message: 'Enter chainId (0-19)',
        }),
        10,
      ),
  },
  {
    key: 'networkId',
    prompt: async (config, previousAnswers) => {
      return await input({
        message: `Enter ${previousAnswers.network} network Id (e.g. "${previousAnswers.network}04")`,
      });
    },
  },
];
