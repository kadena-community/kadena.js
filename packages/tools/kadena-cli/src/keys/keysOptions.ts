import { Option } from 'commander';
import { z } from 'zod';
import { keys } from '../prompts/index.js';
import { createOption } from '../utils/createOption.js';

export const keysOptions = {
  keyAmount: createOption({
    key: 'keyAmount' as const,
    prompt: keys.keyAmountPrompt,
    validation: z.string(),
    option: new Option(
      '-n, --key-amount <keyAmount>',
      'Number of key pairs you want to generate (default: 1)',
    ),
    transform: (keyAmount: string) => {
      const parsed = parseInt(keyAmount, 10);
      return isNaN(parsed) ? null : parsed;
    },
  }),
};
