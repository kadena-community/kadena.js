import { isAlphanumeric } from '../utils/helpers.js';
import { confirm, input, password } from '@inquirer/prompts';
import { z } from 'zod';
// eslint-disable-next-line @rushstack/typedef-var
export const HdKeygenOptions = z.object({
    fileName: z.string(),
    password: z.string().optional(),
});
export async function askForPassword() {
    const usePassword = await confirm({
        message: 'Would you like to protect your seed with a password?',
    });
    if (!usePassword) {
        return undefined;
    }
    return await password({
        message: 'Enter a password for your HD key:',
        validate: function (value) {
            if (value.length < 8) {
                return 'Password should be at least 6 characters long.';
            }
            return true;
        },
    });
}
export const hdKeygenQuestions = [
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
    {
        key: 'password',
        prompt: async () => await askForPassword(),
    },
];
