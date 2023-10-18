jest.mock('cross-fetch');
import { sign } from '@kadena/cryptography-utils';
import { ensureSignedCommand } from '@kadena/pactjs';
import type {
  ICommand,
  IUnsignedCommand,
  SignatureWithHash,
} from '@kadena/types';
import type { Response } from 'cross-fetch';
import fetch from 'cross-fetch';
import type {
  ICommandResult,
  ILocalCommandResult,
  LocalResultWithoutPreflight,
} from '../interfaces/PactAPI';
import { local } from '../local';
import { pactTestCommand, testURL } from './mockdata/Pact';
import { mockFetch } from './mockdata/mockFetch';

const mockedFunctionFetch = fetch as jest.MockedFunction<typeof fetch>;
mockedFunctionFetch.mockImplementation(
  mockFetch as jest.MockedFunction<typeof fetch>,
);

test('local should return preflight result of tx queried ', async () => {
  const commandStr1 = JSON.stringify(pactTestCommand);
  const keyPair1 = {
    publicKey:
      'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    secretKey:
      '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
  };
  const cmdWithOneSignature1: SignatureWithHash = sign(commandStr1, keyPair1);
  const sampleCommand1: IUnsignedCommand = {
    cmd: commandStr1,
    hash: cmdWithOneSignature1.hash,
    sigs: [
      typeof cmdWithOneSignature1.sig === 'string'
        ? { sig: cmdWithOneSignature1.sig }
        : undefined,
    ],
  };
  const signedCommand1: ICommand = ensureSignedCommand(sampleCommand1);

  const commandResult1: ILocalCommandResult = {
    reqKey: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
    txId: null,
    result: {
      data: 3,
      status: 'success',
    },
    gas: 0,
    continuation: null,
    metaData: null,
    logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
    preflightWarnings: [],
  };
  const responseExpected: ILocalCommandResult = commandResult1;
  const responseActual: ICommandResult | Response = await local(
    signedCommand1,
    testURL,
  );

  expect(responseExpected).toEqual(responseActual);
});

test('local with `{preflight: false}` option returns non-preflight result', async () => {
  const commandStr1 = JSON.stringify(pactTestCommand);
  const keyPair1 = {
    publicKey:
      'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    secretKey:
      '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
  };
  const cmdWithOneSignature1: SignatureWithHash = sign(commandStr1, keyPair1);
  const sampleCommand1: IUnsignedCommand = {
    cmd: commandStr1,
    hash: cmdWithOneSignature1.hash,
    sigs: [
      typeof cmdWithOneSignature1.sig === 'string'
        ? { sig: cmdWithOneSignature1.sig }
        : undefined,
    ],
  };
  const signedCommand1: ICommand = ensureSignedCommand(sampleCommand1);

  const commandResult1: ILocalCommandResult = {
    reqKey: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
    txId: null,
    result: {
      data: 3,
      status: 'success',
    },
    gas: 0,
    continuation: null,
    metaData: null,
    logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
  };
  const responseExpected: LocalResultWithoutPreflight = commandResult1;
  const responseActual = await local(signedCommand1, testURL, {
    preflight: false,
  });

  expect(responseExpected).toEqual(responseActual);
});

test('local with `{signatureVerification: false}` option returns preflight result without signature verification', async () => {
  const commandStr1 = JSON.stringify(pactTestCommand);
  const keyPair1 = {
    publicKey:
      'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    secretKey:
      '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
  };
  const cmdWithOneSignature1: SignatureWithHash = sign(commandStr1, keyPair1);
  const sampleCommand1: IUnsignedCommand = {
    cmd: commandStr1,
    hash: cmdWithOneSignature1.hash,
    sigs: [undefined],
  };

  const commandResult1: ILocalCommandResult = {
    reqKey: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
    txId: null,
    result: {
      data: 3,
      status: 'success',
    },
    gas: 0,
    continuation: null,
    metaData: null,
    logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
    preflightWarnings: [],
  };
  const responseExpected = commandResult1;
  const responseActual: LocalResultWithoutPreflight = await local(
    sampleCommand1,
    testURL,
    {
      signatureVerification: false,
    },
  );

  expect(responseExpected).toEqual(responseActual);
});
