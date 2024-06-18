/// <reference lib="dom" />

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createPrincipalSuccessData } from '../../../../mocks/data/accountDetails.js';
import {
  server,
  useMswDynamicHandler,
  useMswHandler,
} from '../../../../mocks/server.js';
import { createAccountName } from '../createAccountName.js';
import { defaultConfigMock } from './mocks.js';

describe('createAccountName', () => {
  beforeEach(() => {
    useMswDynamicHandler({
      getResponse: async (request) => {
        const data = (await request.json()) as { cmd: string };
        const parsedCMD = JSON.parse(data.cmd as string);
        // create principal with only one key
        if (parsedCMD.payload.exec.data.ks.keys.length === 1) {
          return [
            {
              result: {
                data: `k:${parsedCMD.payload.exec.data.ks.keys}`,
                status: 'success',
              },
            },
            { status: 200 },
          ];
        }

        return [createPrincipalSuccessData, { status: 200 }];
      },
    });
  });
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
    useMswHandler({
      response: null,
      status: 500,
    });

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
