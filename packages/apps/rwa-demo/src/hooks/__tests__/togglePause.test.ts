import { renderHook } from '@testing-library/react-hooks';
import { useTogglePause } from '../togglePause';

describe('togglePause hook', () => {
  const mocksHook = vi.hoisted(() => {
    return {
      mockTogglePause: vi.fn().mockResolvedValue({
        cmd: 'test-unsigned-command',
      }),
      mockGetClient: vi.fn().mockReturnValue({
        submit: vi.fn().mockResolvedValue({
          requestKey: 'test-request-key',
          hash: 'test-hash',
        }),
      }),
      useAsset: vi.fn().mockReturnValue({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
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
    };
  });

  beforeEach(async () => {
    // Reset all mocks before each test
    mocksHook.useAsset.mockReset().mockReturnValue({
      asset: {
        id: 'asset-123',
        name: 'Test Asset',
      },
    });

    mocksHook.useAccount.mockReset().mockReturnValue({
      account: {
        address: 'k:1',
      },
      sign: vi.fn(),
      isMounted: true,
      accountRoles: {
        isFreezer: vi.fn().mockReturnValue(false),
      },
    });

    mocksHook.useTransactions.mockReset().mockReturnValue({
      addTransaction: vi.fn(),
      isActiveAccountChangeTx: false,
    });

    mocksHook.useNotifications.mockReset().mockReturnValue({
      addNotification: vi.fn(),
    });

    mocksHook.mockTogglePause.mockReset().mockResolvedValue({
      cmd: 'test-unsigned-command',
    });

    mocksHook.mockGetClient.mockReset().mockReturnValue({
      submit: vi.fn().mockResolvedValue({
        requestKey: 'test-request-key',
        hash: 'test-hash',
      }),
    });

    vi.mock('./../asset', async () => {
      const actual = await vi.importActual('./../asset');
      return {
        ...actual,
        useAsset: mocksHook.useAsset,
      };
    });

    vi.mock('./../account', async () => {
      const actual = await vi.importActual('./../account');
      return {
        ...actual,
        useAccount: mocksHook.useAccount,
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

    vi.mock('@/services/togglePause', async () => {
      return {
        togglePause: mocksHook.mockTogglePause,
      };
    });

    vi.mock('@/utils/client', async () => {
      return {
        getClient: mocksHook.mockGetClient,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should return the correct properties', async () => {
    const { result } = renderHook(() => useTogglePause());
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true, when account is mounted, when account has role FREEZER, when no activeAccountTx busy', () => {
      // Setup specific mocks for this test
      const isFreezerMock = vi.fn().mockReturnValue(true);

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:1',
        },
        isMounted: true,
        accountRoles: {
          isFreezer: isFreezerMock,
        },
      });

      mocksHook.useTransactions.mockReturnValue({
        addTransaction: vi.fn(),
        isActiveAccountChangeTx: false,
      });

      const { result } = renderHook(() => useTogglePause());

      expect(result.current.isAllowed).toBe(true);
      expect(isFreezerMock).toHaveBeenCalled();
    });

    it('should return false, when account is NOT mounted', () => {
      // Setup specific mocks for this test
      const isFreezerMock = vi.fn().mockReturnValue(true);

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:1',
        },
        isMounted: false,
        accountRoles: {
          isFreezer: isFreezerMock,
        },
      });

      mocksHook.useTransactions.mockReturnValue({
        addTransaction: vi.fn(),
        isActiveAccountChangeTx: false,
      });

      const { result } = renderHook(() => useTogglePause());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when account has role FREEZER, when activeAccountTx busy', () => {
      // Setup specific mocks for this test
      const isFreezerMock = vi.fn().mockReturnValue(true);

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:1',
        },
        isMounted: true,
        accountRoles: {
          isFreezer: isFreezerMock,
        },
      });

      mocksHook.useTransactions.mockReturnValue({
        addTransaction: vi.fn(),
        isActiveAccountChangeTx: true,
      });

      const { result } = renderHook(() => useTogglePause());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when account does NOT have role FREEZER, when activeAccountTx is NOT busy', () => {
      // Setup specific mocks for this test
      const isFreezerMock = vi.fn().mockReturnValue(false);

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:1',
        },
        isMounted: true,
        accountRoles: {
          isFreezer: isFreezerMock,
        },
      });

      mocksHook.useTransactions.mockReturnValue({
        addTransaction: vi.fn(),
        isActiveAccountChangeTx: false,
      });

      const { result } = renderHook(() => useTogglePause());

      expect(result.current.isAllowed).toBe(false);
      expect(isFreezerMock).toHaveBeenCalled();
    });
  });

  describe('submit', () => {
    it('should call togglePause with the correct parameters', async () => {
      const signMock = vi.fn().mockResolvedValue({
        cmd: 'test-signed-command',
      });

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:freezer-address',
        },
        isMounted: true,
        sign: signMock,
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      });

      const { result } = renderHook(() => useTogglePause());

      const data = { isPaused: true };
      await result.current.submit(data);

      expect(mocksHook.mockTogglePause).toHaveBeenCalledWith(
        data,
        { address: 'k:freezer-address' },
        mocksHook.useAsset().asset,
      );
    });

    it('should sign the transaction and submit it to the client', async () => {
      const signMock = vi.fn().mockResolvedValue({
        cmd: 'test-signed-command',
      });

      const addTransactionMock = vi.fn();

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:freezer-address',
        },
        isMounted: true,
        sign: signMock,
        accountRoles: {
          isFreezer: vi.fn().mockReturnValue(true),
        },
      });

      mocksHook.useTransactions.mockReturnValue({
        addTransaction: addTransactionMock,
        isActiveAccountChangeTx: false,
      });

      const { result } = renderHook(() => useTogglePause());

      const data = { isPaused: true };
      await result.current.submit(data);

      expect(addTransactionMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: { name: 'PAUSECONTRACT', overall: true },
          accounts: ['k:freezer-address'],
        }),
      );
    });

    it('should add a notification and return early when asset is not found', async () => {
      const addNotificationMock = vi.fn();

      // Specifically set the asset to undefined for this test
      mocksHook.useAsset.mockReturnValue({
        asset: undefined,
      });

      mocksHook.useNotifications.mockReturnValue({
        addNotification: addNotificationMock,
      });

      const { result } = renderHook(() => useTogglePause());

      const data = { isPaused: true };
      await result.current.submit(data);

      expect(addNotificationMock).toHaveBeenCalledWith(
        {
          intent: 'negative',
          label: 'asset not found',
          message: '',
        },
        {
          name: 'error:submit:togglepause',
          options: {
            message: 'asset not found',
            sentryData: {
              type: 'submit_chain',
            },
          },
        },
      );
      expect(mocksHook.mockTogglePause).not.toHaveBeenCalled();
    });

    it('should handle errors and add notification', async () => {
      const addNotificationMock = vi.fn();

      mocksHook.useNotifications.mockReturnValue({
        addNotification: addNotificationMock,
      });

      // Specifically set togglePause to throw an error for this test
      mocksHook.mockTogglePause.mockRejectedValue(new Error('Test error'));

      const { result } = renderHook(() => useTogglePause());

      const data = { isPaused: true };
      await result.current.submit(data);

      expect(addNotificationMock).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'there was an error',
          message: 'Test error',
        }),
        expect.objectContaining({
          name: 'error:submit:togglepause',
        }),
      );
    });
  });
});
