import { isEmailValid } from '../isEmailValid';

describe('utils isEmailValid', () => {
  it('should validate a valid email address', () => {
    const validEmails = [
      'he-man@theuniverse.com',
      'snarfer.snarf@thundercats.co.uk',
      'miles.mayhem+venom@venom.com',
    ];

    validEmails.forEach((email) => {
      expect(isEmailValid(email)).toBe(true);
    });
  });

  it('should not validate an invalid email address', () => {
    const invalidEmails = [
      'notanemail',
      'user@',
      'user@example',
      'user@example.',
      'user@example.c',
      'user.example.com',
    ];

    invalidEmails.forEach((email) => {
      expect(isEmailValid(email)).toBe(false);
    });
  });
});
