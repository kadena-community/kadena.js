import { isAlphabetic } from '../utils/helpers.js';
import { input } from '@inquirer/prompts';
import { z } from 'zod';
// eslint-disable-next-line @rushstack/typedef-var
export const PlainKeygenOptions = z.object({
    alias: z.string().optional(),
    amount: z.number().optional(),
});
export const plainKeygenQuestions = [
    {
        key: 'alias',
        prompt: async () => {
            return await input({
                message: `Enter a alias for your key:`,
                validate: function (input) {
                    if (!isAlphabetic(input)) {
                        return 'Alias must be alphabetic! Please enter a valid name.';
                    }
                    return true;
                },
            });
        },
    },
];
