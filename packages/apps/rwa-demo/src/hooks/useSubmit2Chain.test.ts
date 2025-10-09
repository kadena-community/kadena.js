import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { EVENT_NAMES } from '@/utils/analytics';
import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSubmit2Chain } from './useSubmit2Chain';

// Mock all dependencies
vi.mock('./account', () => ({
  useAccount: vi.fn(() => ({
    account: { name: 'testAccount', key: 'testKey' },
    sign: vi
      .fn()
      .mockImplementation((tx) => Promise.resolve({ ...tx, signed: true })),
  })),
}));

vi.mock('./asset', () => ({
  useAsset: vi.fn(() => ({
    asset: {
      uuid: 'asset-123',
      name: 'Test Asset',
      contractName: 'test',
      namespace: 'ns',
      supply: 100,
      investorCount: 0,
      compliance: {},
    },
    assets: [],
    paused: false,
    setAsset: vi.fn(),
    addAsset: vi.fn(),
    addExistingAsset: vi.fn(),
    removeAsset: vi.fn(),
    getAsset: vi.fn(),
    maxCompliance: vi.fn(),
    investors: [],
    initFetchInvestors: vi.fn(),
    investorsIsLoading: false,
    agents: [],
    initFetchAgents: vi.fn(),
    agentsIsLoading: false,
  })),
}));

vi.mock('./notifications', () => ({
  useNotifications: vi.fn(() => ({
    addNotification: vi.fn(),
  })),
}));

vi.mock('./transactions', () => ({
  useTransactions: vi.fn(() => ({
    addTransaction: vi
      .fn()
      .mockImplementation((tx) => ({ ...tx, id: 'transaction-123' })),
  })),
}));

vi.mock('@/utils/client', () => ({
  getClient: vi.fn(() => ({
    submit: vi.fn().mockResolvedValue({
      requestKey: 'req-123',
      hash: 'hash-123',
    }),
  })),
}));

describe('useSubmit2Chain', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call chainFunction with account and asset', async () => {
    const { result } = renderHook(() => useSubmit2Chain());

    const chainFunction = vi.fn().mockResolvedValue({
      cmd: 'test-command',
      sigs: [],
      hash: 'test-hash',
    });

    await result.current.submit2Chain(
      {},
      {
        chainFunction,
        notificationSentryName: EVENT_NAMES['error:submitChain'],
        transaction: {
          accounts: ['test-account'],
          type: TXTYPES.TRANSFERTOKENS,
        },
      },
    );

    expect(chainFunction).toHaveBeenCalledWith(
      { name: 'testAccount', key: 'testKey' },
      {
        uuid: 'asset-123',
        name: 'Test Asset',
        contractName: 'test',
        namespace: 'ns',
        supply: 100,
        investorCount: 0,
        compliance: {},
      },
    );
  });

  it('should send notification when no transaction is returned from chainFunction', async () => {
    const { result } = renderHook(() => useSubmit2Chain());

    const chainFunction = vi.fn().mockResolvedValue(undefined);
    const { useNotifications } = await import('./notifications');
    const mockAddNotification =
      vi.mocked(useNotifications).mock.results[0].value.addNotification;

    const response = await result.current.submit2Chain(
      { testData: true },
      {
        chainFunction,
        notificationSentryName: EVENT_NAMES['error:submitChain'],
        transaction: {
          accounts: ['test-account'],
          type: TXTYPES.TRANSFERTOKENS,
        },
      },
    );

    expect(chainFunction).toHaveBeenCalled();
    expect(response).toBeUndefined();
    expect(mockAddNotification).toHaveBeenCalledWith(
      {
        intent: 'negative',
        label: 'transaction not created',
        message:
          'The transaction could not be created. Please check the data provided.',
      },
      {
        name: EVENT_NAMES['error:submitChain'],
        options: {
          message: 'Transaction not created',
          sentryData: {
            type: 'submit_chain',
            captureContext: {
              extra: {
                data: { testData: true },
              },
            },
          },
        },
      },
    );
  });

  it('should sign the transaction when one is returned from chainFunction', async () => {
    const { result } = renderHook(() => useSubmit2Chain());

    const chainFunction = vi.fn().mockResolvedValue({
      cmd: 'test-command',
      sigs: [],
      hash: 'test-hash',
    });

    const { useAccount } = await import('./account');
    const mockSign = vi.mocked(useAccount).mock.results[0].value.sign;

    await result.current.submit2Chain(
      {},
      {
        chainFunction,
        notificationSentryName: EVENT_NAMES['error:submitChain'],
        transaction: {
          accounts: ['test-account'],
          type: TXTYPES.TRANSFERTOKENS,
        },
      },
    );

    expect(mockSign).toHaveBeenCalledWith({
      cmd: 'test-command',
      sigs: [],
      hash: 'test-hash',
    });
  });

  it('should send error notification when an exception occurs', async () => {
    const { result } = renderHook(() => useSubmit2Chain());

    const chainFunction = vi.fn().mockImplementation(() => {
      throw new Error('Test error message');
    });

    const { useNotifications } = await import('./notifications');
    const mockAddNotification =
      vi.mocked(useNotifications).mock.results[0].value.addNotification;

    await result.current.submit2Chain(
      { testData: true },
      {
        chainFunction,
        notificationSentryName: EVENT_NAMES['error:submitChain'],
        transaction: {
          accounts: ['test-account'],
          type: TXTYPES.TRANSFERTOKENS,
        },
      },
    );

    expect(chainFunction).toHaveBeenCalled();
    expect(mockAddNotification).toHaveBeenCalledWith(
      {
        intent: 'negative',
        label: 'there was an error',
        message: 'Test error message',
      },
      expect.objectContaining({
        name: EVENT_NAMES['error:submitChain'],
        options: expect.objectContaining({
          message: 'Test error message',
          sentryData: expect.objectContaining({
            type: 'submit_chain',
          }),
        }),
      }),
    );
  });

  it('should return the transaction when everything succeeds', async () => {
    const { result } = renderHook(() => useSubmit2Chain());

    const chainFunction = vi.fn().mockResolvedValue({
      cmd: 'test-command',
      sigs: [],
      hash: 'test-hash',
    });

    const { useTransactions } = await import('./transactions');
    const mockAddTransaction =
      vi.mocked(useTransactions).mock.results[0].value.addTransaction;

    mockAddTransaction.mockReturnValue({
      id: 'transaction-123',
      requestKey: 'req-123',
      hash: 'hash-123',
      accounts: ['test-account'],
      type: TXTYPES.TRANSFERTOKENS,
    });

    const response = await result.current.submit2Chain(
      {},
      {
        chainFunction,
        notificationSentryName: EVENT_NAMES['error:submitChain'],
        transaction: {
          accounts: ['test-account'],
          type: TXTYPES.TRANSFERTOKENS,
        },
      },
    );

    expect(response).toEqual({
      id: 'transaction-123',
      requestKey: 'req-123',
      hash: 'hash-123',
      accounts: ['test-account'],
      type: TXTYPES.TRANSFERTOKENS,
    });
  });

  it('should send notification when asset is not found and skipAssetCheck is not true', async () => {
    // Override asset mock to return undefined
    vi.mocked(await import('./asset')).useAsset.mockReturnValueOnce({
      asset: undefined,
      assets: [],
      paused: false,
      setAsset: vi.fn(),
      addAsset: vi.fn(),
      addExistingAsset: vi.fn(),
      removeAsset: vi.fn(),
      getAsset: vi.fn(),
      maxCompliance: vi.fn(),
      investors: [],
      initFetchInvestors: vi.fn(),
      investorsIsLoading: false,
      agents: [],
      initFetchAgents: vi.fn(),
      agentsIsLoading: false,
    });

    const { result } = renderHook(() => useSubmit2Chain());

    const chainFunction = vi.fn();
    const { useNotifications } = await import('./notifications');
    const mockAddNotification =
      vi.mocked(useNotifications).mock.results[0].value.addNotification;

    const response = await result.current.submit2Chain(
      {},
      {
        chainFunction,
        notificationSentryName: EVENT_NAMES['error:submitChain'],
        transaction: {
          accounts: ['test-account'],
          type: TXTYPES.TRANSFERTOKENS,
        },
      },
    );

    expect(chainFunction).not.toHaveBeenCalled();
    expect(response).toBeUndefined();
    expect(mockAddNotification).toHaveBeenCalledWith(
      {
        intent: 'negative',
        label: 'asset not found',
        message: '',
      },
      {
        name: EVENT_NAMES['error:submitChain'],
        options: {
          message: 'asset not found',
          sentryData: {
            type: 'submit_chain',
          },
        },
      },
    );
  });

  it('should proceed when skipAssetCheck is true even when asset is undefined', async () => {
    // Override asset mock to return undefined
    vi.mocked(await import('./asset')).useAsset.mockReturnValueOnce({
      asset: undefined,
      assets: [],
      paused: false,
      setAsset: vi.fn(),
      addAsset: vi.fn(),
      addExistingAsset: vi.fn(),
      removeAsset: vi.fn(),
      getAsset: vi.fn(),
      maxCompliance: vi.fn(),
      investors: [],
      initFetchInvestors: vi.fn(),
      investorsIsLoading: false,
      agents: [],
      initFetchAgents: vi.fn(),
      agentsIsLoading: false,
    });

    const { result } = renderHook(() => useSubmit2Chain());

    const chainFunction = vi.fn().mockResolvedValue({
      cmd: 'test-command',
      sigs: [],
      hash: 'test-hash',
    });

    await result.current.submit2Chain(
      {},
      {
        chainFunction,
        notificationSentryName: EVENT_NAMES['error:submitChain'],
        skipAssetCheck: true,
        transaction: {
          accounts: ['test-account'],
          type: TXTYPES.TRANSFERTOKENS,
        },
      },
    );

    expect(chainFunction).toHaveBeenCalled();
  });

  // Since we can't easily spy on the client.submit method due to how the mocks are set up,
  // we can instead verify that the client is working correctly by testing the end result
  // which depends on the client submitting the transaction successfully
  it('should successfully process a transaction through the client submit method', async () => {
    const { result } = renderHook(() => useSubmit2Chain());

    const txPayload = {
      cmd: 'test-command',
      sigs: [],
      hash: 'test-hash',
    };

    const chainFunction = vi.fn().mockResolvedValue(txPayload);

    const { useAccount } = await import('./account');
    const mockSign = vi.mocked(useAccount).mock.results[0].value.sign;
    mockSign.mockResolvedValue({
      ...txPayload,
      signed: true,
    });

    const response = await result.current.submit2Chain(
      {},
      {
        chainFunction,
        notificationSentryName: EVENT_NAMES['error:submitChain'],
        transaction: {
          accounts: ['test-account'],
          type: TXTYPES.TRANSFERTOKENS,
        },
      },
    );

    // Verify that we got a transaction response with the expected client results
    expect(response).toBeDefined();
    expect(response).toHaveProperty('requestKey', 'req-123');
    expect(response).toHaveProperty('hash', 'hash-123');

    // This indirectly verifies that client.submit was called and returned the expected result
  });
});
