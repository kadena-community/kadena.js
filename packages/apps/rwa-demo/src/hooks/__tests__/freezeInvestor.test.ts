import { renderHook } from '@testing-library/react';
import { useFreezeInvestor } from '../freezeInvestor';

describe('freezeInvestor hook', () => {
  const mocksHook = vi.hoisted(() => {
    return {
      mockStore: {
        setFrozenMessage: vi.fn().mockResolvedValue(undefined),
      },
      mockSetAddressFrozen: vi.fn().mockResolvedValue({
        cmd: 'test-unsigned-command',
      }),
      mockGetClient: vi.fn().mockReturnValue({
        submit: vi.fn().mockResolvedValue({
          requestKey: 'test-request-key',
          hash: 'test-hash',
        }),
      }),
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
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: true,
      }),
      useAccount: vi.fn().mockReturnValue({
        account: {
          address: 'k:1',
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
        submit2Chain: vi.fn().mockImplementation((data, options) => {
          return options
            .chainFunction(
              {
                address: 'k:freezer',
              },
              { id: 'asset-123', name: 'Test Asset' },
            )
            .then(() => ({
              requestKey: 'test-request-key',
              hash: 'test-hash',
            }));
        }),
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

    vi.mock('./../useSubmit2Chain', async () => {
      const actual = await vi.importActual('./../useSubmit2Chain');
      return {
        ...actual,
        useSubmit2Chain: mocksHook.useSubmit2Chain,
      };
    });

    vi.mock('@/services/setAddressFrozen', async () => {
      return {
        setAddressFrozen: mocksHook.mockSetAddressFrozen,
      };
    });

    vi.mock('@/utils/client', async () => {
      return {
        getClient: mocksHook.mockGetClient,
      };
    });

    vi.mock('@/utils/store', async () => {
      return {
        RWAStore: vi.fn().mockReturnValue(mocksHook.mockStore),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct properties', async () => {
    const { result } = renderHook(() => useFreezeInvestor());
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true, when account is mounted, when contract is NOT paused, when account is freezer, when NO activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isMounted: true,
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));

      const { result } = renderHook(() => useFreezeInvestor());

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return false, when account is NOT mounted, when contract is NOT paused, when account is freezer, when NO activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isMounted: false,
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));

      const { result } = renderHook(() => useFreezeInvestor());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is paused, when account is freezer, when NO activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isMounted: true,
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: true,
      }));

      const { result } = renderHook(() => useFreezeInvestor());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is NOT paused, when account is NOT freezer, when NO activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isMounted: true,
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(false),
        },
      }));

      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));

      const { result } = renderHook(() => useFreezeInvestor());

      expect(result.current.isAllowed).toBe(false);
    });
    it('should return false, when account is mounted, when contract is NOT paused, when account is  freezer, when IS activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isMounted: true,
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: true,
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));

      const { result } = renderHook(() => useFreezeInvestor());

      expect(result.current.isAllowed).toBe(false);
    });
  });

  describe('submit', () => {
    it('should call setAddressFrozen with the correct parameters', async () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isMounted: true,
        sign: vi.fn().mockResolvedValue({ cmd: 'test-signed-command' }),
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useUser.mockReturnValue({
        user: {
          address: 'k:1',
          name: 'Test User',
        },
      });

      mocksHook.useAsset.mockImplementation(() => ({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: false,
      }));

      const { result } = renderHook(() => useFreezeInvestor());

      const data = {
        investorAccount: 'k:investor-account',
        pause: true,
        message: 'Regulatory compliance freeze',
      };

      await result.current.submit(data);

      expect(mocksHook.mockSetAddressFrozen).toHaveBeenCalledWith(
        data,
        { address: 'k:freezer' },
        { id: 'asset-123', name: 'Test Asset' },
      );
    });

    it('should call store.setFrozenMessage with the correct parameters', async () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:freezer',
        },
        isMounted: true,
        sign: vi.fn().mockResolvedValue({ cmd: 'test-signed-command' }),
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useUser.mockImplementation(() => ({
        user: {
          address: 'k:1',
          name: 'Test User',
          email: 'heman@mastersoftheuniverse.com',
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: false,
      }));

      const { result } = renderHook(() => useFreezeInvestor());

      const data = {
        investorAccount: 'k:investor-account',
        pause: true,
        message: 'Regulatory compliance freeze',
      };

      await result.current.submit(data);

      expect(mocksHook.mockStore.setFrozenMessage).toHaveBeenCalledWith(
        data,
        {
          address: 'k:1',
          name: 'Test User',
          email: 'heman@mastersoftheuniverse.com',
        },
        { id: 'asset-123', name: 'Test Asset' },
      );
    });

    it('should call submit2Chain with the correct parameters', async () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:freezer',
        },
        isMounted: true,
        sign: vi.fn().mockResolvedValue({ cmd: 'test-signed-command' }),
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      }));

      const submit2ChainMock = vi.fn().mockResolvedValue({
        requestKey: 'test-request-key',
        hash: 'test-hash',
      });
      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: submit2ChainMock,
      });

      const { result } = renderHook(() => useFreezeInvestor());

      const data = {
        investorAccount: 'k:investor-account',
        pause: true,
        message: 'Regulatory compliance freeze',
      };

      await result.current.submit(data);

      expect(submit2ChainMock).toHaveBeenCalledWith(
        data,
        expect.objectContaining({
          notificationSentryName: 'error:submit:freezeinvestor',
          transaction: {
            type: { name: 'FREEZEINVESTOR', overall: true },
            accounts: ['k:investor-account'],
          },
        }),
      );
    });

    it('should handle successful transaction submission', async () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:freezer',
        },
        isMounted: true,
        sign: vi.fn().mockResolvedValue({ cmd: 'test-signed-command' }),
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      }));

      const submit2ChainMock = vi.fn().mockResolvedValue({
        requestKey: 'test-request-key',
        hash: 'test-hash',
      });
      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: submit2ChainMock,
      });

      const { result } = renderHook(() => useFreezeInvestor());

      const data = {
        investorAccount: 'k:investor-account',
        pause: true,
        message: 'Regulatory compliance freeze',
      };

      const response = await result.current.submit(data);

      expect(response).toEqual({
        requestKey: 'test-request-key',
        hash: 'test-hash',
      });
    });

    it('should return early if no user is found', async () => {
      mocksHook.useUser.mockReturnValue({
        user: undefined,
      });

      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:freezer',
        },
        isMounted: true,
        sign: vi.fn().mockResolvedValue({ cmd: 'test-signed-command' }),
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      }));

      const submit2ChainMock = vi.fn().mockImplementation((data, options) => {
        return options.chainFunction(
          { address: 'k:freezer' },
          { id: 'asset-123', name: 'Test Asset' },
        );
      });
      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: submit2ChainMock,
      });

      const { result } = renderHook(() => useFreezeInvestor());

      const data = {
        investorAccount: 'k:investor-account',
        pause: true,
        message: 'Regulatory compliance freeze',
      };

      await result.current.submit(data);

      expect(mocksHook.mockStore.setFrozenMessage).not.toHaveBeenCalled();
      expect(mocksHook.mockSetAddressFrozen).not.toHaveBeenCalled();
    });

    it('should return early if no organisation is found', async () => {
      mocksHook.useOrganisation.mockReturnValue({
        organisation: undefined,
      });

      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:freezer',
        },
        isMounted: true,
        sign: vi.fn().mockResolvedValue({ cmd: 'test-signed-command' }),
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      }));

      const { result } = renderHook(() => useFreezeInvestor());

      const data = {
        investorAccount: 'k:investor-account',
        pause: true,
        message: 'Regulatory compliance freeze',
      };

      await result.current.submit(data);

      // This won't be called due to the early return when organisation is undefined
      expect(mocksHook.mockStore.setFrozenMessage).not.toHaveBeenCalled();
    });
  });
});
