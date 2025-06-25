import { renderHook } from '@testing-library/react';
import { useAddInvestor } from '../addInvestor';

describe('addInvestor hook', () => {
  const mocksHook = vi.hoisted(() => {
    return {
      mockStore: {
        setAccount: vi.fn().mockResolvedValue(undefined),
      },
      mockRegisterIdentity: vi.fn().mockResolvedValue({
        cmd: 'test-unsigned-command',
      }),
      mockGetClient: vi.fn().mockReturnValue({
        submit: vi.fn().mockResolvedValue({
          requestKey: 'test-request-key',
          hash: 'test-hash',
        }),
      }),
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
      useFreeze: vi.fn().mockReturnValue({
        frozen: true,
      }),
      useAsset: vi.fn().mockReturnValue({
        paused: true,
      }),

      useAccount: vi.fn().mockReturnValue({
        account: {
          address: 'k:he-man',
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

    vi.mock('@/services/registerIdentity', async () => {
      return {
        registerIdentity: mocksHook.mockRegisterIdentity,
      };
    });

    vi.mock('@/utils/client', async () => {
      return {
        getClient: mocksHook.mockGetClient,
      };
    });

    vi.mock('@/utils/store', async () => {
      return {
        RWAStore: vi.fn().mockReturnValue(mocksHook.mockStore),
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
        isOwner: false,
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

    it('should return true, when account is mounted, when account is NOT frozen, when contract is NOT paused, when account isOwner, when no activeAccountTx busy', () => {
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

    it('should return false, when account NOT is mounted', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: undefined,
        isMounted: false,
        isOwner: false,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));

      const { result } = renderHook(() =>
        useAddInvestor({ investorAccount: 'k:1' }),
      );

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when account is frozen, when contract is NOT paused, when account has role AGENTADMIN, when no activeAccountTx busy', () => {
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
        isOwner: false,
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

  describe('submit', () => {
    it('should call registerIdentity with the correct parameters', async () => {
      const signMock = vi.fn().mockResolvedValue({
        cmd: 'test-signed-command',
      });

      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:agent-address',
        },
        isOwner: false,
        isMounted: true,
        sign: signMock,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: false,
      }));

      const { result } = renderHook(() =>
        useAddInvestor({ investorAccount: 'k:investor-1' }),
      );

      const data = {
        accountName: 'k:investor-1',
        name: 'Test Investor',
        email: 'investor@test.com',
        alreadyExists: false,
      };

      await result.current.submit(data);

      expect(mocksHook.mockRegisterIdentity).toHaveBeenCalledWith(
        {
          ...data,
          agent: { address: 'k:agent-address' },
        },
        {
          id: 'asset-123',
          name: 'Test Asset',
        },
      );
    });

    it('should sign the transaction and submit it to the client', async () => {
      const signMock = vi.fn().mockResolvedValue({
        cmd: 'test-signed-command',
      });

      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:agent-address',
        },
        isOwner: false,
        isMounted: true,
        sign: signMock,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: false,
      }));

      const addTransactionMock = vi.fn();
      mocksHook.useTransactions.mockImplementation(() => ({
        addTransaction: addTransactionMock,
        isActiveAccountChangeTx: false,
      }));

      const mockClientSubmit = vi.fn().mockResolvedValue({
        requestKey: 'test-request-key',
        hash: 'test-hash',
      });
      mocksHook.mockGetClient.mockReturnValue({
        submit: mockClientSubmit,
      });

      const { result } = renderHook(() =>
        useAddInvestor({ investorAccount: 'k:investor-1' }),
      );

      const data = {
        accountName: 'k:investor-1',
        name: 'Test Investor',
        email: 'investor@test.com',
        alreadyExists: false,
      };

      await result.current.submit(data);

      // Verify signing was called with the unsigned command
      expect(signMock).toHaveBeenCalledWith({ cmd: 'test-unsigned-command' });

      // Verify client submission was called with the signed command
      expect(mockClientSubmit).toHaveBeenCalledWith({
        cmd: 'test-signed-command',
      });

      // Verify transaction was added
      expect(addTransactionMock).toHaveBeenCalledWith({
        requestKey: 'test-request-key',
        hash: 'test-hash',
        type: {
          name: 'ADDINVESTOR',
          overall: true,
        },
        accounts: ['k:agent-address', 'k:investor-1'],
      });
    });

    it('should not submit if the sign function returns nothing', async () => {
      const signMock = vi.fn().mockResolvedValue(undefined);

      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:agent-address',
        },
        isOwner: false,
        isMounted: true,
        sign: signMock,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: false,
      }));

      const mockClientSubmit = vi.fn();
      mocksHook.mockGetClient.mockReturnValue({
        submit: mockClientSubmit,
      });

      const addTransactionMock = vi.fn();
      mocksHook.useTransactions.mockImplementation(() => ({
        addTransaction: addTransactionMock,
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() =>
        useAddInvestor({ investorAccount: 'k:investor-1' }),
      );

      const data = {
        accountName: 'k:investor-1',
        name: 'Test Investor',
        email: 'investor@test.com',
        alreadyExists: false,
      };

      await result.current.submit(data);

      // Verify client submission and addTransaction were not called
      expect(mockClientSubmit).not.toHaveBeenCalled();
      expect(addTransactionMock).not.toHaveBeenCalled();
    });

    it('should add a notification and return early when asset is not found', async () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:agent-address',
        },
        isOwner: false,
        isMounted: true,
        sign: vi.fn(),
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        asset: undefined,
        paused: false,
      }));

      const addNotificationMock = vi.fn();
      mocksHook.useNotifications.mockImplementation(() => ({
        addNotification: addNotificationMock,
      }));

      const { result } = renderHook(() =>
        useAddInvestor({ investorAccount: 'k:investor-1' }),
      );

      const data = {
        accountName: 'k:investor-1',
        name: 'Test Investor',
        email: 'investor@test.com',
        alreadyExists: false,
      };

      await result.current.submit(data);

      // Verify notification was called
      expect(addNotificationMock).toHaveBeenCalledWith(
        expect.objectContaining({
          intent: 'negative',
          label: 'asset not found',
        }),
        expect.any(Object),
      );

      // Verify registerIdentity was not called
      expect(mocksHook.mockRegisterIdentity).not.toHaveBeenCalled();
    });

    it('should not call registerIdentity if alreadyExists is true', async () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:agent-address',
        },
        isOwner: false,
        isMounted: true,
        sign: vi.fn(),
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: false,
      }));

      const { result } = renderHook(() =>
        useAddInvestor({ investorAccount: 'k:investor-1' }),
      );

      const data = {
        accountName: 'k:investor-1',
        name: 'Test Investor',
        email: 'investor@test.com',
        alreadyExists: true,
      };

      await result.current.submit(data);

      // Verify registerIdentity was not called
      expect(mocksHook.mockRegisterIdentity).not.toHaveBeenCalled();
    });

    it('should handle errors and add notification', async () => {
      const errorMessage = 'Test error message';
      mocksHook.mockRegisterIdentity.mockRejectedValue(new Error(errorMessage));

      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:agent-address',
        },
        isOwner: false,
        isMounted: true,
        sign: vi.fn(),
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: false,
      }));

      const addNotificationMock = vi.fn();
      mocksHook.useNotifications.mockImplementation(() => ({
        addNotification: addNotificationMock,
      }));

      const { result } = renderHook(() =>
        useAddInvestor({ investorAccount: 'k:investor-1' }),
      );

      const data = {
        accountName: 'k:investor-1',
        name: 'Test Investor',
        email: 'investor@test.com',
        alreadyExists: false,
      };

      await result.current.submit(data);

      // Verify notification was called with error
      expect(addNotificationMock).toHaveBeenCalledWith(
        expect.objectContaining({
          intent: 'negative',
          label: 'there was an error',
        }),
        expect.any(Object),
      );
    });

    it('should call store.setAccount with data after submission', async () => {
      mocksHook.useOrganisation.mockImplementation(() => ({
        organisation: {
          id: 'org-123',
          name: 'Test Organisation',
        },
      }));

      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:agent-address',
        },
        isOwner: false,
        isMounted: true,
        sign: vi.fn().mockResolvedValue({ cmd: 'test-signed-command' }),
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: false,
      }));

      const { result } = renderHook(() =>
        useAddInvestor({ investorAccount: 'k:investor-1' }),
      );

      const data = {
        accountName: 'k:investor-1',
        name: 'Test Investor',
        email: 'investor@test.com',
        alreadyExists: false,
      };

      await result.current.submit(data);

      // Verify store.setAccount was called with data
      expect(mocksHook.mockStore.setAccount).toHaveBeenCalledWith(data);
    });
  });
});
