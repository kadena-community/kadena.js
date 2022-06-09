import { send, SendRequestBody, SendResponse } from '../send';
import { mockFetch } from './mockFetch';
import pactTestCommand from '../../crypto/tests/mockdata/Pact';
import sign from '../../crypto/sign';
import { SignCommand } from '../../util/SignCommand';
import { Command } from '../../util/PactCommand';


const unmockedFetch = global.fetch;
/**
 * NOTE (Linda, 06/09/2022):
 * Typing `mockFetch` as jest.Mock was needed to satisfy
 * the type constraint of jest and the original `fetch` function.
 *
 * See `mockFetch.ts` for more details.
 */
beforeAll(() => { global.fetch = (mockFetch as jest.Mock); });
afterAll(() => {
  global.fetch = unmockedFetch;
});

test('/send should return request keys of txs submitted', async () => {
  const commandStr = JSON.stringify(pactTestCommand);
  const keyPair = {
    publicKey:
      'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    secretKey:
      '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
  };
  const cmdWithOneSignature:SignCommand = sign(commandStr, keyPair);
  const signedCommand:Command = {
    cmd: commandStr,
    hash: cmdWithOneSignature.hash,
    sigs: [cmdWithOneSignature.sig],
  };
  const sendReq:SendRequestBody = {
    cmds: [signedCommand],
  };
  const responseActual:SendResponse = await send(sendReq, '');
  const responseExpected:SendResponse = {
    requestKeys: [signedCommand.hash],
  };
  expect(responseExpected).toEqual(responseActual);
});
