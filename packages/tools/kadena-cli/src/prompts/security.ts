import { CommandError } from '../utils/command.util.js';
import { password } from '../utils/prompts.js';

async function promptForPassword(
  message: string,
  isOptional: boolean = false,
): Promise<string> {
  return await password({
    message: message,
    validate: function (value) {
      if (isOptional && value.length === 0) {
        return true;
      }
      if (value.length < 8) {
        return 'Password should be at least 8 characters long.';
      }
      return true;
    },
  });
}

export async function passwordFilePrompt(
  args: Record<string, unknown>,
): Promise<string | { _password: string }> {
  if ((args.stdin as string | null) !== null) return '-';

  const password = await promptForPassword('Enter a password');
  return { _password: password };
}

export async function passwordFileRepeatPrompt(
  args: Record<string, unknown>,
): Promise<string | { _password: string }> {
  if ((args.stdin as string | null) !== null) return '-';

  const password = await promptForPassword('Enter a password');
  const passwordRepeat = await promptForPassword(
    'Enter a password to verify with password',
  );
  if (password === passwordRepeat) {
    return { _password: password };
  } else {
    throw new CommandError({
      errors: ['Passwords do not match. Please try again.'],
      exitCode: 1,
    });
  }
}

export async function newPasswordFilePrompt(
  args: Record<string, unknown>,
): Promise<string | { _password: string }> {
  if ((args.stdin as string | null) !== null) return '-';

  const password = await promptForPassword('Enter your new password');
  const passwordRepeat = await promptForPassword(
    'Enter a password to verify with password',
  );
  if (password === passwordRepeat) {
    return { _password: password };
  } else {
    throw new CommandError({
      errors: ['Passwords do not match. Please try again.'],
      exitCode: 1,
    });
  }
}

export async function currentPasswordFilePrompt(
  args: Record<string, unknown>,
): Promise<string | { _password: string }> {
  if ((args.stdin as string | null) !== null) return '-';

  const password = await promptForPassword('Enter your current password');
  return { _password: password };
}
