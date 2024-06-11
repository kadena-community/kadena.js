import { assert, beforeEach, describe, expect, it } from 'vitest';

import { afterEach } from 'node:test';
import { accountDetailsSuccessData } from '../../../../mocks/data/accountDetails.js';
import { devNetConfigMock } from '../../../../mocks/network.js';
import { server, useMswHandler } from '../../../../mocks/server.js';
import { accountDetails } from '../../commands/accountDetails.js';

describe('accountDetails', () => {
  beforeEach(() => {
    useMswHandler({
      network: devNetConfigMock,
      response: accountDetailsSuccessData,
    });
  });

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
    useMswHandler({
      network: devNetConfigMock,
      response: {
        error: 'row not found',
      },
      status: 404,
    });
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
