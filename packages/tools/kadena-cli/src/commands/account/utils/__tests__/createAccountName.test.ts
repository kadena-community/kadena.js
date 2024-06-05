/// <reference lib="dom" />

import { HttpResponse, http } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';
import { server } from '../../../../mocks/server.js';
import { createAccountName } from '../createAccountName.js';
import { defaultConfigMock } from './mocks.js';

describe('createAccountName', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('should throw an error when public keys are empty', async () => {
    await expect(async () => {
      await createAccountName({
        publicKeys: [],
        chainId: defaultConfigMock.chainId,
        predicate: defaultConfigMock.predicate,
        networkConfig: defaultConfigMock.networkConfig,
      });
    }).rejects.toThrow('No public keys provided to create an account.');
  });

  it('should call createPrincipal method and return w:account when multiple public keys are provided', async () => {
    const accountName = await createAccountName({
      publicKeys: ['publicKeys1', 'publicKeys2'],
      chainId: defaultConfigMock.chainId,
      predicate: defaultConfigMock.predicate,
      networkConfig: defaultConfigMock.networkConfig,
    });
    expect(accountName).toBe(
      'w:FxlQEvb6qHb50NClEnpwbT2uoJHuAu39GTSwXmASH2k:keys-all',
    );
  });

  it('should call createPrincipal method and return k:account when only one public key is provided', async () => {
    const accountName = await createAccountName({
      publicKeys: ['publicKey1'],
      chainId: defaultConfigMock.chainId,
      predicate: defaultConfigMock.predicate,
      networkConfig: defaultConfigMock.networkConfig,
    });
    expect(accountName).toBe('k:publicKey1');
  });

  it('should throw an error when createPrincipal method throws an error', async () => {
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local',
        () => {
          return new HttpResponse(null, { status: 500 });
        },
      ),
    );

    await expect(async () => {
      await createAccountName({
        publicKeys: ['publicKeys1', 'publicKeys2'],
        chainId: defaultConfigMock.chainId,
        predicate: defaultConfigMock.predicate,
        networkConfig: defaultConfigMock.networkConfig,
      });
    }).rejects.toThrow('There was an error creating the account name:');
  });
});
