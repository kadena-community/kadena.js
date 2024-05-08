import { Option } from 'commander';
import { z } from 'zod';
import { createOption } from '../utils/createOption.js';

export const configOptions = {
  global: createOption({
    key: 'global' as const,
    prompt: () => false,
    validation: z.boolean(),
    defaultIsOptional: false,
    option: new Option(
      '-g, --global',
      'Initialize kadena config directory in the user home directory',
    ),
  }),
};
