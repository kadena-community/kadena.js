import mkSigner from '../mkSigner';
import { kp } from './mockdata/execCmd';

test('Takes in a keyPair and outputs the public key', () => {
  const actual = mkSigner(kp);
  const expected = {
    pubKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  };

  expect(expected).toEqual(actual);
});
