import { prepareExecCommand } from '../prepareExecCommand';

import {
  command,
  envData,
  keyPairs,
  meta,
  nonce,
  pactCode,
} from './mockdata/execCommand';

test('Takes in Pact Command parameters and outputs a signed Pact Exec Command Object', () => {
  const actual = prepareExecCommand(
    keyPairs,
    nonce,
    pactCode,
    envData,
    meta,
    null,
  );
  const expected = command;

  expect(expected).toEqual(actual);
});
