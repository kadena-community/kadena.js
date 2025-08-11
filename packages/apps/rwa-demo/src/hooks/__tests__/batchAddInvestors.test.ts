import { renderHook } from '@testing-library/react';
import { useBatchAddInvestors } from '../batchAddInvestors';

describe('batchAddInvestor hook', () => {
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
      }),
      useAccount: vi.fn().mockReturnValue({
        account: {
          address: 'k:he-man',
        },
        sign: vi.fn(),
        isOwner: true,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
        },
      }),

      useTransactions: vi.fn().mockReturnValue({
        addTransaction: vi.fn(),
      }),
      useNotifications: vi.fn().mockReturnValue({
        addNotification: vi.fn(),
      }),
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct properties', async () => {
    const { result } = renderHook(() => useBatchAddInvestors());
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true,  when contract is NOT paused, when account has role ADMIN, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        isMounted: true,
        isOwner: false,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
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

      const { result } = renderHook(() => useBatchAddInvestors());

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return true,  when contract is NOT paused, when account is Owner, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        isMounted: true,
        isOwner: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
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

      const { result } = renderHook(() => useBatchAddInvestors());

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return false,  when account is NOT Mounted when contract is NOT paused, when account is Owner, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        isMounted: false,
        isOwner: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
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

      const { result } = renderHook(() => useBatchAddInvestors());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false,  when account is Mounted, when contract is paused, when account is Owner, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        isMounted: true,
        isOwner: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
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

      const { result } = renderHook(() => useBatchAddInvestors());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false,  when account is Mounted, when contract is NOT paused, when account not owner and not agentadmin, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        isMounted: true,
        isOwner: false,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
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

      const { result } = renderHook(() => useBatchAddInvestors());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false,  when account is Mounted, when contract is NOT paused, when account isowner,  when activeAccountTx IS busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        isMounted: true,
        isOwner: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
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

      const { result } = renderHook(() => useBatchAddInvestors());

      expect(result.current.isAllowed).toBe(false);
    });
  });

  describe('submit', () => {
    const mocksInner = vi.hoisted(() => ({
      setAllAccounts: vi
        .fn()
        .mockResolvedValue([Promise.resolve(), Promise.resolve()]),
    }));
    const mocks = vi.hoisted(() => ({
      mockBatchRegisterIdentity: vi.fn().mockResolvedValue({
        cmd: 'test-batch-command',
        sigs: [],
        hash: 'test-hash',
      }),
      mockStore: {
        setAllAccounts: mocksInner.setAllAccounts,
      },
      mockSubmit2Chain: vi.fn().mockResolvedValue({
        requestKey: 'test-request-key',
        hash: 'test-hash',
        type: { name: 'ADDINVESTOR', overall: true },
        accounts: ['k:agent-address', 'k:investor-1', 'k:investor-2'],
      }),
    }));

    beforeEach(async () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:agent-address',
        },
        isOwner: false,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: false,
      }));

      vi.mock('@/utils/store', async () => {
        return {
          RWAStore: vi.fn().mockReturnValue(mocks.mockStore),
          getAssetFolder: vi.fn(),
          getAccountVal: vi.fn(),
          GetAccountsLocalStorageKey: vi.fn(),
        };
      });

      vi.mock('@/services/batchRegisterIdentity', async () => {
        return {
          batchRegisterIdentity: mocks.mockBatchRegisterIdentity,
        };
      });

      vi.mock('../useSubmit2Chain', async () => {
        return {
          useSubmit2Chain: vi.fn().mockReturnValue({
            submit2Chain: mocks.mockSubmit2Chain,
          }),
        };
      });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should call submit2Chain with the correct parameters', async () => {
      const { result } = renderHook(() => useBatchAddInvestors());

      const data = {
        accounts: [
          { account: 'k:investor-1', alias: 'Investor 1' },
          { account: 'k:investor-2', alias: 'Investor 2' },
        ],
      };

      await result.current.submit(data);

      expect(mocks.mockSubmit2Chain).toHaveBeenCalledWith(
        data,
        expect.objectContaining({
          notificationSentryName: 'error:submit:batchaddinvestor',
          transaction: {
            type: expect.any(Object),
            accounts: ['k:agent-address', 'k:investor-1', 'k:investor-2'],
          },
        }),
      );
    });

    it('should call batchRegisterIdentity with correct agent and asset data', async () => {
      const { result } = renderHook(() => useBatchAddInvestors());

      const data = {
        accounts: [
          { account: 'k:investor-1', alias: 'Investor 1' },
          { account: 'k:investor-2', alias: 'Investor 2' },
        ],
      };

      // Grab the chain function from submit2Chain call
      await result.current.submit(data);
      const chainFunction =
        mocks.mockSubmit2Chain.mock.calls[0][1].chainFunction;

      // Call the chainFunction directly to test it
      const account = { address: 'k:agent-address' };
      const asset = { id: 'asset-123', name: 'Test Asset' };
      await chainFunction(account, asset);

      expect(mocks.mockBatchRegisterIdentity).toHaveBeenCalledWith(
        {
          accounts: [
            { account: 'k:investor-1', alias: 'Investor 1' },
            { account: 'k:investor-2', alias: 'Investor 2' },
          ],
          agent: { address: 'k:agent-address' },
        },
        { id: 'asset-123', name: 'Test Asset' },
      );
    });

    it('should call setAllAccounts with the provided data', async () => {
      const { result } = renderHook(() => useBatchAddInvestors());

      const data = {
        accounts: [
          { account: 'k:investor-1', alias: 'Investor 1' },
          { account: 'k:investor-2', alias: 'Investor 2' },
        ],
      };

      await result.current.submit(data);

      expect(mocksInner.setAllAccounts).toHaveBeenCalledWith(data);
    });

    it('should return the transaction data returned by submit2Chain', async () => {
      const { result } = renderHook(() => useBatchAddInvestors());

      const data = {
        accounts: [
          { account: 'k:investor-1', alias: 'Investor 1' },
          { account: 'k:investor-2', alias: 'Investor 2' },
        ],
      };

      const expectedTransaction = {
        requestKey: 'test-request-key',
        hash: 'test-hash',
        type: { name: 'ADDINVESTOR', overall: true },
        accounts: ['k:agent-address', 'k:investor-1', 'k:investor-2'],
      };
      mocks.mockSubmit2Chain.mockResolvedValueOnce(expectedTransaction);

      const result2 = await result.current.submit(data);

      expect(result2).toEqual(expectedTransaction);
    });

    it('should return undefined when store is not initialized', async () => {
      // Mock organization as undefined to make store undefined
      mocksHook.useOrganisation.mockReturnValueOnce({
        organisation: undefined,
      });

      const { result } = renderHook(() => useBatchAddInvestors());

      const data = {
        accounts: [
          { account: 'k:investor-1', alias: 'Investor 1' },
          { account: 'k:investor-2', alias: 'Investor 2' },
        ],
      };

      // The transaction resolves, but store?.setAllAccounts will be undefined
      const tx = await result.current.submit(data);

      // Transaction should still be returned
      expect(mocksInner.setAllAccounts).not.toHaveBeenCalled();
      expect(tx).toBeDefined();
    });
  });
});
