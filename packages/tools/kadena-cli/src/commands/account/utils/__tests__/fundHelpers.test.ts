import type { ITransactionDescriptor } from '@kadena/client';
import { createClient } from '@kadena/client';
import { describeModule } from '@kadena/client-utils';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import deployDevNetFaucet from '../../../devnet/faucet/deploy/index.js';
import {
  deployFaucetsToChains,
  findMissingModuleDeployments,
  getTxDetails,
} from '../fundHelpers.js';

vi.mock('@kadena/client', async (importOriginal) => {
  const actual = (await importOriginal()) as {};
  return {
    ...actual,
    createClient: vi.fn(),
  };
});

describe('getTxDetails', () => {
  const mockResult = {
    'request-key-1': {
      reqKey: 'request-key-1',
      txId: 'tx-id-1',
      result: {
        status: 'success',
        data: 'write succeded',
      },
      gas: 100,
      continuation: null,
      metaData: null,
    },
  };

  const payloadData: ITransactionDescriptor[] = [
    {
      requestKey: 'request-key-1',
      chainId: '1',
      networkId: 'development',
    },
  ];

  beforeEach(() => {
    (createClient as Mock).mockImplementation(() => ({
      pollStatus: vi.fn().mockResolvedValue(mockResult),
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should get success transaction results based on the requestkey', async () => {
    const result = await getTxDetails(
      payloadData,
      'http://localhost',
      'development',
    );
    expect(result.txResults).toEqual([{ [1]: mockResult['request-key-1'] }]);
  });

  it('should return errors when someting went wrong with requests', async () => {
    (createClient as Mock).mockImplementation(() => ({
      pollStatus: vi.fn().mockRejectedValue(new Error('error')),
    }));
    const result = await getTxDetails(
      payloadData,
      'http://localhost',
      'development',
    );
    expect(result.txErrors).toEqual([
      'ChainID: "1" - requestKey: request-key-1 - error',
    ]);
  });

  it('should return errors when poll status is failure', async () => {
    (createClient as Mock).mockImplementation(() => ({
      pollStatus: vi.fn().mockResolvedValue({
        'request-key-1': {
          reqKey: 'request-key-1',
          txId: 'tx-id-1',
          result: {
            status: 'failure',
            error: 'write failed',
          },
          gas: 100,
          continuation: null,
          metaData: null,
        },
      }),
    }));
    const result = await getTxDetails(
      payloadData,
      'http://localhost',
      'development',
    );
    expect(result.txErrors).toEqual([
      'ChainID: "1" - requestKey: request-key-1 - write failed',
    ]);
  });
});

describe('findMissingModuleDeployments', () => {
  vi.mock('@kadena/client-utils', async (importOriginal) => {
    const actual = (await importOriginal()) as {};
    return {
      ...actual,
      describeModule: vi.fn(),
    };
  });
  beforeEach(() => {
    (describeModule as Mock)
      .mockResolvedValueOnce(false)
      .mockRejectedValueOnce(new Error('error'))
      .mockResolvedValue(true);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return missing module deployments', async () => {
    const undeployedChainIds = await findMissingModuleDeployments(
      'coin',
      {
        networkId: 'development',
        networkHost: 'http://localhost',
      },
      ['1', '2', '3', '4', '5', '6'],
    );

    expect(undeployedChainIds).toEqual(['1', '2']);
  });
});

describe('deployFaucetsToChain', () => {
  vi.mock('../../../devnet/faucet/deploy/index.js', () => ({
    default: vi.fn(),
  }));

  beforeEach(() => {
    (deployDevNetFaucet as Mock)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('error'))
      .mockResolvedValue(undefined);
  });

  it('should deploy faucets to chain and if any error happens should return failedDeployments', async () => {
    const [succeededDeployments, failedDeployments] =
      await deployFaucetsToChains(['1', '2', '3']);
    expect(succeededDeployments).toEqual(['1', '3']);
    expect(failedDeployments).toEqual([{ message: 'error', chainId: '2' }]);
  });
});
