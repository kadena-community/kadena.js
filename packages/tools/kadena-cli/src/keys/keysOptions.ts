import { Option } from 'commander';
import { z } from 'zod';
import { keys } from '../prompts/index.js';
import { services } from '../services/index.js';
import { createOption } from '../utils/createOption.js';

export const keysOptions = {
  keysFiles: createOption({
    key: 'keyFiles',
    prompt: keys.keyGetAllPlainFilesPrompt,
    validation: z.string(),
    option: new Option(
      '-k, --key-files <keyFiles>',
      'select key file(s) to delete',
    ),
    async transform(value: string) {
      if (value === 'all') return value;
      return services.config.getPlainKeyByAlias(value);
    },
  }),
  keyAmount: createOption({
    key: 'keyAmount' as const,
    prompt: keys.keyAmountPrompt,
    validation: z.string(),
    option: new Option(
      '-n, --key-amount <keyAmount>',
      'Enter the number of key pairs you want to generate (default: 1)',
    ),
    transform: (keyAmount: string) => {
      const parsed = parseInt(keyAmount, 10);
      return isNaN(parsed) ? null : parsed;
    },
  }),
};
