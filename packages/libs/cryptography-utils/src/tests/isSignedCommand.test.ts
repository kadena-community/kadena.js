import { isSignedCommand } from '../isSignedCommand';

import { pactTestCommand1, pactTestCommand2 } from './mockdata/Pact';

test('Takes in a message and keypair, outputs an object with "hash", "sig", and "pubKey" in hex format.', () => {
  expect(true).toEqual(isSignedCommand(pactTestCommand1));
});

test('Takes in a message and keypair, outputs an object with "hash", "sig", and "pubKey" in hex format.', () => {
  expect(false).toEqual(isSignedCommand(pactTestCommand2));
});
