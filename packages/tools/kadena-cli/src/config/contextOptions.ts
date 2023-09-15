import { IQuestion } from '../utils/helpers';

import { select } from '@inquirer/prompts';
import { z } from 'zod';

// eslint-disable-next-line @rushstack/typedef-var
export const ContextOptions = z.object({
  context: z.enum(['mainnet', 'testnet', 'devnet']),
});

export type TContextOptions = z.infer<typeof ContextOptions>;

const contextChoices: { value: string; name: string }[] = [
  { value: 'mainnet', name: 'Mainnet' },
  { value: 'testnet', name: 'Testnet' },
  { value: 'devnet', name: 'Devnet' },
];

export const contextQuestions: IQuestion<TContextOptions>[] = [
  {
    key: 'context',
    prompt: async () => {
      const result = await select({
        message: 'Choose your context',
        choices: contextChoices,
      });
      return result as TContextOptions['context'];
    },
  },
];
