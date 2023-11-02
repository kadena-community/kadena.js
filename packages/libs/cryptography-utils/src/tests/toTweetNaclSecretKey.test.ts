import { expect, test } from 'vitest';
import { toTweetNaclSecretKey } from '../toTweetNaclSecretKey';

test('Takes in a keyPair object and returns tweetnacl secretkey format in Uint8Array', () => {
  const keyPair = {
    publicKey:
      'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    secretKey:
      '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
  };

  const actual = toTweetNaclSecretKey(keyPair);
  const expected = new Uint8Array([
    134, 147, 230, 65, 174, 43, 190, 158, 168, 2, 199, 54, 244, 32, 39, 176, 63,
    134, 175, 230, 60, 174, 49, 94, 113, 105, 201, 196, 150, 193, 115, 50, 186,
    84, 178, 36, 209, 146, 77, 217, 132, 3, 245, 199, 81, 171, 221, 16, 222,
    108, 216, 27, 1, 33, 128, 11, 247, 189, 189, 207, 174, 199, 56, 141,
  ]);

  expect(expected).toEqual(actual);
});
