import { mkSigner } from '../mkSigner';
import { kp } from './mockdata/execCmd';

test('Takes in singleCmd object and outputs mkPublicSend formatted specifically for a send request', () => {
  var actual = mkSigner(kp);
  var expected = {
    pubKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  };

  expect(expected).toEqual(actual);
});
