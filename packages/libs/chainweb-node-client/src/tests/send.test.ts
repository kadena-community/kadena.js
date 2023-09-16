jest.mock('cross-fetch');

import { pactTestCommand, sign } from '@kadena/cryptography-utils';
import { ensureSignedCommand } from '@kadena/pactjs';
import type { ICommand, IUnsignedCommand, SignCommand } from '@kadena/types';

import { createSendRequest } from '../createSendRequest';
import type { ISendRequestBody, SendResponse } from '../interfaces/PactAPI';
import { send } from '../send';

import { mockFetch } from './mockdata/mockFetch';
import { testURL } from './mockdata/Pact';

import type { Response } from 'cross-fetch';
import fetch from 'cross-fetch';

const mockedFunctionFetch = fetch as jest.MockedFunction<typeof fetch>;
mockedFunctionFetch.mockImplementation(
  mockFetch as jest.MockedFunction<typeof fetch>,
);

test('/send should return request keys of txs submitted', async () => {
  const commandStr = JSON.stringify(pactTestCommand);
  const keyPair = {
    publicKey:
      'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    secretKey:
      '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
  };
  const cmdWithOneSignature1: SignCommand = sign(commandStr, keyPair);
  const sampleCommand1: IUnsignedCommand = {
    cmd: commandStr,
    hash: cmdWithOneSignature1.hash,
    sigs: [
      typeof cmdWithOneSignature1.sig === 'string'
        ? { sig: cmdWithOneSignature1.sig }
        : undefined,
    ],
  };
  const signedCommand1: ICommand = ensureSignedCommand(sampleCommand1);
  const expectedRequestKey1 = signedCommand1.hash;

  // A tx created for chain 0 of devnet using `pact -a`.
  const signedCommand2: ICommand = {
    hash: 'ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q',
    sigs: [
      {
        sig: '0df98906e0c7a6e380f72dac6211b37c321f6555f3eb20ee2736f37784a3edda54da3a15398079b44f474b1fc7f522ffa3ae004a67a0a0266ecc8c82b9a0220b',
      },
    ],
    cmd: '{"networkId":"development","payload":{"exec":{"data":null,"code":"(+ 1 2)"}},"signers":[{"pubKey":"f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f"}],"meta":{"creationTime":1655142318,"ttl":28800,"gasLimit":10000,"chainId":"0","gasPrice":1.0e-5,"sender":"k:f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f"},"nonce":"2022-06-13 17:45:18.211131 UTC"}',
  };
  const expectedRequestKey2 = 'ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q';
  const sendReq: ISendRequestBody = createSendRequest([
    signedCommand1,
    signedCommand2,
  ]);

  const responseExpected: SendResponse = {
    requestKeys: [expectedRequestKey1, expectedRequestKey2],
  };
  const responseActual: Response | SendResponse = await send(sendReq, testURL);
  expect(responseExpected).toEqual(responseActual);
});

test('/send should return error if sent to wrong chain id', async () => {
  // A tx created for chain 0 of devnet using `pact -a`.
  const signedCommand: ICommand = {
    hash: 'ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q',
    sigs: [
      {
        sig: '0df98906e0c7a6e380f72dac6211b37c321f6555f3eb20ee2736f37784a3edda54da3a15398079b44f474b1fc7f522ffa3ae004a67a0a0266ecc8c82b9a0220b',
      },
    ],
    cmd: '{"networkId":"development","payload":{"exec":{"data":null,"code":"(+ 1 2)"}},"signers":[{"pubKey":"f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f"}],"meta":{"creationTime":1655142318,"ttl":28800,"gasLimit":10000,"chainId":"0","gasPrice":1.0e-5,"sender":"k:f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f"},"nonce":"2022-06-13 17:45:18.211131 UTC"}',
  };

  const sendReq: ISendRequestBody = createSendRequest([signedCommand]);

  const expectedErrorMsg =
    'Error: Validation failed for hash "ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q": Transaction metadata (chain id, chainweb version) conflicts with this endpoint';
  const responseActual: Promise<Response | SendResponse> = send(
    sendReq,
    `${testURL}/wrongChain`,
  );
  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});

test('/send should return error if tx already exists on chain', async () => {
  // A tx created for chain 0 of devnet using `pact -a`.
  const signedCommand: ICommand = {
    hash: 'ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q',
    sigs: [
      {
        sig: '0df98906e0c7a6e380f72dac6211b37c321f6555f3eb20ee2736f37784a3edda54da3a15398079b44f474b1fc7f522ffa3ae004a67a0a0266ecc8c82b9a0220b',
      },
    ],
    cmd: '{"networkId":"development","payload":{"exec":{"data":null,"code":"(+ 1 2)"}},"signers":[{"pubKey":"f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f"}],"meta":{"creationTime":1655142318,"ttl":28800,"gasLimit":10000,"chainId":"0","gasPrice":1.0e-5,"sender":"k:f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f"},"nonce":"2022-06-13 17:45:18.211131 UTC"}',
  };
  const sendReq: ISendRequestBody = createSendRequest([signedCommand]);
  const expectedErrorMsg =
    'Error: Validation failed for hash "ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q": Transaction already exists on chain';
  const responseActual: Promise<Response | SendResponse> = send(
    sendReq,
    `${testURL}/duplicate`,
  );
  return expect(responseActual).rejects.toThrowError(expectedErrorMsg);
});
