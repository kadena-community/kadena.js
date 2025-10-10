import type { IForcedTransferTokensProps } from '@/services/forcedTransferTokens';
import { renderHook } from '@testing-library/react';
import { useForcedTransferTokens } from '../forcedTransferTokens';

describe('forcedTransferTokens hook', () => {
  const mocksHook = vi.hoisted(() => {
    return {
      mockForcedTransferTokens: vi.fn().mockResolvedValue({
        cmd: 'test-unsigned-command',
      }),
      mockGetClient: vi.fn().mockReturnValue({
        submit: vi.fn().mockResolvedValue({
          requestKey: 'test-request-key',
          hash: 'test-hash',
        }),
      }),
      useAsset: vi.fn().mockReturnValue({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: true,
      }),
      useAccount: vi.fn().mockReturnValue({
        account: {
          address: 'k:1',
        },
        sign: vi.fn(),
        isMounted: true,
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(false),
        },
      }),
      useTransactions: vi.fn().mockReturnValue({
        addTransaction: vi.fn(),
        isActiveAccountChangeTx: false,
      }),
      useNotifications: vi.fn().mockReturnValue({
        addNotification: vi.fn(),
      }),
      useSubmit2Chain: vi.fn().mockReturnValue({
        submit2Chain: vi.fn().mockImplementation((data, options) => {
          return options
            .chainFunction(
              {
                address: 'k:transfer-manager',
                sign: vi.fn().mockResolvedValue({ cmd: 'test-signed-command' }),
              },
              { id: 'asset-123', name: 'Test Asset' },
            )
            .then(() => ({
              requestKey: 'test-request-key',
              hash: 'test-hash',
            }));
        }),
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

    vi.mock('./../useSubmit2Chain', async () => {
      const actual = await vi.importActual('./../useSubmit2Chain');
      return {
        ...actual,
        useSubmit2Chain: mocksHook.useSubmit2Chain,
      };
    });

    vi.mock('@/services/forcedTransferTokens', async () => {
      return {
        forcedTransferTokens: mocksHook.mockForcedTransferTokens,
      };
    });

    vi.mock('@/utils/client', async () => {
      return {
        getClient: mocksHook.mockGetClient,
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
    it('should return true when account is mounted, contract is not paused, and account has TRANSFERMANAGER role', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:transfer-manager',
        },
        isMounted: true,
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(true),
        },
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));

      const { result } = renderHook(() => useForcedTransferTokens());

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return false when account is not mounted', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: undefined,
        isMounted: false,
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(true),
        },
      }));

      const { result } = renderHook(() => useForcedTransferTokens());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false when contract is paused', () => {
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

    it('should return false when account does not have TRANSFERMANAGER role', () => {
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

  describe('submit', () => {
    it('should call submit2Chain with the correct parameters', async () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:transfer-manager',
        },
        isMounted: true,
        sign: vi.fn().mockResolvedValue({ cmd: 'test-signed-command' }),
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(true),
        },
      }));

      const submit2ChainMock = vi.fn().mockResolvedValue({
        requestKey: 'test-request-key',
        hash: 'test-hash',
      });
      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: submit2ChainMock,
      });

      const { result } = renderHook(() => useForcedTransferTokens());

      const data = {
        investorFromAccount: 'k:investor-from',
        investorToAccount: 'k:investor-to',
        amount: 100,
      };

      await result.current.submit(data);

      expect(submit2ChainMock).toHaveBeenCalledWith(
        data,
        expect.objectContaining({
          notificationSentryName: 'error:submit:forcedtransfertokens',
          transaction: {
            type: { name: 'TRANSFERTOKENS', overall: true },
            accounts: [
              'k:transfer-manager',
              'k:investor-from',
              'k:investor-to',
            ],
          },
        }),
      );
    });

    it('should call forcedTransferTokens when chainFunction is executed', async () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:transfer-manager',
        },
        isMounted: true,
        sign: vi.fn().mockResolvedValue({ cmd: 'test-signed-command' }),
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(true),
        },
      }));

      const mockSubmit2Chain = vi.fn().mockImplementation((data, options) => {
        return options.chainFunction(
          { address: 'k:transfer-manager' },
          { id: 'asset-123', name: 'Test Asset' },
        );
      });

      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: mockSubmit2Chain,
      });

      const { result } = renderHook(() => useForcedTransferTokens());

      const data = {
        investorFromAccount: 'k:investor-from',
        investorToAccount: 'k:investor-to',
        amount: 100,
      };

      await result.current.submit(data);

      expect(mocksHook.mockForcedTransferTokens).toHaveBeenCalledWith(
        data,
        { address: 'k:transfer-manager' },
        { id: 'asset-123', name: 'Test Asset' },
      );
    });

    it('should create a transaction with correct accounts list', async () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:transfer-manager',
        },
        isMounted: true,
        sign: vi.fn().mockResolvedValue({ cmd: 'test-signed-command' }),
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(true),
        },
      }));

      const submit2ChainMock = vi.fn().mockResolvedValue({
        requestKey: 'test-request-key',
        hash: 'test-hash',
      });
      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: submit2ChainMock,
      });

      const { result } = renderHook(() => useForcedTransferTokens());

      const data = {
        investorFromAccount: 'k:investor-from',
        investorToAccount: 'k:investor-to',
        amount: 100,
      };

      await result.current.submit(data);

      expect(submit2ChainMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          transaction: expect.objectContaining({
            accounts: [
              'k:transfer-manager',
              'k:investor-from',
              'k:investor-to',
            ],
          }),
        }),
      );
    });

    it('should handle successful transaction submission', async () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:transfer-manager',
        },
        isMounted: true,
        sign: vi.fn().mockResolvedValue({ cmd: 'test-signed-command' }),
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(true),
        },
      }));

      const submit2ChainMock = vi.fn().mockResolvedValue({
        requestKey: 'test-request-key',
        hash: 'test-hash',
      });
      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: submit2ChainMock,
      });

      const { result } = renderHook(() => useForcedTransferTokens());

      const data: IForcedTransferTokensProps = {
        investorFromAccount: 'k:investor-from',
        investorToAccount: 'k:investor-to',
        amount: 100,
      };

      const response = await result.current.submit(data);

      expect(response).toEqual({
        requestKey: 'test-request-key',
        hash: 'test-hash',
      });
    });
  });
});
