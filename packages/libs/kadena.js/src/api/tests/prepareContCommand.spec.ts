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

test('Takes in Pact Command parameters and outputs a signed Pact Cont Command Object', () => {
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
