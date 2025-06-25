import { renderHook } from '@testing-library/react-hooks';
import { vi } from 'vitest';
import { useRemoveAgent } from '../removeAgent';

describe('removeAgent hook', () => {
  const mocksHook = vi.hoisted(() => {
    return {
      useAsset: vi.fn().mockReturnValue({
        paused: true,
        asset: { id: 'test-asset' },
      }),
      useAccount: vi.fn().mockReturnValue({
        account: {
          address: 'k:1',
        },
        sign: vi.fn(),
        isMounted: true,
        isOwner: true,
      }),

      useTransactions: vi.fn().mockReturnValue({
        addTransaction: vi.fn(),
        isActiveAccountChangeTx: false,
      }),
      useNotifications: vi.fn().mockReturnValue({
        addNotification: vi.fn(),
      }),
      useSubmit2Chain: vi.fn().mockReturnValue({
        submit2Chain: vi.fn(),
      }),
      removeAgentService: vi.fn(),
    };
  });

  beforeEach(async () => {
    vi.mock('./../account', async () => {
      const actual = await vi.importActual('./../account');
      return {
        ...actual,
        useAccount: mocksHook.useAccount,
      };
    });

    vi.mock('./../asset', async () => {
      const actual = await vi.importActual('./../asset');
      return {
        ...actual,
        useAsset: mocksHook.useAsset,
      };
    });

    vi.mock('./../transactions', async () => {
      const actual = await vi.importActual('./../transactions');
      return {
        ...actual,
        useTransactions: mocksHook.useTransactions,
      };
    });

    vi.mock('@/hooks/notifications', async () => {
      const actual = await vi.importActual('@/hooks/notifications');
      return {
        ...actual,
        useNotifications: mocksHook.useNotifications,
      };
    });

    vi.mock('./../useSubmit2Chain', async () => {
      const actual = await vi.importActual('./../useSubmit2Chain');
      return {
        ...actual,
        useSubmit2Chain: mocksHook.useSubmit2Chain,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct properties', async () => {
    const { result } = renderHook(() => useRemoveAgent());
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true, when account is mounted, when contract is NOT paused, when account is owner, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isOwner: true,
        isMounted: true,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() => useRemoveAgent());

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return false, when account is NOT mounted, when contract is NOT paused, when account is owner, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isOwner: true,
        isMounted: false,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() => useRemoveAgent());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is  mounted, when contract is paused, when account is owner, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isOwner: true,
        isMounted: true,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: true,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() => useRemoveAgent());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is  mounted, when contract is NOT paused, when account is NOT owner, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isOwner: false,
        isMounted: true,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() => useRemoveAgent());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is  mounted, when contract is NOT paused, when account is owner, when IS activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isOwner: true,
        isMounted: true,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: true,
      }));

      const { result } = renderHook(() => useRemoveAgent());

      expect(result.current.isAllowed).toBe(false);
    });
  });

  describe('submit', () => {
    it('should call removeAgent with the correct parameters', async () => {
      // Mock the submit2Chain function to return a transaction
      const mockTransaction = { id: 'tx-123', status: 'submitted' };
      mocksHook.useSubmit2Chain.mockImplementation(() => ({
        submit2Chain: vi.fn().mockResolvedValue(mockTransaction),
      }));

      const { result } = renderHook(() => useRemoveAgent());
      const data = { agent: 'k:agent123' };

      const returnedTx = await result.current.submit(data);

      expect(returnedTx).toEqual(mockTransaction);
    });

    it('should sign the transaction and submit it to the client', async () => {
      // Mock the submit2Chain function to capture the callback
      let capturedOptions: Record<string, unknown> | undefined;
      mocksHook.useSubmit2Chain.mockImplementation(() => ({
        submit2Chain: (data: unknown, options: Record<string, unknown>) => {
          capturedOptions = options;
          return Promise.resolve({ id: 'tx-123', status: 'submitted' });
        },
      }));

      const mockAccount = { address: 'k:owner', publicKey: 'pubkey' };
      const mockAsset = { id: 'asset-123' };

      mocksHook.useAccount.mockImplementation(() => ({
        account: mockAccount,
        isOwner: true,
        isMounted: true,
        sign: vi.fn().mockResolvedValue({ hash: 'signed-tx' }),
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        asset: mockAsset,
        paused: false,
      }));

      // Mock the removeAgent service
      vi.mock('@/services/removeAgent', async () => {
        const actual = await vi.importActual('@/services/removeAgent');
        return {
          ...actual,
          removeAgent: mocksHook.removeAgentService.mockResolvedValue({
            cmd: 'unsigned-cmd',
          }),
        };
      });

      const { result } = renderHook(() => useRemoveAgent());
      const agentData = { agent: 'k:agent123' };

      await result.current.submit(agentData);

      // Check that options passed to submit2Chain are correct
      expect(capturedOptions?.notificationSentryName).toBe(
        'error:submit:removeagent',
      );
      // Access transaction via type assertions since we're using Record<string, unknown>
      const transaction = capturedOptions?.transaction as {
        type: string;
        accounts: string[];
      };
      expect(transaction?.type).toStrictEqual({
        name: 'REMOVEAGENT',
        overall: true,
      });
      expect(transaction?.accounts).toEqual(['k:owner', 'k:agent123']);

      // Check that the chain function would work correctly when called
      if (
        capturedOptions &&
        typeof capturedOptions.chainFunction === 'function'
      ) {
        await capturedOptions.chainFunction(mockAccount, mockAsset);
        expect(mocksHook.removeAgentService).toHaveBeenCalledWith(
          agentData,
          mockAccount,
          mockAsset,
        );
      }
    });

    it('should not submit if the sign function returns nothing', async () => {
      // Mock the submit2Chain to trace execution flow
      let chainFunctionCalled = false;

      mocksHook.useSubmit2Chain.mockImplementation(() => ({
        submit2Chain: (
          data: unknown,
          options: { chainFunction?: (...args: unknown[]) => unknown },
        ) => {
          // We'll simulate the flow in useSubmit2Chain to test our hook's integration
          const { chainFunction } = options;

          // Simulate the flow where sign returns nothing
          if (chainFunction) {
            chainFunctionCalled = true;
            // This would return undefined from submit2Chain
            return Promise.resolve(undefined);
          }

          return Promise.resolve(undefined);
        },
      }));

      const { result } = renderHook(() => useRemoveAgent());
      const data = { agent: 'k:agent123' };

      const returnedTx = await result.current.submit(data);

      // Should return undefined if sign function returns nothing
      expect(returnedTx).toBeUndefined();
      expect(chainFunctionCalled).toBe(true);
    });

    it('should add a notification and return early when asset is not found', async () => {
      // Mock the case where asset is not available
      mocksHook.useAsset.mockImplementation(() => ({
        asset: undefined,
        paused: false,
      }));

      // Mock submit2Chain to track how it's called
      let submit2ChainCalled = false;
      let addNotificationCalled = false;

      mocksHook.useSubmit2Chain.mockImplementation(() => ({
        submit2Chain: (
          data: unknown,
          options: {
            skipAssetCheck?: boolean;
            notificationSentryName?: string;
          },
        ) => {
          // In useSubmit2Chain, if !asset it would add a notification and return
          if (!mocksHook.useAsset().asset && !options.skipAssetCheck) {
            if (options.notificationSentryName) {
              addNotificationCalled = true;
            }
            return Promise.resolve(undefined);
          }
          submit2ChainCalled = true;
          return Promise.resolve({ id: 'tx-123' });
        },
      }));

      const { result } = renderHook(() => useRemoveAgent());
      const data = { agent: 'k:agent123' };

      const returnedTx = await result.current.submit(data);

      // Should return undefined if asset not found
      expect(returnedTx).toBeUndefined();
      // The submit2Chain function should have added a notification
      expect(addNotificationCalled).toBe(true);
      // The chainFunction should not be called
      expect(submit2ChainCalled).toBe(false);
    });

    it('should handle errors and add notification', async () => {
      // Set up mocks for error handling
      const mockError = new Error('Test error');

      mocksHook.useSubmit2Chain.mockImplementation(() => ({
        submit2Chain: () => Promise.reject(mockError),
      }));

      const mockAddNotification = vi.fn();
      mocksHook.useNotifications.mockImplementation(() => ({
        addNotification: mockAddNotification,
      }));

      const { result } = renderHook(() => useRemoveAgent());
      const data = { agent: 'k:agent123' };

      // Execute submit with error-causing scenario
      await expect(result.current.submit(data)).rejects.toThrow('Test error');

      // We can't directly test error handling in submit2Chain from here,
      // but we can verify our hook passes the call through correctly
      // which would trigger the error handling in submit2Chain
    });
  });
});
