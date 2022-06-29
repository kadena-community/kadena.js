import { attachSignature } from '../attachSignature';

import { keyPair, signature, stringifiedPayload } from './mockdata/execCommand';

test('Takes in stringified cmd and keyPairs, and outputs signatures with hash', () => {
  const actual = attachSignature(stringifiedPayload, [keyPair]);
  const expected = [signature];

  expect(expected).toEqual(actual);
});
