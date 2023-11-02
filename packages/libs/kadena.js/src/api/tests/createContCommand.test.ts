import { createSendRequest } from '@kadena/chainweb-node-client';
import { expect, test } from 'vitest';
import { createContCommand } from '../createContCommand';
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

  expect(actual).toEqual(expected);
});
