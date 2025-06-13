import { renderHook } from '@testing-library/react-hooks';
import { useForcedTransferTokens } from '../forcedTransferTokens';

describe('forcedTransferTokens hook', () => {
  const mocksHook = vi.hoisted(() => {
    return {
      useAsset: vi.fn().mockReturnValue({
        paused: true,
      }),

      useAccount: vi.fn().mockReturnValue({
        account: {
          address: 'k:1',
        },
        sign: vi.fn(),
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
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
    const { result } = renderHook(() => useForcedTransferTokens());
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return false, when account is NOT mounted, when contract is NOT paused, when account is transfermanager', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isMounted: false,
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));

      const { result } = renderHook(() => useForcedTransferTokens());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is NOT mounted, when contract is NOT paused, when account is transfermanager', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isMounted: false,
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));

      const { result } = renderHook(() => useForcedTransferTokens());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is paused, when account is transfermanager', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isMounted: true,
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: true,
      }));

      const { result } = renderHook(() => useForcedTransferTokens());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is NOT paused, when account is NOT transfermanager', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isMounted: true,
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(false),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));

      const { result } = renderHook(() => useForcedTransferTokens());

      expect(result.current.isAllowed).toBe(false);
    });
  });
});
