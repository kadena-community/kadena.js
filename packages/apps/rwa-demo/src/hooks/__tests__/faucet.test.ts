import { renderHook } from '@testing-library/react-hooks';
import { useFaucet } from '../faucet';

describe('faucet hook', () => {
  const mocksHook = vi.hoisted(() => {
    return {
      useAccount: vi.fn().mockReturnValue({
        account: {
          address: 'k:1',
        },
        sign: vi.fn(),
        isMounted: true,
        isGasPayable: true,
      }),
      useNetwork: vi.fn().mockReturnValue({
        activeNetwork: {
          networkId: 'development',
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

    vi.mock('./../networks', async () => {
      const actual = await vi.importActual('./../networks');

      return {
        ...actual,
        useNetwork: mocksHook.useNetwork,
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
    const { result } = renderHook(() => useFaucet());
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true, when account is mounted, when gas is NOT payable, when network is development', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isMounted: true,
        isGasPayable: false,
      }));

      mocksHook.useNetwork.mockImplementation(() => ({
        ...mocksHook.useNetwork.getMockImplementation(),
        activeNetwork: { networkId: 'development' },
      }));

      const { result } = renderHook(() => useFaucet());

      expect(result.current.isAllowed).toBe(true);
    });
  });

  it('should return false, when account is NOT mounted, when gas is NOT payable, when network is development', () => {
    mocksHook.useAccount.mockImplementation(() => ({
      account: {
        address: 'k:he-man',
      },
      isMounted: false,
      isGasPayable: false,
    }));

    mocksHook.useNetwork.mockImplementation(() => ({
      ...mocksHook.useNetwork.getMockImplementation(),
      activeNetwork: { networkId: 'development' },
    }));

    const { result } = renderHook(() => useFaucet());

    expect(result.current.isAllowed).toBe(false);
  });

  it('should return false, when account is mounted, when gas is payable, when network is development', () => {
    mocksHook.useAccount.mockImplementation(() => ({
      account: {
        address: 'k:he-man',
      },
      isMounted: true,
      isGasPayable: true,
    }));

    mocksHook.useNetwork.mockImplementation(() => ({
      ...mocksHook.useNetwork.getMockImplementation(),
      activeNetwork: { networkId: 'development' },
    }));

    const { result } = renderHook(() => useFaucet());

    expect(result.current.isAllowed).toBe(false);
  });

  it('should return false, when account is mounted, when gas is NOT payable, when network is mainnet', () => {
    mocksHook.useAccount.mockImplementation(() => ({
      account: {
        address: 'k:he-man',
      },
      isMounted: false,
      isGasPayable: false,
    }));

    mocksHook.useNetwork.mockImplementation(() => ({
      ...mocksHook.useNetwork.getMockImplementation(),
      activeNetwork: { networkId: 'mainnet01' },
    }));

    const { result } = renderHook(() => useFaucet());

    expect(result.current.isAllowed).toBe(false);
  });
});
