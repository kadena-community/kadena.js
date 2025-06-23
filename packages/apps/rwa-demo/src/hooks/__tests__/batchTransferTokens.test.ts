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
        asset: {
          uuid: 'test-asset',
          contractName: 'test',
          namespace: 'ns',
        },
      }),
      useGetInvestorBalance: vi.fn().mockReturnValue({
        data: 100,
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
      useSubmit2Chain: vi.fn().mockReturnValue({
        submit2Chain: vi.fn(),
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

    vi.mock('./../useSubmit2Chain', async () => {
      const actual = await vi.importActual('./../useSubmit2Chain');
      return {
        ...actual,
        useSubmit2Chain: mocksHook.useSubmit2Chain,
      };
    });

    // Mock batchTransferTokens service
    vi.mock('@/services/batchTransferTokens', () => ({
      batchTransferTokens: vi
        .fn()
        .mockImplementation((data, account, asset) => {
          return {
            cmd: 'batch-transfer-tokens',
            data,
            account,
            asset,
          };
        }),
    }));
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
        investors: [{ accountName: 'k:he-man' }, { accountName: 'skeletor' }],
      }));

      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: false,
      }));

      const { result } = renderHook(() => useBatchTransferTokens());

      expect(result.current.isAllowed).toBe(false);
    });
  });

  describe('dataNotValid', () => {
    it('should return false when balance is insufficient', async () => {
      // Setup required mocks
      mocksHook.useAsset.mockReturnValue({
        paused: false,
        initFetchInvestors: mockinitFetchInvestors,
        investors: [
          { accountName: 'k:he-man', alias: 'he-man' },
          { accountName: 'k:skeletor', alias: 'skeletor' },
        ],
        asset: {
          uuid: 'test-asset',
          contractName: 'test',
          namespace: 'ns',
        },
      });

      mocksHook.useAccount.mockReturnValue({
        account: { address: 'k:he-man' },
        sign: vi.fn(),
        isMounted: true,
        isInvestor: true,
      });

      mocksHook.useFreeze.mockReturnValue({
        frozen: false,
      });

      // Set up the balance to be less than total transfer amount
      mocksHook.useGetInvestorBalance.mockReturnValue({
        data: 50,
      });

      const { result } = renderHook(() => useBatchTransferTokens());

      const transferData = [
        { to: 'k:skeletor', amount: '30' },
        { to: 'k:he-man', amount: '30' },
      ];

      const response = await result.current.submit(transferData);
      expect(response).toBeUndefined();
      expect(mocksHook.useNotifications().addNotification).toHaveBeenCalledWith(
        {
          intent: 'negative',
          label: 'the Balance on the account is to low',
          message:
            'You are trying to transfer 60 tokens and your balance is 50 tokens',
        },
      );
    });

    it('should return false when a recipient account is not whitelisted', async () => {
      // Setup required mocks
      mocksHook.useAsset.mockReturnValue({
        paused: false,
        initFetchInvestors: mockinitFetchInvestors,
        investors: [
          { accountName: 'k:he-man', alias: 'he-man' },
          { accountName: 'k:skeletor', alias: 'skeletor' },
        ],
        asset: {
          uuid: 'test-asset',
          contractName: 'test',
          namespace: 'ns',
        },
      });

      mocksHook.useAccount.mockReturnValue({
        account: { address: 'k:he-man' },
        sign: vi.fn(),
        isMounted: true,
        isInvestor: true,
      });

      mocksHook.useFreeze.mockReturnValue({
        frozen: false,
      });

      // Set up sufficient balance
      mocksHook.useGetInvestorBalance.mockReturnValue({
        data: 100,
      });

      const { result } = renderHook(() => useBatchTransferTokens());

      const transferData = [
        { to: 'k:skeletor', amount: '30' },
        { to: 'k:not-whitelisted', amount: '20' },
      ];

      const response = await result.current.submit(transferData);
      expect(response).toBeUndefined();
      expect(mocksHook.useNotifications().addNotification).toHaveBeenCalledWith(
        {
          intent: 'negative',
          label: 'Some of the accounts are not whitelisted',
          message: 'k:not-whitelisted',
        },
      );
    });

    it('should return true when all conditions are met', async () => {
      mocksHook.useAsset.mockReturnValue({
        paused: false,
        initFetchInvestors: mockinitFetchInvestors,
        investors: [
          { accountName: 'k:he-man', alias: 'he-man' },
          { accountName: 'k:skeletor', alias: 'skeletor' },
        ],
        asset: {
          uuid: 'test-asset',
          contractName: 'test',
          namespace: 'ns',
        },
      });

      mocksHook.useAccount.mockReturnValue({
        account: { address: 'k:he-man' },
        sign: vi.fn(),
        isMounted: true,
        isInvestor: true,
      });

      mocksHook.useFreeze.mockReturnValue({
        frozen: false,
      });

      mocksHook.useGetInvestorBalance.mockReturnValue({
        data: 100,
      });

      const mockSubmit2Chain = vi.fn().mockResolvedValue({
        id: 'tx-123',
        requestKey: 'req-123',
        type: 'TRANSFERTOKENS',
      });

      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: mockSubmit2Chain,
      });

      const { result } = renderHook(() => useBatchTransferTokens());

      const transferData = [
        { to: 'k:skeletor', amount: '30' },
        { to: 'k:he-man', amount: '20' },
      ];

      await result.current.submit(transferData);

      expect(mockSubmit2Chain).toHaveBeenCalled();
    });
  });

  describe('submit', () => {
    const mocksSubmit = vi.hoisted(() => ({
      mockBatchTransferTokens: vi
        .fn()
        .mockImplementation((data, account, asset) => {
          return Promise.resolve({
            cmd: 'batch-transfer-tokens',
            data,
            account,
            asset,
          });
        }),
    }));

    it('should call submit2Chain with the correct data', async () => {
      // Setup
      const mockTransaction = {
        id: 'tx-123',
        requestKey: 'req-123',
        type: 'TRANSFERTOKENS',
      };

      // Setup all required mocks
      mocksHook.useAsset.mockReturnValue({
        paused: false,
        initFetchInvestors: mockinitFetchInvestors,
        investors: [
          { accountName: 'k:he-man', alias: 'he-man' },
          { accountName: 'k:skeletor', alias: 'skeletor' },
        ],
        asset: {
          uuid: 'test-asset',
          contractName: 'test',
          namespace: 'ns',
        },
      });

      mocksHook.useAccount.mockReturnValue({
        account: { address: 'k:he-man' },
        sign: vi.fn(),
        isMounted: true,
        isInvestor: true,
      });

      mocksHook.useFreeze.mockReturnValue({
        frozen: false,
      });

      mocksHook.useGetInvestorBalance.mockReturnValue({
        data: 100,
      });

      const mockSubmit2Chain = vi.fn().mockResolvedValue(mockTransaction);
      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: mockSubmit2Chain,
      });

      const { result } = renderHook(() => useBatchTransferTokens());

      // Test data
      const transferData = [{ to: 'k:skeletor', amount: '30' }];

      // Execute
      const response = await result.current.submit(transferData);

      // Assert
      expect(mockSubmit2Chain).toHaveBeenCalledWith(
        transferData,
        expect.objectContaining({
          notificationSentryName: 'error:submit:batchtransfertokens',
          chainFunction: expect.any(Function),
          transaction: {
            type: { name: 'TRANSFERTOKENS', overall: true },
            accounts: ['k:skeletor', 'k:he-man'],
          },
        }),
      );

      expect(response).toEqual(mockTransaction);
    });

    it('should call batchTransferTokens with the correct parameters when chainFunction is executed', async () => {
      // Setup mock for batchTransferTokens

      // Mock the module directly
      vi.mock('@/services/batchTransferTokens', () => ({
        batchTransferTokens: mocksSubmit.mockBatchTransferTokens,
      }));

      // We need to re-import to get the mocked version
      await import('@/services/batchTransferTokens');

      // Setup required mocks
      mocksHook.useAsset.mockReturnValue({
        paused: false,
        initFetchInvestors: mockinitFetchInvestors,
        investors: [
          { accountName: 'k:he-man', alias: 'he-man' },
          { accountName: 'k:skeletor', alias: 'skeletor' },
        ],
        asset: {
          uuid: 'test-asset',
          contractName: 'test',
          namespace: 'ns',
        },
      });

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:he-man',
        },
        sign: vi.fn(),
        isMounted: true,
        isInvestor: true,
      });

      mocksHook.useFreeze.mockReturnValue({
        frozen: false,
      });

      // Setup mock for submit2Chain that calls the chainFunction with account and asset
      const mockSubmit2Chain = vi.fn().mockImplementation((data, options) => {
        const { chainFunction } = options;
        const mockAccount = { address: 'k:he-man' };
        const mockAsset = {
          uuid: 'test-asset',
          contractName: 'test',
          namespace: 'ns',
        };

        return chainFunction(mockAccount, mockAsset).then(() => {
          return {
            id: 'tx-123',
            requestKey: 'req-123',
            type: 'TRANSFERTOKENS',
          };
        });
      });

      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: mockSubmit2Chain,
      });

      mocksHook.useGetInvestorBalance.mockReturnValue({
        data: 100,
      });

      const { result } = renderHook(() => useBatchTransferTokens());

      // Test data
      const transferData = [{ to: 'k:skeletor', amount: '50' }];

      // Execute
      await result.current.submit(transferData);

      // Assert
      expect(mocksSubmit.mockBatchTransferTokens).toHaveBeenCalledWith(
        transferData,
        { address: 'k:he-man' },
        { uuid: 'test-asset', contractName: 'test', namespace: 'ns' },
      );
    });

    it('should return the transaction data from submit2Chain', async () => {
      // Setup
      const mockTransaction = {
        id: 'tx-123',
        requestKey: 'req-123',
        type: 'TRANSFERTOKENS',
        hash: 'hash-123',
      };

      // Setup required mocks
      mocksHook.useAsset.mockReturnValue({
        paused: false,
        initFetchInvestors: mockinitFetchInvestors,
        investors: [
          { accountName: 'k:he-man', alias: 'he-man' },
          { accountName: 'k:skeletor', alias: 'skeletor' },
        ],
        asset: {
          uuid: 'test-asset',
          contractName: 'test',
          namespace: 'ns',
        },
      });

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:he-man',
        },
        sign: vi.fn(),
        isMounted: true,
        isInvestor: true,
        balance: 0,
      });

      mocksHook.useFreeze.mockReturnValue({
        frozen: false,
      });

      mocksHook.useGetInvestorBalance.mockReturnValue({
        data: 100,
      });

      // Create a mock implementation of submit2Chain that returns the mock transaction
      const mockSubmit2Chain = vi.fn().mockResolvedValue(mockTransaction);
      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: mockSubmit2Chain,
      });

      const { result } = renderHook(() => useBatchTransferTokens());

      // Test data
      const transferData = [{ to: 'k:skeletor', amount: '30' }];

      // Execute
      const response = await result.current.submit(transferData);

      // Assert
      expect(mockSubmit2Chain).toHaveBeenCalled();
      expect(response).toEqual(mockTransaction);
    });
  });
});
