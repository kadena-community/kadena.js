import createContCommand from '../createContCommand';
import createSendRequest from '../createSendRequest';
import {
  keyPairs,
  nonce,
  pactId,
  rollback,
  step,
  envData,
  meta,
  networkId,
  proof,
  command,
} from './mockdata/contCommand';

test('Takes in cont command parameters and outputs a command formatted for /send endpoint', () => {
  const actual = createContCommand(
    keyPairs,
    nonce,
    step,
    pactId,
    rollback,
    envData,
    meta,
    proof,
    networkId,
  );
  const expected = createSendRequest([command]);

  expect(expected).toEqual(actual);
});
