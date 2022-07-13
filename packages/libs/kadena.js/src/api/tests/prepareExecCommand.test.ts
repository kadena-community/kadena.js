import { prepareExecCommand } from '../prepareExecCommand';

import {
  command,
  envData,
  keyPairs,
  meta,
  nonce,
  pactCode,
} from './mockdata/execCommand';

test('Takes in Pact ICommandparameters and outputs a signed PactIExecCommand Object', () => {
  const actual = prepareExecCommand(
    keyPairs,
    nonce,
    pactCode,
    meta,
    undefined,
    envData,
  );
  const expected = command;

  expect(expected).toEqual(actual);
});
