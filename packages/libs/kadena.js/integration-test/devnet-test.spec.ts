// These tests expect devnet to be running at http://localhost:8080.
// To run devnet, follow instructions at https://github.com/kadena-io/devnet.

import { ChainwebNetworkId, Command, CommandResult } from '../src/util/PactCommand';
import { local } from '../src/fetch/local';
import { send, SendRequestBody } from '../src/fetch/send';
import { createSampleExecTx } from './mock-txs';

const devnetNetwork:ChainwebNetworkId = 'development';
const devnetApiHost:string = 'http://localhost:8080/chainweb/0.0/development/chain/0/pact';
const devnetKeyPair = {
  publicKey: 'f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
  secretKey: 'da81490c7efd5a95398a3846fa57fd17339bdf1b941d102f2d3217ad29785ff0',
};

test('[DevNet] Makes a /send request and retrieve request key', async () => {
  const pactCode:string = '(+ 1 2)';
  const signedCommand:Command = createSampleExecTx(devnetNetwork, devnetKeyPair, pactCode);
  const sendReq:SendRequestBody = {
    cmds: [signedCommand],
  };
  var actualSendResp = await send(sendReq, devnetApiHost);
  var expectedSendResp = {
    requestKeys: [signedCommand.hash],
  };
  expect(actualSendResp).toEqual(expectedSendResp);
});

test('[DevNet] Makes a /local request and retrieve result', async () => {
  const pactCode:string = '(+ 1 2)';
  const signedCommand:Command = createSampleExecTx(devnetNetwork, devnetKeyPair, pactCode);
  var actual:CommandResult = await local(signedCommand, devnetApiHost);
  var { logs, metaData, ...actualWithoutLogsAndMetaData } = actual;
  var expected:Omit<CommandResult, 'logs' | 'metaData'> = {
    reqKey: signedCommand.hash,
    txId: null,
    result: {
      data: 3,
      status: 'success',
    },
    gas: 5,
    continuation: null,
  };
  expect(actualWithoutLogsAndMetaData).toEqual(expected);
});
