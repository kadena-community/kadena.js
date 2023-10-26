import { expect, test } from 'vitest';
import { restoreKeyPairFromSecretKey } from '../restoreKeyPairFromSecretKey';

test('restores keypair from secretkey', () => {
  const secretKey =
    '53d1e1639bd6c607d33f3efcbaafc6d0d4fb022cd57a3a9b8534ddcd8c471902';

  const actual = restoreKeyPairFromSecretKey(secretKey);
  const expected = {
    publicKey:
      '85bef77ea3570387cac57da34938f246c7460dc533a67823f065823e327b2afd',
    secretKey:
      '53d1e1639bd6c607d33f3efcbaafc6d0d4fb022cd57a3a9b8534ddcd8c471902',
  };

  expect(expected).toEqual(actual);
});

test('Takes in a bad sized secret key and throw error', () => {
  const secretKey =
    '53d1e1639bd6c607d33f3efcbaafc6d0d4fb022cd57a3a9b8534ddcd8c471902@';
  expect(() => restoreKeyPairFromSecretKey(secretKey)).toThrow();
});
