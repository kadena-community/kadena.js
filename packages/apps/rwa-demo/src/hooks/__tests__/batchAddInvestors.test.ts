import { renderHook } from '@testing-library/react-hooks';
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
});
