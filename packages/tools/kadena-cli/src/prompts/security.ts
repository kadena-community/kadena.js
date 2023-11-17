import { password } from '@inquirer/prompts';

export async function securityPassword(): Promise<string> {
  return await password({
    message: 'Enter a password',
    validate: function (value) {
      if (value.length < 8) {
        return 'Password should be at least 6 characters long.';
      }
      return true;
    },
  });
}
