import { sign } from '../sign';

import { pactTestCommand } from './mockdata/Pact';

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
    hash: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
    sig: '26d765e3b812d59d80ffbd034d4fc4a1a24f8d0c3929586575617089e5098d967955d348608b515ae9ff7871b46726ffc71252d53b9e562d5bcf3bfe66292906',
    pubKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  };

  expect(expected).toEqual(actual);
});
