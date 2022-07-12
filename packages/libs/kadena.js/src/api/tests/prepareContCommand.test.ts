import { prepareContCommand } from '../prepareContCommand';

import {
  command,
  envData,
  keyPairs,
  meta,
  networkId,
  nonce,
  pactId,
  proof,
  rollback,
  step,
} from './mockdata/contCommand';

test('Takes in Pact ICommandparameters and outputs a signed Pact ContICommandObject', () => {
  const actual = prepareContCommand(
    keyPairs,
    nonce,
    proof,
    pactId,
    rollback,
    step,
    envData,
    meta,
    networkId,
  );

  const expected = command;
  expect(expected).toEqual(actual);
});
