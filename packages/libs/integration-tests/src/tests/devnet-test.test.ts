// These tests expect devnet to be running at http://localhost:8080.
// To run devnet, follow instructions at https://github.com/kadena-io/devnet.

import {
  ChainwebNetworkId,
  Command,
  CommandResult,
  SendRequestBody,
  SendResponse,
  LocalResponse,
  PollResponse,
  ListenResponse,
} from '@kadena/types';
import { poll } from 'kadena.js/lib/fetch/poll';
import { listen } from 'kadena.js/lib/fetch/listen';
import { local } from 'kadena.js/lib/fetch/local';
import { send } from 'kadena.js/lib/fetch/send';
import { spv } from 'kadena.js/lib/fetch/spv';
import { createPollRequest } from 'kadena.js/lib/api/createPollRequest';
import { createListenRequest } from 'kadena.js/lib/api/createListenRequest';
import { createSampleExecTx, createSampleContTx } from './mock-txs';

const devnetNetwork: ChainwebNetworkId = 'development';
const devnetApiHost: string =
  'http://localhost:8080/chainweb/0.0/development/chain/0/pact';
const devnetKeyPair = {
  publicKey: 'f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
  secretKey: 'da81490c7efd5a95398a3846fa57fd17339bdf1b941d102f2d3217ad29785ff0',
};
const devnetAccount = 'k:'.concat(devnetKeyPair.publicKey);

const signedCommand1: Command = createSampleExecTx(
  devnetNetwork,
  devnetKeyPair,
  `(+ 1 2)`,
);
const sendReq1: SendRequestBody = {
  cmds: [signedCommand1],
};

const signedCommand2: Command = createSampleExecTx(
  devnetNetwork,
  {
    ...devnetKeyPair,
    clist: [
      {
        name: 'coin.GAS',
        args: [],
      },
      {
        name: 'coin.TRANSFER_XCHAIN',
        args: [devnetAccount, devnetAccount, 0.05, `${1}`],
      },
    ],
  },
  `(coin.transfer-crosschain "${devnetAccount}" "${devnetAccount}" (read-keyset "test-keyset") "${1}" ${0.05})`,
  { 'test-keyset': { pred: 'keys-all', keys: [devnetKeyPair.publicKey] } },
);
const sendReq2: SendRequestBody = {
  cmds: [signedCommand2],
};

test('[DevNet] Makes a /send request and retrieve request key', async () => {
  const actual: SendResponse = await send(sendReq1, devnetApiHost);
  const expected: SendResponse = {
    requestKeys: [signedCommand1.hash],
  };
  expect(actual).toEqual(expected);
});

test('[DevNet] Makes a /local request and retrieve result', async () => {
  const actual: LocalResponse = await local(signedCommand1, devnetApiHost);
  const { logs, metaData, ...actualWithoutLogsAndMetaData } = actual;
  const expected: Omit<LocalResponse, 'logs' | 'metaData'> = {
    reqKey: signedCommand1.hash,
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
    createPollRequest(sendReq1),
    devnetApiHost,
  );
  const expected: PollResponse = {};
  expect(actual).toEqual(expected);
});

jest.setTimeout(100000);
test('[DevNet] Makes a /listen request and retrieve result, then makes a /poll request and retrieve result', async () => {
  await listen(createListenRequest(sendReq1), devnetApiHost)
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
            params: [devnetAccount, devnetAccount, 0.00005],
          },
        ],
        gas: 5,
        reqKey: signedCommand1.hash,
        result: {
          data: 3,
          status: 'success',
        },
      };
      expect(actualWithoutLogsAndMetaData).toEqual(expected);
    })
    .then(async () => {
      const actual = await poll(createPollRequest(sendReq1), devnetApiHost);

      const actualInArray = Object.values(actual).map((res) => {
        const { logs, metaData, txId, ...resultWithoutDynamicData } = res;
        return resultWithoutDynamicData;
      });

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
            params: [devnetAccount, devnetAccount, 0.00005],
          },
        ],
        gas: 5,
        reqKey: signedCommand1.hash,
        result: {
          data: 3,
          status: 'success',
        },
      };

      expect(actualInArray).toEqual([expected]);
    });
});

test('[DevNet] Makes a cross chain transfer /send exec command request , then makes /spv request and retrieve proof, then makes a /send cont command request and retrieve result', async () => {
  //Initiates a cross chain transfer
  return send(sendReq2, devnetApiHost)
    .then((actual: SendResponse) => {
      const expected: SendResponse = {
        requestKeys: [signedCommand2.hash],
      };
      expect(actual).toEqual(expected);
    })
    .then(async () => {
      // wait for the tx to complete
      const actual = await listen(createListenRequest(sendReq1), devnetApiHost);
      const { result } = actual;
      const { status } = result;
      expect(status).toEqual('success');
    })
    .then(async () => {
      //Try to fetch /spv but fails because instance is too young
      const actual = await spv(
        { requestKey: signedCommand2.hash, targetChainId: '' },
        devnetApiHost,
      );
      const expected = '';
      expect(actual).toEqual(expected);
      //sleep
      return ((ms) => new Promise((resolve) => setTimeout(resolve, ms)))(20000);
    })
    .then(async () => {
      const actual = await spv(
        { requestKey: signedCommand2.hash, targetChainId: '' },
        devnetApiHost,
      );
      const expected = '';
      console.log(actual, expected);
      expect(actual).toEqual(expected);
      return { proof: actual, hash: signedCommand2.hash };
    })
    .then(async ({ proof, hash }) => {
      const actual = await createSampleContTx(
        devnetNetwork,
        devnetKeyPair,
        hash,
        {},
        proof,
      );
    });
});
