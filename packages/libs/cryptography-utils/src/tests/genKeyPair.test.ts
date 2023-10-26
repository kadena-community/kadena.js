import { expect, test, vi } from 'vitest';
import { genKeyPair } from '../genKeyPair';
vi.mock('tweetnacl', () => {
  return {
    default: {
      sign: {
        keyPair: () => {
          return {
            publicKey: '1234567abcdefg',
            secretKey: '1234567abcdefg',
          };
        },
      },
    },
  };
});

test('generates a new keyPair', () => {
  const actual = genKeyPair();

  expect(actual.publicKey).toEqual('3132333435363761626364656667');
  expect(actual.secretKey).toEqual('3132333435363761626364656667');
});
