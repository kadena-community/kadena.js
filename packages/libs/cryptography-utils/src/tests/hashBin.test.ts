import { expect, test } from 'vitest';
import { hashBin } from '../hashBin';

const pactTestCommand: {
  networkId: undefined | unknown;
  payload: {
    exec: { data: { 'accounts-admin-keyset': string[] }; code: string };
  };
  signers: { pubKey: string }[];
  meta: {
    creationTime: number;
    ttl: number;
    gasLimit: number;
    chainId: string;
    gasPrice: number;
    sender: string;
  };
  nonce: string;
} = {
  networkId: null,
  payload: {
    exec: {
      data: {
        'accounts-admin-keyset': [
          'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
        ],
      },
      code: '(define-keyset \'k (read-keyset "accounts-admin-keyset"))\n(module system \'k\n  (defun get-system-time ()\n    (time "2017-10-31T12:00:00Z")))\n(get-system-time)',
    },
  },
  signers: [
    {
      pubKey:
        'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    },
  ],
  meta: {
    creationTime: 0,
    ttl: 0,
    gasLimit: 0,
    chainId: '',
    gasPrice: 0,
    sender: '',
  },
  nonce: JSON.stringify('step01'),
};

test('should perform blake2b256 hashing on a string and output hash as an Uint8Array binary object', () => {
  const str = JSON.stringify(pactTestCommand);

  const actual = hashBin(str);
  const expected = new Uint8Array([
    186, 137, 108, 137, 216, 120, 13, 99, 126, 15, 142, 5, 160, 73, 103, 162,
    194, 252, 123, 159, 156, 24, 33, 167, 255, 73, 118, 53, 203, 121, 154, 175,
  ]);

  expect(expected).toEqual(actual);
});
