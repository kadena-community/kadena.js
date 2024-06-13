import { createClient } from '@kadena/client';
import type { Mock } from 'vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ensureKdaExtension,
  kdnResolveAddressToName,
  kdnResolveNameToAddress,
} from '../txKdnResolverChain.js';

describe('ensureKdaExtension', () => {
  it('should return the name with .kda extension', () => {
    const res = ensureKdaExtension('name');
    expect(res).toBe('name.kda');
  });

  it('should return the name with lowercase', () => {
    const res = ensureKdaExtension('name.KDA');
    expect(res).toBe('name.kda');
  });
});

describe('kdnResolveNameToAddress', () => {
  vi.mock('@kadena/client', async (importOriginal) => {
    const actual = (await importOriginal()) as {};
    return {
      ...actual,
      createClient: vi.fn().mockReturnValue({
        dirtyRead: vi.fn().mockResolvedValue({
          reqKey: 'request-key-1',
          txId: 'tx-id-1',
          result: {
            status: 'success',
            data: 'k:39710afef15243ba36007ae7aa210ab0e09682b2d963928be350e3424b5a420b',
          },
        }),
      }),
    };
  });
  const name = 'name';
  const network = 'testnet';
  const networkId = 'networkId';
  const networkHost = 'networkHost';

  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should return address when resolving name', async () => {
    const response = await kdnResolveNameToAddress(
      name,
      network,
      networkId,
      networkHost,
    );
    expect(response).toBe(
      'k:39710afef15243ba36007ae7aa210ab0e09682b2d963928be350e3424b5a420b',
    );
  });

  it('should thrown an error when resolving fails or api calls fails', async () => {
    (createClient as Mock).mockReturnValue({
      dirtyRead: vi.fn().mockResolvedValue({
        reqKey: 'request-key-1',
        txId: 'tx-id-1',
        result: {
          status: 'failure',
          error: 'something went wrong',
        },
      }),
    });
    const response = await kdnResolveNameToAddress(
      name,
      'mainnet',
      networkId,
      networkHost,
    );
    expect(response).toBeUndefined();
  });
});

describe('kdnResolveAddressToName', () => {
  const address =
    'k:39710afef15243ba36007ae7aa210ab0e09682b2d963928be350e3424b5a420b';
  const network = 'testnet';
  const networkId = 'networkId';
  const networkHost = 'networkHost';
  it('should return name when resolving address', async () => {
    (createClient as Mock).mockReturnValue({
      dirtyRead: vi.fn().mockResolvedValue({
        reqKey: 'request-key-1',
        txId: 'tx-id-1',
        result: {
          status: 'success',
          data: 'test-account',
        },
      }),
    });
    const response = await kdnResolveAddressToName(
      address,
      network,
      networkId,
      networkHost,
    );
    expect(response).toBe('test-account');
  });

  it('should thrown an error when resolving fails or api calls fails', async () => {
    (createClient as Mock).mockReturnValue({
      dirtyRead: vi.fn().mockResolvedValue({
        reqKey: 'request-key-1',
        txId: 'tx-id-1',
        result: {
          status: 'failure',
          error: 'something went wrong',
        },
      }),
    });
    const response = await kdnResolveAddressToName(
      address,
      'mainnet',
      networkId,
      networkHost,
    );
    expect(response).toBeUndefined();
  });
});
