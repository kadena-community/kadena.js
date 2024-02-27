import { Option } from 'commander';
import { z } from 'zod';
import { keys } from '../prompts/index.js';
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
  }),
};
