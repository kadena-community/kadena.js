import { signHash } from '../signHash';

test('Takes in a hash and keypair, outputs an object with with "hash", "sig", and "pubKey" in hex format', () => {
  const str = 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik';
  const keyPair = {
    publicKey:
      'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    secretKey:
      '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
  };

  const sigWithHash = signHash(str, keyPair);
  const expectedSigWithHash = {
    hash: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
    sig: 'b2136d0281e457f7aea130be3185f8c573872dbac9360da26cf5e30999bf3206a3358dd551e8b8aaf3d66d21611c9376fb3ef45fed95d892cc7dfa6023c99d0e',
    pubKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  };

  expect(sigWithHash).toEqual(expectedSigWithHash);
});
