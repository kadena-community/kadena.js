import { expect, test } from 'vitest';
import { createSendRequest } from '../createSendRequest';
import { command } from './mockdata/execCommand';

test('Takes in Pact command object and outputs command formatted specifically for a send request', () => {
  const actual = createSendRequest(command);
  const expected = {
    cmds: [command],
  };

  expect(expected).toEqual(actual);
});
