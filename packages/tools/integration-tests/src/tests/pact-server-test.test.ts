// Expects pact server to be running at http://127.0.0.1:9001.
// To run: `$ npm run start:pact`.
// Requires `pact` to be installed: https://github.com/kadena-io/pact

import {
  createListenRequest,
  createPollRequest,
  createSendRequest,
  ICommandResult,
  IPollResponse,
  ISendRequestBody,
  listen,
  ListenResponse,
  local,
  poll,
  send,
  SendResponse,
} from '@kadena/chainweb-node-client';
import { ensureSignedCommand } from '@kadena/pactjs';
import { ICommand, IUnsignedCommand } from '@kadena/types';

import { createSampleExecTx } from './mock-txs';

const pactServerApiHost: string = 'http://127.0.0.1:9001';
const pactServerKeyPair = {
  publicKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  secretKey: '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
};
const pactCode: string = '(+ 1 2)';
const sampleCommand: IUnsignedCommand = createSampleExecTx(
  pactServerKeyPair,
  pactCode,
);
const signedSampleCommand: ICommand = ensureSignedCommand(sampleCommand);
const sendReq: ISendRequestBody = createSendRequest(signedSampleCommand);

describe('[Pact Server] Makes /send request', () => {
  it('Receives request key of transaction', async () => {
    const actual: SendResponse | Response = await send(
      sendReq,
      pactServerApiHost,
    );
    const expected = {
      requestKeys: [signedSampleCommand.hash],
    };
    expect(actual).toEqual(expected);
  });
});

describe('[Pact Server] Makes /local request', () => {
  it('Receives the expected transaction result', async () => {
    const actual: ICommandResult | Response = await local(
      signedSampleCommand,
      pactServerApiHost,
    );
    const expected: ICommandResult = {
      reqKey: signedSampleCommand.hash,
      txId: null,
      logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
      result: {
        data: 3,
        status: 'success',
      },
      gas: 0,
      continuation: null,
      metaData: null,
    };
    expect(actual).toEqual(expected);
  });
});

describe('[Pact Server] Makes /poll request', () => {
  it('Receives the expected transaction result', async () => {
    const actual: IPollResponse | Response = await poll(
      createPollRequest(sendReq),
      pactServerApiHost,
    );
    const actualInArray = Object.values(actual);
    const expected: ICommandResult = {
      continuation: null,
      gas: 0,
      logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
      metaData: null,
      reqKey: signedSampleCommand.hash,
      result: {
        data: 3,
        status: 'success',
      },
      txId: 0,
    };
    expect(actualInArray).toEqual([expected]);
  });
});

describe('[Pact Server] Makes /listen request', () => {
  it('Receives the expected transaction result', async () => {
    const actual: Response | ICommandResult = await listen(
      createListenRequest(sendReq),
      pactServerApiHost,
    );
    const expected: ListenResponse = {
      continuation: null,
      gas: 0,
      logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
      metaData: null,
      reqKey: signedSampleCommand.hash,
      result: {
        data: 3,
        status: 'success',
      },
      txId: 0,
    };
    expect(actual).toEqual(expected);
  });
});
