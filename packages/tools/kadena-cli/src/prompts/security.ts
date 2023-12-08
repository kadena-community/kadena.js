import { password } from '@inquirer/prompts';

export async function promptForPassword(message: string): Promise<string> {
  return await password({
    message: message,
    validate: function (value) {
      if (value.length < 8) {
        return 'Password should be at least 8 characters long.';
      }
      return true;
    },
  });
}

export async function securityPasswordPrompt(): Promise<string> {
  return promptForPassword('Enter a password');
}

export async function securityCurrentPasswordPrompt(): Promise<string> {
  return promptForPassword('Enter your current password');
}

export async function securityNewPasswordPrompt(): Promise<string> {
  return promptForPassword('Enter your new password');
}
