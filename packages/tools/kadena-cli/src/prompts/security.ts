import { services } from '../services/index.js';
import type { IWallet } from '../services/wallet/wallet.types.js';
import { CommandError } from '../utils/command.util.js';
import { input, password as passwordInput } from '../utils/prompts.js';

// eslint-disable-next-line @kadena-dev/no-eslint-disable
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const passwordPrompt =
  ({
    message,
    confirmPasswordMessage,
    confirmEmptyPassword,
    useStdin = true,
  }: {
    message: string;
    confirmPasswordMessage?: string;
    confirmEmptyPassword?: boolean;
    useStdin?: boolean;
  }) =>
  async (
    args: Record<string, unknown>,
  ): Promise<'-' | { _password: string }> => {
    if (useStdin && (args.stdin as string | null) !== null) return '-';
    const wallet = args.wallet as IWallet | undefined;

    // Skip prompting password if wallet doesn't have any
    if (
      wallet &&
      confirmEmptyPassword !== true &&
      (await services.wallet.testPassword(wallet, ''))
    ) {
      return { _password: '' };
    }

    const password = await passwordInput({
      message: message,
      mask: '*',
      validate: async (value) => {
        if (value === '') {
          if (args.legacy === true) {
            return 'Can not use empty password in legacy mode';
          }
          if (confirmEmptyPassword !== true) {
            if (
              wallet &&
              (await services.wallet.testPassword(wallet, value)) === false
            ) {
              return 'Password is incorrect. Please try again.';
            }
          }
          return true;
        }

        if (value.length < 8) {
          return 'Password should be at least 8 characters long.';
        }

        if (
          wallet &&
          (await services.wallet.testPassword(wallet, value)) === false
        ) {
          return 'Password is incorrect. Please try again.';
        }

        return true;
      },
    });

    if (password === '') {
      if (confirmEmptyPassword !== true) return { _password: password };
      const optionConfirm = ['y', 'yes'];
      const optionDeny = ['n', 'no'];
      const validate = await input({
        message:
          'Not using a password will store your wallet unencrypted. Are you sure? (y/n):',
        validate(val) {
          const valid = [...optionConfirm, ...optionDeny].includes(
            val.toLowerCase(),
          );
          return valid
            ? true
            : 'You must provide confirmation being "y" or "n"';
        },
      });
      if (optionDeny.includes(validate.toLowerCase())) {
        return await passwordPrompt({
          message,
          confirmPasswordMessage,
          useStdin,
        })(args);
      } else if (optionConfirm.includes(validate.toLowerCase())) {
        return { _password: password };
      } else {
        throw new Error('invalid response from no-password validate');
      }
    }

    if (confirmPasswordMessage !== undefined) {
      const passwordRepeat = await passwordInput({
        message: confirmPasswordMessage,
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
