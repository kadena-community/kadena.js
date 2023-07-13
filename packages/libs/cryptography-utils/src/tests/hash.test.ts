import { hash } from '../hash';

import { pactTestCommand } from './mockdata/Pact';

test('should perform blake2b256 hashing on a string and output hash encoded as unescaped base64url', () => {
  const str = JSON.stringify(pactTestCommand);

  const actualHash = hash(str);

  expect(actualHash).toEqual('uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8');
});
