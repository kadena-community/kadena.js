import { renderHook } from '@testing-library/react-hooks';
import { useCreateContract } from '../createContract';

describe('createContract hook', () => {
  const mocksHook = vi.hoisted(() => {
    return {
      useAccount: vi.fn().mockReturnValue({
        account: {
          address: 'k:he-man',
        },
        sign: vi.fn(),
        isMounted: true,
        isGasPayable: false,
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
    const { result } = renderHook(() => useCreateContract());
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true, when account is Mounted, when gasisPayable', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        ...mocksHook.useAccount.getMockImplementation(),
        isMounted: true,
        isGasPayable: true,
      }));

      const { result } = renderHook(() => useCreateContract());

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return false, when account is NOT Mounted, when gasisPayable', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        ...mocksHook.useAccount.getMockImplementation(),
        isMounted: false,
        isGasPayable: true,
      }));

      const { result } = renderHook(() => useCreateContract());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is Mounted, when NOT gasisPayable', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        ...mocksHook.useAccount.getMockImplementation(),
        isMounted: true,
        isGasPayable: false,
      }));

      const { result } = renderHook(() => useCreateContract());

      expect(result.current.isAllowed).toBe(false);
    });
  });
});
