import { HttpResponse, http } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';
import { server } from '../../../mocks/server.js';
import { getAccountDetailsFromChain } from '../getAccountDetails.js';
import { defaultConfigMock, devNetConfigMock } from './mocks.js';

describe('getAccountDetailsFromChain', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('should return account details from chain when account is available on chain', async () => {
    const result = await getAccountDetailsFromChain({
      ...defaultConfigMock,
      accountName: 'k:accountName',
      network: devNetConfigMock.network,
      networkConfig: devNetConfigMock,
    });

    const expectedResult = {
      publicKeys: ['publicKey1', 'publicKey2'],
      predicate: 'keys-all',
    };
    expect(result).toStrictEqual(expectedResult);
  });

  it('should throw an error when account is not available on chain', async () => {
    server.use(
      http.post(
        'https://localhost:8080/chainweb/0.0/fast-development/chain/1/pact/api/v1/local',
        () => {
          return HttpResponse.json({ error: 'row not found' }, { status: 404 });
        },
      ),
    );
    await expect(async () => {
      await getAccountDetailsFromChain({
        ...defaultConfigMock,
        accountName: 'k:accountName',
        network: devNetConfigMock.network,
        networkConfig: devNetConfigMock,
      });
    }).rejects.toThrow('{"error":"row not found"}');
  });
});
