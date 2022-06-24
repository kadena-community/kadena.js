import {
  keyPairs,
  nonce,
  pactCode,
  envData,
  meta,
  command,
} from './mockdata/execCommand';
import prepareExecCommand from '../prepareExecCommand';

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
