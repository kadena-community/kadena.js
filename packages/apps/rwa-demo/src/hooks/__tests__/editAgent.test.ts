import { renderHook } from '@testing-library/react';
import { useEditAgent } from '../editAgent';

describe('editAgent hook', () => {
  const mocksHook = vi.hoisted(() => {
    return {
      mockEditAgent: vi.fn().mockResolvedValue({
        cmd: 'test-unsigned-command',
      }),
      mockAddAgent: vi.fn().mockResolvedValue({
        cmd: 'test-unsigned-command',
      }),
      mockStore: {
        setAccount: vi.fn().mockResolvedValue(undefined),
      },
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
      useAsset: vi.fn().mockReturnValue({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: false,
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
    // Reset all mocks before each test
    mocksHook.useUser.mockReset().mockReturnValue({
      user: {
        address: 'k:1',
        name: 'Test User',
        email: 'heman@mastersoftheuniverse.com',
      },
    });

    mocksHook.useOrganisation.mockReset().mockReturnValue({
      organisation: {
        id: 'org-123',
        name: 'Test Organisation',
      },
    });

    mocksHook.useAsset.mockReset().mockReturnValue({
      asset: {
        id: 'asset-123',
        name: 'Test Asset',
      },
      paused: false,
    });

    mocksHook.useAccount.mockReset().mockReturnValue({
      account: {
        address: 'k:1',
      },
      sign: vi.fn(),
      isMounted: true,
      isOwner: false,
      accountRoles: {
        isAgentAdmin: vi.fn().mockReturnValue(false),
      },
    });

    mocksHook.useTransactions.mockReset().mockReturnValue({
      addTransaction: vi.fn(),
      isActiveAccountChangeTx: false,
    });

    mocksHook.useNotifications.mockReset().mockReturnValue({
      addNotification: vi.fn(),
    });

    mocksHook.mockEditAgent.mockReset().mockResolvedValue({
      cmd: 'test-unsigned-command',
    });

    mocksHook.mockAddAgent.mockReset().mockResolvedValue({
      cmd: 'test-unsigned-command',
    });

    mocksHook.mockGetClient.mockReset().mockReturnValue({
      submit: vi.fn().mockResolvedValue({
        requestKey: 'test-request-key',
        hash: 'test-hash',
      }),
    });

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

    vi.mock('@/services/editAgent', async () => {
      return {
        editAgent: mocksHook.mockEditAgent,
      };
    });

    vi.mock('@/services/addAgent', async () => {
      return {
        addAgent: mocksHook.mockAddAgent,
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
    vi.resetModules();
  });

  it('should return the correct properties', async () => {
    const { result } = renderHook(() => useEditAgent());
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true, when account is mounted, when contract is NOT paused, when account has role ADMIN, when no activeAccountTx busy', () => {
      // Setup specific mocks for this test
      const isAgentAdminMock = vi.fn().mockReturnValue(true);

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:1',
        },
        isOwner: false,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: isAgentAdminMock,
        },
      });

      mocksHook.useAsset.mockReturnValue({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: false,
      });

      mocksHook.useTransactions.mockReturnValue({
        addTransaction: vi.fn(),
        isActiveAccountChangeTx: false,
      });

      const { result } = renderHook(() => useEditAgent());

      expect(result.current.isAllowed).toBe(true);
      expect(isAgentAdminMock).toHaveBeenCalled();
    });

    it('should return true, when account is mounted, when contract is NOT paused, when account is Owner, when no activeAccountTx busy', () => {
      // Setup specific mocks for this test
      const isAgentAdminMock = vi.fn().mockReturnValue(false);

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:1',
        },
        isOwner: true,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: isAgentAdminMock,
        },
      });

      mocksHook.useAsset.mockReturnValue({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: false,
      });

      mocksHook.useTransactions.mockReturnValue({
        addTransaction: vi.fn(),
        isActiveAccountChangeTx: false,
      });

      const { result } = renderHook(() => useEditAgent());

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return false, when account is NOT mounted', () => {
      // Setup specific mocks for this test
      const isAgentAdminMock = vi.fn().mockReturnValue(true);

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:1',
        },
        isOwner: false,
        isMounted: false,
        accountRoles: {
          isAgentAdmin: isAgentAdminMock,
        },
      });

      mocksHook.useAsset.mockReturnValue({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: false,
      });

      mocksHook.useTransactions.mockReturnValue({
        addTransaction: vi.fn(),
        isActiveAccountChangeTx: false,
      });

      const { result } = renderHook(() => useEditAgent());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is paused', () => {
      // Setup specific mocks for this test
      const isAgentAdminMock = vi.fn().mockReturnValue(true);

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:1',
        },
        isOwner: false,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: isAgentAdminMock,
        },
      });

      mocksHook.useAsset.mockReturnValue({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: true,
      });

      mocksHook.useTransactions.mockReturnValue({
        addTransaction: vi.fn(),
        isActiveAccountChangeTx: false,
      });

      const { result } = renderHook(() => useEditAgent());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is NOT paused, when account has NO role ADMIN and is NOT owner', () => {
      // Setup specific mocks for this test
      const isAgentAdminMock = vi.fn().mockReturnValue(false);

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:1',
        },
        isOwner: false,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: isAgentAdminMock,
        },
      });

      mocksHook.useAsset.mockReturnValue({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: false,
      });

      mocksHook.useTransactions.mockReturnValue({
        addTransaction: vi.fn(),
        isActiveAccountChangeTx: false,
      });

      const { result } = renderHook(() => useEditAgent());

      expect(result.current.isAllowed).toBe(false);
      expect(isAgentAdminMock).toHaveBeenCalled();
    });

    it('should return false, when activeAccountTx is busy', () => {
      // Setup specific mocks for this test
      const isAgentAdminMock = vi.fn().mockReturnValue(true);

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:1',
        },
        isOwner: false,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: isAgentAdminMock,
        },
      });

      mocksHook.useAsset.mockReturnValue({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
        },
        paused: false,
      });

      mocksHook.useTransactions.mockReturnValue({
        addTransaction: vi.fn(),
        isActiveAccountChangeTx: true,
      });

      const { result } = renderHook(() => useEditAgent());

      expect(result.current.isAllowed).toBe(false);
    });
  });

  describe('submit', () => {
    const mockAgent = {
      address: 'k:admin-address',
      publicKey: 'mock-public-key',
      guard: { keys: ['mock-public-key'], pred: 'keys-all' as const },
      keyset: { keys: ['mock-public-key'], pred: 'keys-all' as const },
      alias: 'mock-alias',
      contract: 'mock-contract',
      chains: [],
      overallBalance: '0',
      walletName: 'ECKO' as const,
    };

    it('should call addAgent when alreadyExists is false', async () => {
      const signMock = vi.fn().mockResolvedValue({
        cmd: 'test-signed-command',
      });

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:admin-address',
        },
        isMounted: true,
        sign: signMock,
        isOwner: false,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      });

      const { result } = renderHook(() => useEditAgent());

      const data = {
        accountName: 'k:new-agent',
        agent: mockAgent,
        roles: ['AGENT'],
        alreadyExists: false,
      };
      await result.current.submit(data);

      expect(mocksHook.mockAddAgent).toHaveBeenCalledWith(
        data,
        { address: 'k:admin-address' },
        mocksHook.useAsset().asset,
      );
      expect(mocksHook.mockEditAgent).not.toHaveBeenCalled();
    });

    it('should call editAgent when alreadyExists is true', async () => {
      const signMock = vi.fn().mockResolvedValue({
        cmd: 'test-signed-command',
      });

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:admin-address',
        },
        isMounted: true,
        sign: signMock,
        isOwner: false,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      });

      const { result } = renderHook(() => useEditAgent());

      const data = {
        accountName: 'k:existing-agent',
        agent: mockAgent,
        roles: ['AGENT', 'ADMIN'],
        alreadyExists: true,
      };
      await result.current.submit(data);

      expect(mocksHook.mockEditAgent).toHaveBeenCalledWith(
        data,
        { address: 'k:admin-address' },
        mocksHook.useAsset().asset,
      );
      expect(mocksHook.mockAddAgent).not.toHaveBeenCalled();
    });

    it('should sign the transaction and submit it to the client', async () => {
      const signMock = vi.fn().mockResolvedValue({
        cmd: 'test-signed-command',
      });

      const addTransactionMock = vi.fn();

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:admin-address',
        },
        isMounted: true,
        sign: signMock,
        isOwner: false,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      });

      mocksHook.useTransactions.mockReturnValue({
        addTransaction: addTransactionMock,
        isActiveAccountChangeTx: false,
      });

      const { result } = renderHook(() => useEditAgent());

      const data = {
        accountName: 'k:new-agent',
        agent: mockAgent,
        roles: ['AGENT'],
        alreadyExists: false,
      };
      await result.current.submit(data);

      expect(addTransactionMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: { name: 'ADDAGENT', overall: true },
          accounts: ['k:new-agent', 'k:admin-address'],
        }),
      );
    });

    it('should call store.setAccount after submission', async () => {
      const signMock = vi.fn().mockResolvedValue({
        cmd: 'test-signed-command',
      });

      mocksHook.useAccount.mockReturnValue({
        account: {
          address: 'k:admin-address',
        },
        isMounted: true,
        sign: signMock,
        isOwner: false,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      });

      const { result } = renderHook(() => useEditAgent());

      const data = {
        accountName: 'k:new-agent',
        agent: mockAgent,
        roles: ['AGENT'],
        alreadyExists: false,
      };
      await result.current.submit(data);

      expect(mocksHook.mockStore.setAccount).toHaveBeenCalledWith(data);
    });

    it('should add a notification and return early when asset is not found', async () => {
      const addNotificationMock = vi.fn();

      // Specifically set the asset to undefined for this test
      mocksHook.useAsset.mockReturnValue({
        asset: undefined,
        paused: false,
      });

      mocksHook.useNotifications.mockReturnValue({
        addNotification: addNotificationMock,
      });

      const { result } = renderHook(() => useEditAgent());

      const data = {
        accountName: 'k:new-agent',
        agent: mockAgent,
        roles: ['AGENT'],
        alreadyExists: false,
      };
      await result.current.submit(data);

      expect(addNotificationMock).toHaveBeenCalledWith(
        {
          intent: 'negative',
          label: 'asset not found',
          message: '',
        },
        {
          name: 'error:submit:editagent',
          options: {
            message: 'asset not found',
            sentryData: {
              type: 'submit_chain',
            },
          },
        },
      );
      expect(mocksHook.mockAddAgent).not.toHaveBeenCalled();
      expect(mocksHook.mockEditAgent).not.toHaveBeenCalled();
    });

    it('should handle errors and add notification', async () => {
      const addNotificationMock = vi.fn();

      mocksHook.useNotifications.mockReturnValue({
        addNotification: addNotificationMock,
      });

      // Specifically set addAgent to throw an error for this test
      mocksHook.mockAddAgent.mockRejectedValue(new Error('Test error'));

      const { result } = renderHook(() => useEditAgent());

      const data = {
        accountName: 'k:new-agent',
        agent: mockAgent,
        roles: ['AGENT'],
        alreadyExists: false,
      };
      await result.current.submit(data);

      expect(addNotificationMock).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'there was an error',
          message: 'Test error',
        }),
        expect.objectContaining({
          name: 'error:submit:editagent',
        }),
      );
    });
  });
});
