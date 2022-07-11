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

import {
  poll,
  listen,
  local,
  send,
  spv,
  createPollRequest,
  createListenRequest,
} from 'kadena.js';

import { createSampleExecTx, createSampleContTx } from './mock-txs';
import { backOff } from 'exponential-backoff';

const devnetNetwork: ChainwebNetworkId = 'development';
const devnetApiHostChain0: string =
  'http://localhost:8080/chainweb/0.0/development/chain/0/pact';
const devnetApiHostChain1: string =
  'http://localhost:8080/chainweb/0.0/development/chain/1/pact';
const devnetKeyPair = {
  publicKey: 'f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
  secretKey: 'da81490c7efd5a95398a3846fa57fd17339bdf1b941d102f2d3217ad29785ff0',
};
const devnetAccount = `k:${devnetKeyPair.publicKey}`;

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

function sleep20Seconds(): Promise<unknown> {
  return ((ms) => new Promise((resolve) => setTimeout(resolve, ms)))(20000);
}

describe('[DevNet] Makes /send request of simple transaction', () => {
  it('Receives request key of transaction', async () => {
    const actual: SendResponse = await send(sendReq1, devnetApiHostChain0);
    const expected: SendResponse = {
      requestKeys: [signedCommand1.hash],
    };
    expect(actual).toEqual(expected);
  });
});

describe('[DevNet] Makes /send request to initiate a cross-chain transaction', () => {
  test('Receives request key of transaction', async () => {
    const actual: SendResponse = await send(sendReq2, devnetApiHostChain0);
    const expected: SendResponse = {
      requestKeys: [signedCommand2.hash],
    };
    expect(actual).toEqual(expected);
  });
});

describe('[DevNet] Makes /local request of simple transaction', () => {
  it('Receives the expected transaction result', async () => {
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
    expect(metaData?.publicMeta).toBeDefined();
    expect(metaData?.publicMeta?.chainId).toEqual('0');
    expect(metaData?.publicMeta?.sender).toEqual(devnetAccount);
  });
});

describe('[DevNet] Makes /poll request of simple transaction', () => {
  it('Receives empty result while tx is still in mempool', async () => {
    const actual: PollResponse = await poll(
      createPollRequest(sendReq1),
      devnetApiHostChain0,
    );
    const expected: PollResponse = {};
    expect(actual).toEqual(expected);
  });
});

// NOTE: Sets test timeout to 100 seconds (~2 min) since devnet blockrate is slower than
// pact-server.
jest.setTimeout(100000);
describe('[DevNet] Attempts to retrieve result of a simple transaction', () => {
  const expectedResult: Omit<CommandResult, 'logs' | 'metaData' | 'txId'> = {
    continuation: null,
    gas: 5,
    reqKey: signedCommand1.hash,
    result: {
      data: 3,
      status: 'success',
    },
  };
  const expectedEvent: Array<Omit<PactEvent, 'moduleHash'>> = [
    {
      module: {
        name: 'coin',
        namespace: null,
      },
      name: 'TRANSFER',
      params: [devnetAccount, devnetAccount, 0.00005],
    },
  ];

  it('Makes /listen request and retrieves expected result', async () => {
    await backOff(() =>
      listen(createListenRequest(sendReq1), devnetApiHostChain0).then(
        (actual: ListenResponse) => {
          const { logs, metaData, txId, events, ...resultWithoutDynamicData } =
            actual;
          expect(logs).toBeTruthy();
          expect(txId).toBeTruthy();
          expect(metaData).toBeTruthy();
          if (events !== undefined && events && events[0]) {
            const { moduleHash, ...eventWithNoModHash } = events[0];
            expect([eventWithNoModHash]).toEqual(expectedEvent);
            expect(moduleHash).toBeTruthy();
          }
          expect(resultWithoutDynamicData).toEqual(expectedResult);
        },
      ),
    );
  });

  it('Makes /poll request and retrieves expected result after /listen succeeds', async () => {
    const actual = await poll(createPollRequest(sendReq1), devnetApiHostChain0);
    const actualInArray = Object.values(actual).map((res) => {
      const { logs, metaData, txId, events, ...resultWithoutDynamicData } = res;
      expect(logs).toBeTruthy();
      expect(txId).toBeTruthy();
      expect(metaData).toBeTruthy();
      if (events !== undefined && events && events[0]) {
        const { moduleHash, ...eventWithNoModHash } = events[0];
        expect([eventWithNoModHash]).toEqual(expectedEvent);
        expect(moduleHash).toBeTruthy();
      }
      return resultWithoutDynamicData;
    });
    expect(actualInArray).toEqual([expectedResult]);
  });
});

// NOTE: Sets test timeout to 300 seconds (5 min) since devnet blockrate is slower than
// pact-server.
jest.setTimeout(300000);
describe('[DevNet] Finishes a cross-chain transfer', () => {
  it('Retrieves expected result of transaction that initiated the cross-chain', async () => {
    const actual: ListenResponse = await backOff(() =>
      listen(createListenRequest(sendReq2), devnetApiHostChain0),
    );
    const { result } = actual;
    const { status } = result;
    expect(status).toEqual('success');
  });

  it('/spv fails because instance is too young', async () => {
    const actual = spv(
      { requestKey: signedCommand2.hash, targetChainId: '1' },
      devnetApiHostChain0,
    );
    const expected =
      'SPV target not reachable: target chain not reachable. Chainweb instance is too young';
    return expect(actual).rejects.toThrowError(expected);
  });

  it('Retrieves /spv proof after waiting some time and completes the cross-chain transfer', async () => {
    // NOTE: sleep to prevent too young error.
    await sleep20Seconds();
    await sleep20Seconds();
    await sleep20Seconds();
    await sleep20Seconds();

    // Retrieve spv proof
    const actualSPVProof = await backOff(() =>
      spv(
        { requestKey: signedCommand2.hash, targetChainId: '1' },
        devnetApiHostChain0,
      ),
    );
    const proof = actualSPVProof;
    const hash = signedCommand2.hash;

    // Submit /send request finishing cross-chain transfer in target chain
    const contReqPayload: Command = createSampleContTx(
      devnetNetwork,
      devnetKeyPair,
      hash,
      {},
      proof.replace(/\"/g, '').replace(/\\/g, ''), // NOTE: Prevents a Pact parsing error.
      '1',
    );
    const contReq: SendRequestBody = { cmds: [contReqPayload] };
    const actualContSendResp: SendResponse = await send(
      contReq,
      devnetApiHostChain1,
    );
    const expectedContSendResp: SendResponse = {
      requestKeys: [contReqPayload.hash],
    };
    expect(actualContSendResp).toEqual(expectedContSendResp);

    // Retrieve result of finishing cross-chain transfer
    const actualContResult: CommandResult = await backOff(() =>
      listen(createListenRequest(contReq), devnetApiHostChain1),
    );
    const { result } = actualContResult;
    const { status } = result;
    expect(status).toEqual('success');
  });
});
