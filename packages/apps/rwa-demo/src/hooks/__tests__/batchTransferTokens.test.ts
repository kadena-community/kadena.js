import { renderHook } from '@testing-library/react-hooks';
import { useBatchTransferTokens } from '../batchTransferTokens';

describe('batchTransferTokens hook', () => {
  const mockinitFetchInvestors = vi.hoisted(() => vi.fn());
  const mocksHook = vi.hoisted(() => {
    return {
      mockinitFetchInvestors,
      useAsset: vi.fn().mockReturnValue({
        paused: true,
        initFetchInvestors: mockinitFetchInvestors,
        investors: [
          { accountName: 'k:he-man', alias: 'he-man' },
          { accountName: 'k:skeletor', alias: 'skeletor' },
        ],
      }),
      useGetInvestorBalance: vi.fn().mockReturnValue({
        data: 0,
      }),
      useFreeze: vi.fn().mockReturnValue({
        frozen: false,
      }),
      useAccount: vi.fn().mockReturnValue({
        account: {
          address: 'k:he-man',
        },
        sign: vi.fn(),
        isMounted: true,
        isInvestor: true,
        balance: 0,
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
    vi.mock('./../getInvestorBalance', async () => {
      const actual = await vi.importActual('./../getInvestorBalance');
      return {
        ...actual,
        useGetInvestorBalance: mocksHook.useGetInvestorBalance,
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
    const { result } = renderHook(() => useBatchTransferTokens());
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true, when account is Mounted when contract is NOT paused,when account is not frozen, when account isInvestor', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        ...mocksHook.useAccount.getMockImplementation(),
        isMounted: true,
        isInvestor: true,
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        initFetchInvestors: mockinitFetchInvestors,
        paused: false,
      }));

      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: false,
      }));

      const { result } = renderHook(() => useBatchTransferTokens());

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return false, when account is NOT Mounted when contract is NOT paused,when account is not frozen, when account isInvestor', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        ...mocksHook.useAccount.getMockImplementation(),
        isMounted: false,
        isInvestor: true,
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        initFetchInvestors: mockinitFetchInvestors,
        paused: false,
      }));

      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: false,
      }));

      const { result } = renderHook(() => useBatchTransferTokens());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is Mounted when contract is paused,when account is not frozen, when account isInvestor', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        ...mocksHook.useAccount.getMockImplementation(),
        isMounted: true,
        isInvestor: true,
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        initFetchInvestors: mockinitFetchInvestors,
        paused: true,
      }));

      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: false,
      }));

      const { result } = renderHook(() => useBatchTransferTokens());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is Mounted when contract is NOT paused,when account is frozen, when account isInvestor', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        ...mocksHook.useAccount.getMockImplementation(),
        isMounted: true,
        isInvestor: true,
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        initFetchInvestors: mockinitFetchInvestors,
        paused: false,
      }));

      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: true,
      }));

      const { result } = renderHook(() => useBatchTransferTokens());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is Mounted when contract is NOT paused,when account is NOT frozen, when account NOT isInvestor', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        ...mocksHook.useAccount.getMockImplementation(),
        isMounted: true,
        isInvestor: false,
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        initFetchInvestors: mockinitFetchInvestors,
        paused: false,
      }));

      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: false,
      }));

      const { result } = renderHook(() => useBatchTransferTokens());

      expect(result.current.isAllowed).toBe(false);
    });
  });
});
