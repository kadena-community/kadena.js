import sign from '../sign';

import pactTestCommand from './mockdata/Pact';

test('Takes in a message and keypair, outputs an object with "hash", "sig", and "pubKey" in hex format.', () => {
  const str = JSON.stringify(pactTestCommand);
  const keyPair = {
    publicKey:
      'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    secretKey:
      '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
  };

  const actual = sign(str, keyPair);
  const expected = {
    hash: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
    sig: '4b0ecfbb0e8f3cb291b57abd27028ceaa221950affa39f10efbf4a5fe740d32670e94c3d3949a7e5f4f6ea692052ca110f7cb2e9a8ee2c5eff4251ed84bbfa03',
    pubKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  };

  expect(expected).toEqual(actual);
});
