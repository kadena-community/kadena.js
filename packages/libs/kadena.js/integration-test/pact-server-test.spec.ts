// Expects pact server to be running at http://127.0.0.1:9001.
// To run: `$ npm run start:pact`.
// Requires `pact` to be installed: https://github.com/kadena-io/pact

import {
  ChainwebNetworkId,
  Command,
  CommandResult,
  SendRequestBody,
  SendResponse,
  LocalRequestBody,
  LocalResponse,
  PollRequestBody,
  PollResponse,
  ListenRequestBody,
  ListenResponse,
} from '@kadena/types';

import { createSampleExecTx } from './mock-txs';
import { poll } from '../src/fetch/poll';
import { listen } from '../src/fetch/listen';
import { local } from '../src/fetch/local';
import { send } from '../src/fetch/send';
import { createPollRequest } from '../src/api/createPollRequest';
import { createListenRequest } from '../src/api/createListenRequest';

const pactServerNetwork: ChainwebNetworkId = 'development';
const pactServerApiHost: string = 'http://127.0.0.1:9001';
const pactServerKeyPair = {
  publicKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  secretKey: '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
};
const pactCode: string = '(+ 1 2)';
const signedCommand: Command = createSampleExecTx(
  pactServerNetwork,
  pactServerKeyPair,
  pactCode,
);
const sendReq: SendRequestBody = {
  cmds: [signedCommand],
};

test('[Pact Server] Makes a /send request and retrieve request key', async () => {
  const actual: SendResponse = await send(sendReq, pactServerApiHost);
  const expected = {
    requestKeys: [signedCommand.hash],
  };
  expect(actual).toEqual(expected);
});

test('[Pact Server] Makes a /local request and retrieve result', async () => {
  const actual: LocalResponse = await local(signedCommand, pactServerApiHost);
  const { logs, ...actualWithoutLogs } = actual;
  const expected: Omit<CommandResult, 'logs'> = {
    reqKey: signedCommand.hash,
    txId: null,
    result: {
      data: 3,
      status: 'success',
    },
    gas: 0,
    continuation: null,
    metaData: null,
  };
  expect(actualWithoutLogs).toEqual(expected);
});

test('[Pact Server] Makes a /poll request and retrieve result', async () => {
  const actual: PollResponse = await poll(
    createPollRequest(sendReq),
    pactServerApiHost,
  );
  const actualInArray = Object.values(actual);
  const expected: PollResponse = {
    continuation: null,
    gas: 0,
    logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
    metaData: null,
    reqKey: signedCommand.hash,
    result: {
      data: 3,
      status: 'success',
    },
    txId: 0,
  };

  expect(actualInArray).toEqual([expected]);
});

test('[Pact Server] Makes a /listen request and retrieve result', async () => {
  const actual: ListenResponse = await listen(
    createListenRequest(sendReq),
    pactServerApiHost,
  );
  const { logs, metaData, txId, ...actualWithoutLogsAndMetaData } = actual;
  const expected: ListenResponse = {
    continuation: null,
    gas: 0,
    reqKey: signedCommand.hash,
    result: {
      data: 3,
      status: 'success',
    },

  };
  expect(actualWithoutLogsAndMetaData).toEqual(expected);
});
