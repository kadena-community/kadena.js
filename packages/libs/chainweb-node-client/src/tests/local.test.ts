import { sign } from '@kadena/cryptography-utils';
import { ensureSignedCommand } from '@kadena/pactjs';
import type {
  ICommand,
  IUnsignedCommand,
  SignatureWithHash,
} from '@kadena/types';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, expect, test } from 'vitest';
import type {
  ICommandResult,
  ILocalCommandResult,
  LocalResultWithoutPreflight,
} from '../interfaces/PactAPI';
import { local } from '../local';
import { pactTestCommand, testURL } from './mockdata/Pact';
import { localCommandResult } from './mockdata/execCommand';

const httpHandlers = [
  http.post(`${testURL}/api/v1/local`, ({ request }) => {
    const url = new URL(request.url);
    const isPreflight = url.searchParams.get('preflight') === 'true';
    return HttpResponse.json({
      preflightResult: localCommandResult,
      ...(isPreflight ? { preflightWarnings: [] } : {}),
    });
  }),
];

const server = setupServer(...httpHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

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
    ...localCommandResult,
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

  const commandResult1: ILocalCommandResult = localCommandResult;
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
    ...localCommandResult,
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
