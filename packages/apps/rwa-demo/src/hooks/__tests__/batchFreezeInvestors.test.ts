import { renderHook } from '@testing-library/react-hooks';
import { useBatchFreezeInvestors } from '../batchFreezeInvestors';

describe('batchFreezeInvestors hook', () => {
  const mocksHook = vi.hoisted(() => {
    return {
      useUser: vi.fn().mockReturnValue({
        user: {
          address: 'k:1',
          name: 'Test User',
          email: 'heman@mastersoftheuniverse.com',
        },
      }),
      useOrganisation: vi.fn().mockReturnValue({
        organisation: {
          id: 'org-123',
          name: 'Test Organisation',
        },
      }),
      useAsset: vi.fn().mockReturnValue({
        paused: true,
        asset: {
          uuid: 'test-asset',
          contractName: 'test',
          namespace: 'ns',
        },
      }),
      useAccount: vi.fn().mockReturnValue({
        account: {
          address: 'k:he-man',
        },
        sign: vi.fn(),
        isMounted: true,
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(false),
        },
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
      mockStore: {
        setFrozenMessages: vi.fn().mockResolvedValue([Promise.resolve()]),
      },
      RWAStore: vi.fn(),
    };
  });

  beforeEach(async () => {
    vi.mock('./../user', async () => {
      const actual = await vi.importActual('./../user');
      return {
        ...actual,
        useUser: mocksHook.useUser,
      };
    });

    vi.mock('./../organisation', async () => {
      const actual = await vi.importActual('./../organisation');
      return {
        ...actual,
        useOrganisation: mocksHook.useOrganisation,
      };
    });
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

    vi.mock('@/utils/store', async () => {
      const actual = await vi.importActual('@/utils/store');
      return {
        ...actual,
        RWAStore: mocksHook.RWAStore.mockReturnValue(mocksHook.mockStore),
      };
    });

    // Mock batchSetAddressFrozen service
    vi.mock('@/services/batchSetAddressFrozen', () => ({
      batchSetAddressFrozen: vi
        .fn()
        .mockImplementation((data, account, asset) => {
          return {
            cmd: 'batch-set-address-frozen',
            data,
            account,
            asset,
          };
        }),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct properties', async () => {
    const { result } = renderHook(() => useBatchFreezeInvestors());
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true, when account is Mounted when contract is NOT paused, when account has role Freezer, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        isMounted: true,
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() => useBatchFreezeInvestors());

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return false, when account is NOT Mounted when contract is NOT paused, when account is Freezer, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        isMounted: false,
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() => useBatchFreezeInvestors());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is Mounted when contract is paused, when account is Freezer, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        isMounted: true,
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: true,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() => useBatchFreezeInvestors());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is Mounted when contract is NOT paused, when account NOT Freezer, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        isMounted: true,
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(false),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() => useBatchFreezeInvestors());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is Mounted when contract is NOT paused, when account Freezer, when activeAccountTx IS busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        isMounted: true,
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: true,
      }));

      const { result } = renderHook(() => useBatchFreezeInvestors());

      expect(result.current.isAllowed).toBe(false);
    });
  });

  describe('submit', () => {
    it('should call submit2Chain with the correct data', async () => {
      // Setup
      const mockTransaction = {
        id: 'tx-123',
        requestKey: 'req-123',
        type: 'FREEZEINVESTOR',
      };

      mocksHook.useAccount.mockReturnValue({
        account: { address: 'k:skeletor' },
      });

      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: vi.fn().mockResolvedValue(mockTransaction),
      });

      const { result } = renderHook(() => useBatchFreezeInvestors());

      // Test data
      const freezeData = {
        investorAccounts: ['k:investor1', 'k:investor2'],
        pause: true,
        message: 'Freezing for testing',
      };

      // Execute
      const response = await result.current.submit(freezeData);

      // Assert
      const submit2ChainFn = mocksHook.useSubmit2Chain().submit2Chain;
      expect(submit2ChainFn).toHaveBeenCalledWith(
        freezeData,
        expect.objectContaining({
          notificationSentryName: 'error:submit:batchfreezeinvestors',
          chainFunction: expect.any(Function),
          transaction: {
            type: { name: 'FREEZEINVESTOR', overall: true },
            accounts: ['k:investor1', 'k:investor2', 'k:skeletor'],
          },
        }),
      );

      expect(response).toEqual(mockTransaction);
    });

    it('should call batchSetAddressFrozen with the correct parameters when chainFunction is executed', async () => {
      // Import the necessary modules
      const { batchSetAddressFrozen } = await import(
        '@/services/batchSetAddressFrozen'
      );

      // Setup mock for submit2Chain that calls the chainFunction with account and asset
      const mockSubmit2Chain = vi.fn().mockImplementation((data, options) => {
        const { chainFunction } = options;
        const mockAccount = { address: 'k:he-man' };
        const mockAsset = {
          uuid: 'test-asset',
          contractName: 'test',
          namespace: 'ns',
        };

        return chainFunction(mockAccount, mockAsset).then(() => {
          return {
            id: 'tx-123',
            requestKey: 'req-123',
            type: 'FREEZEINVESTOR',
          };
        });
      });

      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: mockSubmit2Chain,
      });

      const { result } = renderHook(() => useBatchFreezeInvestors());

      // Test data
      const freezeData = {
        investorAccounts: ['k:investor1', 'k:investor2'],
        pause: true,
        message: 'Freezing for testing',
      };

      // Execute
      await result.current.submit(freezeData);

      // Assert
      expect(batchSetAddressFrozen).toHaveBeenCalledWith(
        freezeData,
        { address: 'k:he-man' },
        { uuid: 'test-asset', contractName: 'test', namespace: 'ns' },
      );
    });

    it('should call store.setFrozenMessages with the correct parameters', async () => {
      // Setup
      const mockSubmit2Chain = vi.fn().mockImplementation((data, options) => {
        const { chainFunction } = options;
        const mockAccount = { address: 'k:he-man' };
        const mockAsset = {
          uuid: 'test-asset',
          contractName: 'test',
          namespace: 'ns',
        };

        return chainFunction(mockAccount, mockAsset).then(() => {
          return {
            id: 'tx-123',
            requestKey: 'req-123',
            type: 'FREEZEINVESTOR',
          };
        });
      });

      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: mockSubmit2Chain,
      });

      // Test data
      const freezeData = {
        investorAccounts: ['k:investor1', 'k:investor2'],
        pause: true,
        message: 'Freezing for testing',
      };

      const { result } = renderHook(() => useBatchFreezeInvestors());

      // Execute
      await result.current.submit(freezeData);

      // Assert
      expect(mocksHook.mockStore.setFrozenMessages).toHaveBeenCalledWith(
        freezeData,
        {
          address: 'k:1',
          name: 'Test User',
          email: 'heman@mastersoftheuniverse.com',
        },
        { uuid: 'test-asset', contractName: 'test', namespace: 'ns' },
      );
    });

    it('should return the transaction data from submit2Chain', async () => {
      // Setup
      const mockTransaction = {
        id: 'tx-123',
        requestKey: 'req-123',
        type: 'FREEZEINVESTOR',
        hash: 'hash-123',
      };

      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: vi.fn().mockResolvedValue(mockTransaction),
      });

      const { result } = renderHook(() => useBatchFreezeInvestors());

      // Test data
      const freezeData = {
        investorAccounts: ['k:investor1'],
        pause: true,
      };

      // Execute
      const response = await result.current.submit(freezeData);

      // Assert
      expect(response).toEqual(mockTransaction);
    });

    it('should return undefined when user is not available', async () => {
      // Mock user as undefined
      mocksHook.useUser.mockReturnValue({
        user: undefined,
      });

      const mockSubmit2Chain = vi.fn().mockImplementation((data, options) => {
        const { chainFunction } = options;
        const mockAccount = { address: 'k:he-man' };
        const mockAsset = {
          uuid: 'test-asset',
          contractName: 'test',
          namespace: 'ns',
        };

        return chainFunction(mockAccount, mockAsset);
      });

      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: mockSubmit2Chain,
      });

      const { result } = renderHook(() => useBatchFreezeInvestors());

      // Test data
      const freezeData = {
        investorAccounts: ['k:investor1', 'k:investor2'],
        pause: true,
      };

      // Execute
      const response = await result.current.submit(freezeData);

      // Assert
      expect(response).toBeUndefined();
    });
  });
});
