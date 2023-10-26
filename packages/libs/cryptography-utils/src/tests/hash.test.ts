import { expect, test } from 'vitest';
import { hash } from '../hash';

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

test('should perform blake2b256 hashing on a string and output hash encoded as unescaped base64url', () => {
  const str = JSON.stringify(pactTestCommand);

  const actualHash = hash(str);

  expect(actualHash).toEqual('uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8');
});
