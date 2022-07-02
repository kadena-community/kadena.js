import type {
  LocalRequestBody,
  LocalResponse,
  SignatureWithHash,
} from '@kadena/types';

import { sign } from '../../../../crypto/src/sign';
import { local } from '../local';

import { mockFetch } from './mockdata/mockFetch';
import { pactTestCommand } from './mockdata/Pact';

import fetch from 'node-fetch';

jest.mock('node-fetch');
const mockedFunctionFetch = fetch as jest.MockedFunction<typeof fetch>;
mockedFunctionFetch.mockImplementation(
  mockFetch as jest.MockedFunction<typeof fetch>,
);

test('/local should return request keys of txs submitted', async () => {
  const commandStr1 = JSON.stringify(pactTestCommand);
  const keyPair1 = {
    publicKey:
      'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    secretKey:
      '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
  };
  const cmdWithOneSignature1: SignatureWithHash = sign(commandStr1, keyPair1);
  const signedCommand1: LocalRequestBody = {
    cmd: commandStr1,
    hash: cmdWithOneSignature1.hash,
    sigs: [{ sig: cmdWithOneSignature1.sig }],
  };

  const commandResult1: LocalResponse = {
    reqKey: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
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
  const localReq: LocalRequestBody = signedCommand1;
  const responseExpected: LocalResponse = commandResult1;
  const responseActual: LocalResponse = await local(localReq, '');

  expect(responseExpected).toEqual(responseActual);
});
