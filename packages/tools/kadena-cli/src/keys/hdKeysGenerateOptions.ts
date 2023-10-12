import type { IQuestion } from '../utils/helpers.js';
import { isAlphanumeric } from '../utils/helpers.js';

import { input } from '@inquirer/prompts';
import { z } from 'zod';

// eslint-disable-next-line @rushstack/typedef-var
export const HdKeygenOptions = z.object({
  fileName: z.string(),
});

export type THdKeygenOptions = z.infer<typeof HdKeygenOptions>;

export const hdKeygenQuestions: IQuestion<THdKeygenOptions>[] = [
  {
    key: 'fileName',
    prompt: async () => {
      return await input({
        message: `Enter a filename for your HDkey:`,
        validate: function (input) {
          if (!isAlphanumeric(input)) {
            return 'Filenames must be alphabetic! Please enter a valid name.';
          }
          return true;
        },
      });
    },
  },
];
