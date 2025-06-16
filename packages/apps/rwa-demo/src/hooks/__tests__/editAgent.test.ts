import { renderHook } from '@testing-library/react-hooks';
import { useEditAgent } from '../editAgent';

describe('editAgent hook', () => {
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
          address: 'k:1',
        },
        sign: vi.fn(),
        isMounted: true,
        isOwner: false,
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
    const { result } = renderHook(() => useEditAgent());
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true, when account is mounted, when contract is NOT paused, when account has role ADMIN, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isOwner: false,
        isMounted: true,
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

      const { result } = renderHook(() => useEditAgent());

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return true, when account is mounted, when contract is NOT paused, when account is Owner, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isOwner: true,
        isMounted: true,
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

      const { result } = renderHook(() => useEditAgent());

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return false, when account is NOT mounted, when contract is NOT paused, when account has role ADMIN, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isOwner: false,
        isMounted: false,
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

      const { result } = renderHook(() => useEditAgent());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is paused, when account has role ADMIN, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isOwner: false,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
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

      const { result } = renderHook(() => useEditAgent());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is NOT paused, when account has NO role ADMIN and is NOT owner, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isOwner: false,
        isMounted: true,
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

      const { result } = renderHook(() => useEditAgent());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is paused, when account has role ADMIN, when IS activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isOwner: false,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: true,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: true,
      }));

      const { result } = renderHook(() => useEditAgent());

      expect(result.current.isAllowed).toBe(false);
    });
  });
});
