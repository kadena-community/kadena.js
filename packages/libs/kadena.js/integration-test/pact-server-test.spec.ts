// Expects pact server to be running at http://127.0.0.1:9001.
// To run: `$ npm run start:pact`.
// Requires `pact` to be installed: https://github.com/kadena-io/pact

import { ChainwebNetworkId, Command, CommandResult } from '../src/util/PactCommand';
import { local } from '../src/fetch/local';
import { send, SendRequestBody } from '../src/fetch/send';
import { createSampleExecTx } from './mock-txs';

const pactServerNetwork:ChainwebNetworkId = 'development';
const pactServerApiHost:string = 'http://127.0.0.1:9001';
const pactServerKeyPair = {
  publicKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  secretKey: '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
};

test('[Pact Server] Makes a /send request and retrieve request key', async () => {
  const pactCode:string = "(+ 1 2)";
  const signedCommand:Command = createSampleExecTx(pactServerNetwork, pactServerKeyPair, pactCode);
  const sendReq:SendRequestBody = {
    cmds: [signedCommand],
  };

  var actual = await send(sendReq, pactServerApiHost);
  var expected = {
    requestKeys: [signedCommand.hash],
  };
  expect(actual).toEqual(expected);
});

test('[Pact Server] Makes a /local request and retrieve result', async () => {
  const pactCode:string = "(+ 1 2)";
  const signedCommand:Command = createSampleExecTx(pactServerNetwork, pactServerKeyPair, pactCode);
  var actual:CommandResult = await local(signedCommand, pactServerApiHost);
  var { logs, ...actualWithoutLogs } = actual;
  var expected:Omit<CommandResult, "logs"> = {
    reqKey: signedCommand.hash,
    txId: null,
    result: {
      data: 3,
      status: "success",
    },
    gas: 0,
    continuation: null,
    metaData: null,
  };
  expect(actualWithoutLogs).toEqual(expected);
});