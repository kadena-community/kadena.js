import { hash } from '../hash';

import { pactTestCommand } from './mockdata/Pact';

test('should perform blake2b256 hashing on a string and output hash encoded as unescaped base64url', () => {
  const str = JSON.stringify(pactTestCommand);

  const actual = hash(str);
  const expected = 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik';

  expect(expected).toEqual(actual);
});
