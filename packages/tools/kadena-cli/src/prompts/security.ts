import { CommandError } from '../utils/command.util.js';
import { password as passwordInput } from '../utils/prompts.js';

// eslint-disable-next-line @kadena-dev/no-eslint-disable
/* eslint-disable @typescript-eslint/explicit-function-return-type */

export const passwordPrompt =
  ({
    message,
    confirmPasswordMessage,
    useStdin = true,
  }: {
    message: string;
    confirmPasswordMessage?: string;
    useStdin?: boolean;
  }) =>
  async (args: Record<string, unknown>) => {
    if (useStdin && (args.stdin as string | null) !== null) return '-';

    const password = await passwordInput({
      message: message,
      mask: '*',
      validate: (value) => {
        if (value.length < 8) {
          return 'Password should be at least 8 characters long.';
        }
        return true;
      },
    });

    if (confirmPasswordMessage !== undefined) {
      const passwordRepeat = await passwordInput({
        message: message,
        mask: '*',
        validate: (value) => {
          if (value.length < 8) {
            return 'Password should be at least 8 characters long.';
          }
          if (password !== value) {
            return 'Passwords do not match.';
          }
          return true;
        },
      });

      if (password === passwordRepeat) {
        return { _password: password };
      } else {
        throw new CommandError({
          errors: ['Passwords do not match. Please try again.'],
          exitCode: 1,
        });
      }
    }
    return { _password: password };
  };
