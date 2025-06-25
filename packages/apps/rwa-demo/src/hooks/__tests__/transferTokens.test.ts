import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { renderHook } from '@testing-library/react-hooks';
import { useTransferTokens } from '../transferTokens';

describe('transferTokens hook', () => {
  const mocksHook = vi.hoisted(() => {
    return {
      useAccount: vi.fn().mockReturnValue({
        account: {},
        sign: vi.fn(),
        isMounted: true,
        isInvestor: true,
      }),
      useFreeze: vi.fn().mockReturnValue({
        frozen: true,
      }),
      useAsset: vi.fn().mockReturnValue({
        paused: true,
      }),
      useTransactions: vi.fn().mockReturnValue({
        addTransaction: vi.fn(),
      }),
      useNotifications: vi.fn().mockReturnValue({
        addNotification: vi.fn(),
      }),
      mockGetClient: vi.fn(),
      mockTransferTokens: vi.fn(),
      mockSubmit2Chain: vi.fn(),
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

    vi.mock('@/hooks/notifications', async () => {
      const actual = await vi.importActual('@/hooks/notifications');
      return {
        ...actual,
        useNotifications: mocksHook.useNotifications,
      };
    });

    vi.mock('@/utils/client', async () => {
      const actual = await vi.importActual('@/utils/client');
      return {
        ...actual,
        getClient: mocksHook.mockGetClient,
      };
    });

    vi.mock('@/services/transferTokens', async () => {
      const actual = await vi.importActual('@/services/transferTokens');
      return {
        ...actual,
        transferTokens: mocksHook.mockTransferTokens,
      };
    });

    vi.mock('./../useSubmit2Chain', async () => {
      const actual = await vi.importActual('./../useSubmit2Chain');
      return {
        ...actual,
        useSubmit2Chain: () => ({
          submit2Chain: mocksHook.mockSubmit2Chain,
        }),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct properties', async () => {
    const { result } = renderHook(() => useTransferTokens());
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true, when the contract is active, when account is investor, when account is not frozen, when account is mounted', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        ...mocksHook.useAccount.getMockImplementation(),
        isMounted: true,
        isInvestor: true,
      }));

      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: false,
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));

      const { result } = renderHook(() => useTransferTokens());

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return false when the account is not Mounted', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        ...mocksHook.useAccount.getMockImplementation(),
        isMounted: false,
      }));

      const { result } = renderHook(() => useTransferTokens());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when the contract is paused', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        ...mocksHook.useAccount.getMockImplementation(),
        isMounted: true,
        isInvestor: true,
      }));

      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: false,
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: true,
      }));

      const { result } = renderHook(() => useTransferTokens());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when the account is not an investor', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        ...mocksHook.useAccount.getMockImplementation(),
        isMounted: true,
        isInvestor: false,
      }));

      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: false,
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));

      const { result } = renderHook(() => useTransferTokens());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when the account is frozen', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        ...mocksHook.useAccount.getMockImplementation(),
        isMounted: true,
        isInvestor: true,
      }));

      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: true,
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));

      const { result } = renderHook(() => useTransferTokens());

      expect(result.current.isAllowed).toBe(false);
    });
  });

  describe('submit', () => {
    it('should call submit2Chain with the correct parameters', async () => {
      mocksHook.mockSubmit2Chain.mockResolvedValue({
        requestKey: 'test-request-key',
      });

      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:investor-address',
        },
        isMounted: true,
        isInvestor: true,
      }));

      const { result } = renderHook(() => useTransferTokens());

      const data = {
        amount: 100,
        investorToAccount: 'k:recipient-address',
      };

      await result.current.submit(data);

      expect(mocksHook.mockSubmit2Chain).toHaveBeenCalledWith(data, {
        notificationSentryName: 'error:submit:transfertokens',
        chainFunction: expect.any(Function),
        transaction: {
          type: TXTYPES.TRANSFERTOKENS,
          accounts: ['k:investor-address', 'k:recipient-address'],
        },
      });
    });

    it('should use custom investorFromAccount when provided', async () => {
      mocksHook.mockSubmit2Chain.mockResolvedValue({
        requestKey: 'test-request-key',
      });

      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:investor-address',
        },
        isMounted: true,
        isInvestor: true,
      }));

      const { result } = renderHook(() => useTransferTokens());

      const data = {
        amount: 100,
        investorFromAccount: 'k:custom-from-address',
        investorToAccount: 'k:recipient-address',
      };

      await result.current.submit(data);

      expect(mocksHook.mockSubmit2Chain).toHaveBeenCalledWith(data, {
        notificationSentryName: 'error:submit:transfertokens',
        chainFunction: expect.any(Function),
        transaction: {
          type: TXTYPES.TRANSFERTOKENS,
          accounts: ['k:custom-from-address', 'k:recipient-address'],
        },
      });
    });

    it('should call transferTokens service with the correct parameters', async () => {
      mocksHook.mockTransferTokens.mockResolvedValue({
        cmd: 'test-unsigned-command',
      });

      mocksHook.mockSubmit2Chain.mockResolvedValue({
        requestKey: 'test-request-key',
      });

      const mockAccount = {
        address: 'k:investor-address',
      };

      mocksHook.useAccount.mockImplementation(() => ({
        account: mockAccount,
        isMounted: true,
        isInvestor: true,
      }));

      const mockAsset = {
        id: 'asset-123',
        name: 'Test Asset',
      };

      mocksHook.useAsset.mockImplementation(() => ({
        asset: mockAsset,
        paused: false,
      }));

      const { result } = renderHook(() => useTransferTokens());

      const data = {
        amount: 100,
        investorToAccount: 'k:recipient-address',
      };

      await result.current.submit(data);

      // Extract the chainFunction from the submit2Chain call
      const chainFunction =
        mocksHook.mockSubmit2Chain.mock.calls[0][1].chainFunction;

      // Call the chainFunction directly to test if it calls transferTokens correctly
      await chainFunction(mockAccount, mockAsset);

      expect(mocksHook.mockTransferTokens).toHaveBeenCalledWith(
        data,
        mockAccount,
        mockAsset,
      );
    });

    it('should return the result from submit2Chain', async () => {
      const expectedResult = {
        requestKey: 'test-request-key',
        hash: 'test-hash',
      };

      mocksHook.mockSubmit2Chain.mockResolvedValue(expectedResult);

      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:investor-address',
        },
        isMounted: true,
        isInvestor: true,
      }));

      const { result } = renderHook(() => useTransferTokens());

      const data = {
        amount: 100,
        investorToAccount: 'k:recipient-address',
      };

      const response = await result.current.submit(data);

      expect(response).toEqual(expectedResult);
    });
  });
});
