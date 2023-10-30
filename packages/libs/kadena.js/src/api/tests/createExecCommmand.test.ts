import { createSendRequest } from '@kadena/chainweb-node-client';
import { expect, test } from 'vitest';
import { createExecCommand } from '../createExecCommand';
import {
  command,
  envData,
  keyPairs,
  meta,
  nonce,
  pactCode,
} from './mockdata/execCommand';

test('Takes in exec command parameters and outputs a command formatted for /send endpoint', () => {
  const actual = createExecCommand(keyPairs, nonce, pactCode, envData, meta);
  const expected = createSendRequest([command]);

  expect(expected).toEqual(actual);
});
