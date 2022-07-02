import type { KeyPair } from '@kadena/types';

import { pullSigner } from '../pullSigner';

test('Takes in a keyPair without caps and outputs the public key', () => {
  const keyPair = {
    publicKey:
      'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    secretKey:
      '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
  };

  const actual = pullSigner(keyPair);
  const expected = {
    pubKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  };

  expect(expected).toEqual(actual);
});

test('Takes in a keyPair with caps and outputs the public key', () => {
  const keyPair: KeyPair = {
    publicKey:
      'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    secretKey:
      '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
    clist: [{ name: 'coin.GAS', args: [] }],
  };

  const actual = pullSigner(keyPair);
  const expected = {
    pubKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    clist: [{ name: 'coin.GAS', args: [] }],
  };

  expect(expected).toEqual(actual);
});

test('Takes in a keyPair with no secretKey and caps and outputs the public key', () => {
  const keyPair: KeyPair = {
    publicKey:
      'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    clist: [{ name: 'coin.GAS', args: [] }],
  };

  const actual = pullSigner(keyPair);
  const expected = {
    pubKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    clist: [{ name: 'coin.GAS', args: [] }],
  };

  expect(expected).toEqual(actual);
});

test('Takes in a keyPair with no secretKey without caps and outputs the public key', () => {
  const keyPair: KeyPair = {
    publicKey:
      'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  };

  const actual = pullSigner(keyPair);
  const expected = {
    pubKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  };

  expect(expected).toEqual(actual);
});
