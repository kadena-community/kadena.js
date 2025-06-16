import { renderHook } from '@testing-library/react-hooks';
import { useDeleteInvestor } from '../deleteInvestor';

describe('deleteInvestor hook', () => {
  const mocksHook = vi.hoisted(() => {
    return {
      useGetInvestorBalance: vi.fn().mockReturnValue({
        data: 0,
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
    vi.mock('./../account', async () => {
      const actual = await vi.importActual('./../account');
      return {
        ...actual,
        useAccount: mocksHook.useAccount,
      };
    });

    vi.mock('./../getInvestorBalance', async () => {
      const actual = await vi.importActual('./../getInvestorBalance');
      return {
        ...actual,
        useGetInvestorBalance: mocksHook.useGetInvestorBalance,
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
    const { result } = renderHook(() =>
      useDeleteInvestor({ investorAccount: 'k:1' }),
    );
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
    expect(result.current.hasOwnProperty('notAllowedReason')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true, when account is mounted, when contract is NOT paused, when account has role ADMIN, when account is NOT owner, when investorbalance is empty, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isOwner: false,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));
      mocksHook.useGetInvestorBalance.mockImplementation(() => ({
        ...mocksHook.useGetInvestorBalance.getMockImplementation(),
        data: 0,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() =>
        useDeleteInvestor({ investorAccount: 'k:1' }),
      );

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return true, when account is mounted, when contract is NOT paused, when account has NOT role ADMIN, when account is owner, when investorbalance is empty, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isOwner: true,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
        },
      }));
      mocksHook.useGetInvestorBalance.mockImplementation(() => ({
        ...mocksHook.useGetInvestorBalance.getMockImplementation(),
        data: 0,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() =>
        useDeleteInvestor({ investorAccount: 'k:1' }),
      );

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return false, when account is NOT mounted, when contract is NOT paused, when account is owner, when investorbalance is empty, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isOwner: true,
        isMounted: false,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
        },
      }));
      mocksHook.useGetInvestorBalance.mockImplementation(() => ({
        ...mocksHook.useGetInvestorBalance.getMockImplementation(),
        data: 0,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() =>
        useDeleteInvestor({ investorAccount: 'k:1' }),
      );

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is  paused, when account is owner, when investorbalance is empty, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isOwner: true,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
        },
      }));
      mocksHook.useGetInvestorBalance.mockImplementation(() => ({
        ...mocksHook.useGetInvestorBalance.getMockImplementation(),
        data: 0,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: true,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() =>
        useDeleteInvestor({ investorAccount: 'k:1' }),
      );

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is NOT paused, when account is NOT owner or agentadmin, when investorbalance is empty, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isOwner: false,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
        },
      }));
      mocksHook.useGetInvestorBalance.mockImplementation(() => ({
        ...mocksHook.useGetInvestorBalance.getMockImplementation(),
        data: 0,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() =>
        useDeleteInvestor({ investorAccount: 'k:1' }),
      );

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is NOT paused, when account is  owner, when investorbalance is not empty, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isOwner: true,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
        },
      }));
      mocksHook.useGetInvestorBalance.mockImplementation(() => ({
        ...mocksHook.useGetInvestorBalance.getMockImplementation(),
        data: 1,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() =>
        useDeleteInvestor({ investorAccount: 'k:1' }),
      );

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is NOT paused, when account is  owner, when investorbalance is empty, when there IS activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isOwner: true,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
        },
      }));
      mocksHook.useGetInvestorBalance.mockImplementation(() => ({
        ...mocksHook.useGetInvestorBalance.getMockImplementation(),
        data: 0,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: true,
      }));

      const { result } = renderHook(() =>
        useDeleteInvestor({ investorAccount: 'k:1' }),
      );

      expect(result.current.isAllowed).toBe(false);
    });
  });
});
