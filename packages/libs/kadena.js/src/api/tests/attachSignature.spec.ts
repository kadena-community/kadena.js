import { attachSignature } from '../attachSignature';

import { keyPair, signature, stringifiedPayload } from './mockdata/execCommand';

test('Takes in stringified cmd and keyPairs, and outputs signatures with hash', () => {
  const actual = attachSignature(stringifiedPayload, [keyPair]);
  const expected = [signature];

  expect(expected).toEqual(actual);
});

test('Takes in stringified cmd and empty keyPairs, and outputs empty signatures with hash', () => {
  const actual = attachSignature(stringifiedPayload, []);
  const expected = [
    {
      hash: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
      sig: undefined,
    },
  ];

  expect(expected).toEqual(actual);
});

test('Takes in stringified cmd and keyPairs without secretKey, and outputs empty signatures with hash', () => {
  const actual = attachSignature(stringifiedPayload, [
    {
      publicKey:
        'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    },
  ]);
  const expected = [
    {
      hash: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
      publicKey:
        'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
      sig: undefined,
    },
  ];

  expect(expected).toEqual(actual);
});
