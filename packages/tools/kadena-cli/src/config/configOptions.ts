import { Option } from 'commander';
import { z } from 'zod';
import * as prompts from '../prompts/config.js';
import { createOption } from '../utils/createOption.js';

export const configOptions = {
  location: createOption({
    key: 'location' as const,
    prompt: prompts.configLocationPrompt,
    validation: z.string(),
    option: new Option(
      '-l, --location <location>',
      'Kadena directory in working directory or home directory',
    ),
  }),
};
