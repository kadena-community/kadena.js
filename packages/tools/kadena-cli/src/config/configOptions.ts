import { IQuestion } from '../utils/helpers';

import { input, select } from '@inquirer/prompts';
import { z } from 'zod';

// eslint-disable-next-line @rushstack/typedef-var
export const GeneralOptions = z.object({
  context: z.enum(['mainnet', 'testnet', 'devnet']),
  publicKey: z
    .string({ required_error: 'Public key is is required' })
    .min(60, { message: 'Public Key must be 60 or more characters long' }),
  privateKey: z
    .string({ required_error: 'Private key is required' })
    .min(60, { message: 'Private Key must be 60 or more characters long' }),
  chainId: z
    .number({
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      invalid_type_error: 'Error: -c, --chain must be a number',
    })
    .min(0)
    .max(19),
  networkId: z.string(),
  networkHost: z.string().optional(),
  networkExplorerUrl: z.string().optional(),
  kadenaNamesApiEndpoint: z.string().optional(),
});

export type TConfigOptions = z.infer<typeof GeneralOptions>;

const contextChoices: { value: string; name: string }[] = [
  { value: 'mainnet', name: 'Mainnet' },
  { value: 'testnet', name: 'Testnet' },
  { value: 'devnet', name: 'Devnet' },
];

export const generalQuestions: IQuestion<TConfigOptions>[] = [
  {
    key: 'context',
    prompt: async () =>
      await select({
        message: 'Choose your context',
        choices: contextChoices,
      }),
  },
  {
    key: 'publicKey',
    prompt: async () => await input({ message: 'Enter your publicKey' }),
  },
  {
    key: 'privateKey',
    prompt: async () => await input({ message: 'Enter your privateKey' }),
  },
  {
    key: 'chainId',
    prompt: async () => await input({ message: 'Enter chainId (0-19)' }),
  },
  {
    key: 'networkId',
    prompt: async (config, previousAnswers) => {
      return await input({
        message: `Enter ${previousAnswers.context} network Id (e.g. "${previousAnswers.context}01")`,
      });
    },
  },
  {
    key: 'networkHost',
    prompt: async () =>
      await input({
        message: 'Enter Kadena network host (e.g. "https://api.chainweb.com")',
      }),
  },
  {
    key: 'networkExplorerUrl',
    prompt: async () =>
      await input({
        message:
          'Enter Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")',
      }),
  },
  {
    key: 'kadenaNamesApiEndpoint',
    prompt: async () =>
      await input({
        message:
          'Enter Kadena Names Api Endpoint (e.g. "https://www.kadenanames.com/api/v1")',
      }),
  },
];
