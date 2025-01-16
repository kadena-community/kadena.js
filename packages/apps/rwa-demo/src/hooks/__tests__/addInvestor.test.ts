import { renderHook } from '@testing-library/react-hooks';
import { useAddInvestor } from '../addInvestor';

describe('addInvestor hook', () => {
  const mocksHook = vi.hoisted(() => {
    return {
      useFreeze: vi.fn().mockReturnValue({
        frozen: true,
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

    vi.mock('./../freeze', async () => {
      const actual = await vi.importActual('./../freeze');
      return {
        ...actual,
        useFreeze: mocksHook.useFreeze,
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

    vi.mock('@kadena/kode-ui/patterns', async () => {
      const actual = await vi.importActual('@kadena/kode-ui/patterns');
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
      useAddInvestor({ investorAccount: 'k:1' }),
    );
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true, when account is mounted, when account is NOT frozen, when contract is NOT paused, when account has role ADMIN, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:1',
        },
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));
      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: false,
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
        useAddInvestor({ investorAccount: 'k:1' }),
      );

      expect(result.current.isAllowed).toBe(true);
    });
  });

  it('should return false, when account NOT is mounted', () => {
    mocksHook.useAccount.mockImplementation(() => ({
      account: undefined,
      isMounted: false,
      accountRoles: {
        isAgentAdmin: vi.fn().mockReturnValue(true),
      },
    }));

    const { result } = renderHook(() =>
      useAddInvestor({ investorAccount: 'k:1' }),
    );

    expect(result.current.isAllowed).toBe(false);
  });

  it.only('should return false, when account is mounted, when account is frozen, when contract is NOT paused, when account has role AGENTADMIN, when no activeAccountTx busy', () => {
    mocksHook.useAccount.mockImplementation(() => ({
      account: {
        address: 'k:1',
      },
      isMounted: true,
      accountRoles: {
        isAgentAdmin: vi.fn().mockReturnValue(true),
      },
    }));
    mocksHook.useFreeze.mockImplementation(() => ({
      ...mocksHook.useFreeze.getMockImplementation(),
      frozen: true,
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
      useAddInvestor({ investorAccount: 'k:1' }),
    );

    expect(result.current.isAllowed).toBe(false);
  });

  it('should return false, when account is mounted, when account is NOT frozen, when contract is paused, when account has role AGENTADMIN, when no activeAccountTx busy', () => {
    mocksHook.useAccount.mockImplementation(() => ({
      account: {
        address: 'k:1',
      },
      isMounted: true,
      accountRoles: {
        isAgentAdmin: vi.fn().mockReturnValue(true),
      },
    }));
    mocksHook.useFreeze.mockImplementation(() => ({
      ...mocksHook.useFreeze.getMockImplementation(),
      frozen: false,
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
      useAddInvestor({ investorAccount: 'k:1' }),
    );

    expect(result.current.isAllowed).toBe(false);
  });

  it('should return false, when account is mounted, when account is NOT frozen, when contract is NOT paused, when account has NOT role AGENTADMIN, when no activeAccountTx busy', () => {
    mocksHook.useAccount.mockImplementation(() => ({
      account: {
        address: 'k:1',
      },
      isMounted: true,
      accountRoles: {
        isAgentAdmin: vi.fn().mockReturnValue(false),
      },
    }));
    mocksHook.useFreeze.mockImplementation(() => ({
      ...mocksHook.useFreeze.getMockImplementation(),
      frozen: false,
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
      useAddInvestor({ investorAccount: 'k:1' }),
    );

    expect(result.current.isAllowed).toBe(false);
  });

  it('should return false, when account is mounted, when account is NOT frozen, when contract is NOT paused, when account has role AGENTADMIN, when activeAccountTx IS busy', () => {
    mocksHook.useAccount.mockImplementation(() => ({
      account: {
        address: 'k:1',
      },
      isMounted: true,
      accountRoles: {
        isAgentAdmin: vi.fn().mockReturnValue(true),
      },
    }));
    mocksHook.useFreeze.mockImplementation(() => ({
      ...mocksHook.useFreeze.getMockImplementation(),
      frozen: false,
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
      useAddInvestor({ investorAccount: 'k:1' }),
    );

    expect(result.current.isAllowed).toBe(false);
  });
});
