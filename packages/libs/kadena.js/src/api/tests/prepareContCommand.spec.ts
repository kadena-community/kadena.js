import {
  keyPairs,
  nonce,
  pactId,
  rollback,
  step,
  proof,
  envData,
  meta,
  networkId,
  command,
} from './mockdata/contCommand';
import prepareContCommand from '../prepareContCommand';

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
