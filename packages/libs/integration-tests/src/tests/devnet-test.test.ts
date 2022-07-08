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
  PactEvent,
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
const devnetApiHostChain0: string =
  'http://localhost:8080/chainweb/0.0/development/chain/0/pact';
const devnetApiHostChain1: string =
  'http://localhost:8080/chainweb/0.0/development/chain/1/pact';
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
      // Needed if transaction goes in before fork-point of version `2.14`
      {
        name: 'coin.DEBIT',
        args: [devnetAccount],
      },
    ],
  },
  `(coin.transfer-crosschain "${devnetAccount}" "${devnetAccount}" (read-keyset "test-keyset") "${1}" ${0.05})`,
  { 'test-keyset': { pred: 'keys-all', keys: [devnetKeyPair.publicKey] } },
);
const sendReq2: SendRequestBody = {
  cmds: [signedCommand2],
};

test('[DevNet] Makes a /send simple request and retrieve request key', async () => {
  const actual: SendResponse = await send(sendReq1, devnetApiHostChain0);
  const expected: SendResponse = {
    requestKeys: [signedCommand1.hash],
  };
  expect(actual).toEqual(expected);
});

test('[DevNet] Makes a /send cross-chain request and retrieve request key', async () => {
  //Initiates a cross chain transfer
  const actual: SendResponse = await send(sendReq2, devnetApiHostChain0);
  const expected: SendResponse = {
    requestKeys: [signedCommand2.hash],
  };
  expect(actual).toEqual(expected);
});

test('[DevNet] Makes a /local request and retrieve result', async () => {
  const actual: LocalResponse = await local(
    signedCommand1,
    devnetApiHostChain0,
  );
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

  expect(logs).toBeTruthy();

  // Expect metaData.publicMeta to equal what was supplied in the Command.
  expect(metaData?.publicMeta).toBeDefined();
  expect(metaData?.publicMeta?.chainId).toEqual('0');
  expect(metaData?.publicMeta?.sender).toEqual(devnetAccount);
});

test('[DevNet] Makes a /poll request and retrieve empty result while tx is in mempool', async () => {
  const actual: PollResponse = await poll(
    createPollRequest(sendReq1),
    devnetApiHostChain0,
  );
  const expected: PollResponse = {};
  expect(actual).toEqual(expected);
});

jest.setTimeout(100000);
test('[DevNet] Makes a /listen request and retrieve result, then makes a /poll request and retrieve result', async () => {
  const expectedResult: Omit<CommandResult, 'logs' | 'metaData' | 'txId'> = {
    continuation: null,
    gas: 5,
    reqKey: signedCommand1.hash,
    result: {
      data: 3,
      status: 'success',
    },
  };
  const expectedEvent: Array<PactEvent> = [
    {
      module: {
        name: 'coin',
        namespace: null,
      },
      moduleHash: 'rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4',
      name: 'TRANSFER',
      params: [devnetAccount, devnetAccount, 0.00005],
    },
  ];

  // sleep to give time for blocks to be mined.
  // NOTE: This might be a potential source of tests failing.
  await ((ms) => new Promise((resolve) => setTimeout(resolve, ms)))(40000);

  await listen(createListenRequest(sendReq1), devnetApiHostChain0)
    .then((actual: ListenResponse) => {
      const { logs, metaData, txId, ...resultWithoutDynamicData } = actual;
      expect(logs).toBeTruthy();
      expect(txId).toBeTruthy();
      expect(metaData).toBeTruthy();
      if (resultWithoutDynamicData.events) {
        expect(actual.events).toEqual(expectedEvent);
      }
      expect(resultWithoutDynamicData).toEqual(expectedResult);
    })
    .then(async () => {
      const actual = await poll(
        createPollRequest(sendReq1),
        devnetApiHostChain0,
      );

      const actualInArray = Object.values(actual).map((res) => {
        const { logs, metaData, txId, ...resultWithoutDynamicData } = res;
        expect(logs).toBeTruthy();
        expect(txId).toBeTruthy();
        expect(metaData).toBeTruthy();
        if (resultWithoutDynamicData.events) {
          expect(actual.events).toEqual(expectedEvent);
        }
        return resultWithoutDynamicData;
      });
      expect(actualInArray).toEqual([expectedResult]);
    });
});

jest.setTimeout(300000);
test('[DevNet] Makes a cross chain transfer /send exec command request , then makes /spv request and retrieve proof, then makes a /send cont command request and retrieve result', async () => {
  // sleep to give time for blocks to be mined.
  // NOTE: This might be a potential source of tests failing.
  await ((ms) => new Promise((resolve) => setTimeout(resolve, ms)))(40000);

  await listen(createListenRequest(sendReq2), devnetApiHostChain0)
    .then((actual: ListenResponse) => {
      const { result } = actual;
      const { status } = result;
      expect(status).toEqual('success');
    })
    .then(async () => {
      // Try to fetch /spv but fails because instance is too young.
      const actual = spv(
        { requestKey: signedCommand2.hash, targetChainId: '1' },
        devnetApiHostChain0,
      );
      const expected =
        'SPV target not reachable: target chain not reachable. Chainweb instance is too young';
      return expect(actual).rejects.toThrowError(expected);
    })
    .then(async () => {
      // Try to fetch /spv proof again after waiting some time.
      await ((ms) => new Promise((resolve) => setTimeout(resolve, ms)))(80000);
      const actual = await spv(
        { requestKey: signedCommand2.hash, targetChainId: '1' },
        devnetApiHostChain0,
      );
      return { proof: actual, hash: signedCommand2.hash };
    })
    .then(async ({ proof, hash }) => {
      // Complete cross-chain transfer with a continuation in target chain.
      const contReqPayload: Command = createSampleContTx(
        devnetNetwork,
        devnetKeyPair,
        hash,
        {},
        proof.replace(/\"/g, '').replace(/\\/g, ''),
        '1',
      );
      const contReq: SendRequestBody = { cmds: [contReqPayload] };
      const actual: SendResponse = await send(contReq, devnetApiHostChain1);
      const expected: SendResponse = {
        requestKeys: [contReqPayload.hash],
      };
      expect(actual).toEqual(expected);
      return contReq;
    })
    .then(async (sendContReq: SendRequestBody) => {
      // sleep to give time for blocks to be mined.
      // NOTE: This might be a potential source of tests failing.
      await ((ms) => new Promise((resolve) => setTimeout(resolve, ms)))(40000);
      const actual: CommandResult = await listen(
        createListenRequest(sendContReq),
        devnetApiHostChain1,
      );
      const { result } = actual;
      const { status } = result;
      expect(status).toEqual('success');
    });
});
