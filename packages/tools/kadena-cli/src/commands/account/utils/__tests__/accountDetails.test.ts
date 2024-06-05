import { HttpResponse, http } from 'msw';
import { assert, describe, expect, it } from 'vitest';

import { afterEach } from 'node:test';
import { server } from '../../../../mocks/server.js';
import { accountDetails } from '../../commands/accountDetails.js';
import { devNetConfigMock } from './mocks.js';

describe('accountDetails', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('should return account details', async () => {
    const result = await accountDetails({
      accountName: 'accountName',
      chainIds: ['1'],
      networkId: devNetConfigMock.networkId,
      networkHost: devNetConfigMock.networkHost,
      fungible: 'coin',
    });
    assert(result.status === 'success');
    expect(result.data).toEqual([
      {
        ['1']: {
          account: 'accountName',
          guard: {
            pred: 'keys-all',
            keys: ['publicKey1', 'publicKey2'],
          },
          balance: 0,
        },
      },
    ]);
  });

  it('should return error if account does not exist', async () => {
    server.use(
      http.post(
        'http://localhost:8080/chainweb/0.0/development/chain/1/pact/api/v1/local',
        () => {
          return HttpResponse.json({ error: 'row not found' }, { status: 404 });
        },
      ),
    );
    const result = await accountDetails({
      accountName: 'k:accountName',
      chainIds: ['1'],
      networkId: devNetConfigMock.networkId,
      networkHost: devNetConfigMock.networkHost,
      fungible: 'coin',
    });
    const warningMsg = `\nAccount "k:accountName" is not available on\nfollowing chain(s): 1 on network "development"`;
    expect(result.warnings).toStrictEqual([warningMsg]);
  });
});
