// These tests expect devnet to be running at http://localhost:8080.
// To run devnet, follow instructions at https://github.com/kadena-io/devnet.

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
  Base64Url,
} from '@kadena/types';
import { local } from '../src/fetch/local';
import { poll } from '../src/fetch/poll';
import { listen } from '../src/fetch/listen';
import { send } from '../src/fetch/send';
import { createPollRequest } from '../src/api/createPollRequest';
import { createListenRequest } from '../src/api/createListenRequest';
import { createSampleExecTx } from './mock-txs';

const devnetNetwork: ChainwebNetworkId = 'development';
const devnetApiHost: string =
  'http://localhost:8080/chainweb/0.0/development/chain/0/pact';
const devnetKeyPair = {
  publicKey: 'f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
  secretKey: 'da81490c7efd5a95398a3846fa57fd17339bdf1b941d102f2d3217ad29785ff0',
};

const pactCode: string = '(+ 1 2)';
const signedCommand: Command = createSampleExecTx(
  devnetNetwork,
  devnetKeyPair,
  pactCode,
);
const sendReq: SendRequestBody = {
  cmds: [signedCommand],
};

test('[DevNet] Makes a /send request and retrieve request key', async () => {
  const actual: SendResponse = await send(sendReq, devnetApiHost);
  const expected: SendResponse = {
    requestKeys: [signedCommand.hash],
  };
  expect(actual).toEqual(expected);
});

test('[DevNet] Makes a /local request and retrieve result', async () => {
  const actual: LocalResponse = await local(signedCommand, devnetApiHost);
  const { logs, metaData, ...actualWithoutLogsAndMetaData } = actual;
  const expected: Omit<LocalResponse, 'logs' | 'metaData'> = {
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

test('[DevNet] Makes a /poll request and retrieve empty result while tx is in mempool', async () => {
  const actual: PollResponse = await poll(
    createPollRequest(sendReq),
    devnetApiHost,
  );
  const expected: PollResponse = {};
  expect(actual).toEqual(expected);
});

jest.setTimeout(100000);
test('[DevNet] Makes a /listen request and retrieve result, then makes a /poll request and retrieve result', async () => {
  await listen(createListenRequest(sendReq), devnetApiHost)
    .then((actual: ListenResponse) => {
      const { logs, metaData, txId, ...actualWithoutLogsAndMetaData } = actual;
      const expected: Omit<ListenResponse, 'logs' | 'metaData' | 'txId'> = {
        continuation: null,
        events: [
          {
            module: {
              name: 'coin',
              namespace: null,
            },
            moduleHash: 'rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4',
            name: 'TRANSFER',
            params: [
              'k:f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
              'k:f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
              0.00005,
            ],
          },
        ],
        gas: 5,
        reqKey: signedCommand.hash,
        result: {
          data: 3,
          status: 'success',
        },
      };
      expect(actualWithoutLogsAndMetaData).toEqual(expected);
    })
    .then(async () => {
      const actual = await poll(createPollRequest(sendReq), devnetApiHost);

      const actualInArray = Object.values(actual);

      const expected: Omit<CommandResult, 'logs' | 'metaData' | 'txId'> = {
        continuation: null,
        events: [
          {
            module: {
              name: 'coin',
              namespace: null,
            },
            moduleHash: 'rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4',
            name: 'TRANSFER',
            params: [
              'k:'.concat(devnetKeyPair.publicKey),
              'k:'.concat(devnetKeyPair.publicKey),
              0.00005,
            ],
          },
        ],
        gas: 5,
        reqKey: signedCommand.hash,
        result: {
          data: 3,
          status: 'success',
        },
      };

      expect(actualInArray).toEqual([expected]);
    });
});
