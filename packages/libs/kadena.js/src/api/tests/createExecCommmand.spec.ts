import { createExecCommand } from '../createExecCommand';
import { createSendRequest } from '../createSendRequest';

import {
  command,
  envData,
  keyPairs,
  meta,
  nonce,
  pactCode,
} from './mockdata/execCommand';

test('Takes in exec command parameters and outputs a command formatted for /send endpoint', () => {
  const actual = createExecCommand(
    keyPairs,
    nonce,
    pactCode,
    envData,
    meta,
    null,
  );
  const expected = createSendRequest([command]);

  expect(expected).toEqual(actual);
});
