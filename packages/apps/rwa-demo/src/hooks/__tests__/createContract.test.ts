import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCreateContract } from '../createContract';

// Set up mocks globally before any imports
vi.mock('@/providers/TransactionsProvider/TransactionsProvider', () => ({
  interpretErrorMessage: vi.fn().mockReturnValue('Error message'),
}));

describe('createContract hook', () => {
  const mocksHook = vi.hoisted(() => {
    return {
      useUser: vi.fn().mockReturnValue({
        userToken: {
          token: 'fake-token-123',
        },
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
      useAccount: vi.fn().mockReturnValue({
        account: {
          address: 'k:he-man',
        },
        sign: vi.fn().mockResolvedValue({ signedCmd: 'signed-command' }),
        isMounted: true,
        isGasPayable: false,
      }),
      useTransactions: vi.fn().mockReturnValue({
        addTransaction: vi.fn().mockResolvedValue({}),
      }),
      useNotifications: vi.fn().mockReturnValue({
        addNotification: vi.fn(),
      }),
      getClient: vi.fn().mockReturnValue({
        submit: vi.fn().mockResolvedValue({ requestKeys: ['req-123'] }),
        listen: vi.fn().mockResolvedValue({
          result: { status: 'success' },
          reqKey: 'req-123',
        }),
      }),
    };
  });

  global.fetch = vi.fn();

  // Set up mocks outside of beforeEach to avoid re-mocking between tests
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

  vi.mock('@/utils/client', () => ({
    getClient: mocksHook.getClient,
  }));
  beforeEach(() => {
    // Reset all mock implementations before each test
    mocksHook.useUser.mockReturnValue({
      userToken: {
        token: 'fake-token-123',
      },
      user: {
        address: 'k:1',
        name: 'Test User',
        email: 'heman@mastersoftheuniverse.com',
      },
    });

    mocksHook.useOrganisation.mockReturnValue({
      organisation: {
        id: 'org-123',
        name: 'Test Organisation',
      },
    });

    mocksHook.useAccount.mockReturnValue({
      account: {
        address: 'k:he-man',
      },
      sign: vi.fn().mockResolvedValue({ signedCmd: 'signed-command' }),
      isMounted: true,
      isGasPayable: false,
    });

    mocksHook.useTransactions.mockReturnValue({
      addTransaction: vi.fn().mockResolvedValue({}),
    });

    mocksHook.useNotifications.mockReturnValue({
      addNotification: vi.fn(),
    });

    mocksHook.getClient.mockReturnValue({
      submit: vi.fn().mockResolvedValue({ requestKeys: ['req-123'] }),
      listen: vi.fn().mockResolvedValue({
        result: { status: 'success' },
        reqKey: 'req-123',
      }),
    });

    // Reset fetch mock
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Also restore any mock implementations
    vi.restoreAllMocks();
  });

  it('should return the correct properties', async () => {
    const { result } = renderHook(() => useCreateContract());
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true, when account is Mounted, when gasisPayable, and is org admin', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        ...mocksHook.useAccount.getMockImplementation(),
        isMounted: true,
        isGasPayable: true,
        userToken: {
          claims: {
            orgAdmins: {
              'org-123': true,
            },
          },
        },
      }));

      mocksHook.useUser.mockImplementation(() => ({
        ...mocksHook.useUser.getMockImplementation(),
        userToken: {
          claims: {
            orgAdmins: {
              'org-123': true,
            },
          },
        },
      }));

      const { result } = renderHook(() => useCreateContract());

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return false, when account is Mounted, when gasisPayable, and is NOT org admin', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        ...mocksHook.useAccount.getMockImplementation(),
        isMounted: true,
        isGasPayable: true,
        userToken: {
          claims: {
            orgAdmins: {},
          },
        },
      }));

      mocksHook.useUser.mockImplementation(() => ({
        ...mocksHook.useUser.getMockImplementation(),
        userToken: {
          claims: {
            orgAdmins: {
              'org-123': true,
            },
          },
        },
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

  describe('submit', () => {
    const mockContractData = {
      namespace: 'test-namespace',
      contractName: 'test-contract',
      assetName: 'Test Asset',
    };

    it('should return undefined when userToken or organisation is missing', async () => {
      // Mock missing userToken
      mocksHook.useUser.mockReturnValueOnce({
        userToken: null,
        user: { address: 'k:1' },
      });

      const { result } = renderHook(() => useCreateContract());
      const submitResult = await result.current.submit(mockContractData);

      expect(submitResult).toBeUndefined();
      expect(mocksHook.useNotifications().addNotification).toHaveBeenCalledWith(
        {
          intent: 'negative',
          label: 'User token is missing',
        },
        expect.any(Object),
      );
    });

    it('should handle API error responses', async () => {
      // Mock fetch to return an error status
      global.fetch = vi.fn().mockResolvedValueOnce({
        status: 400,
        statusText: 'Bad Request',
      });

      const { result } = renderHook(() => useCreateContract());
      const submitResult = await result.current.submit(mockContractData);

      expect(submitResult).toBeUndefined();
      expect(mocksHook.useNotifications().addNotification).toHaveBeenCalledWith(
        {
          intent: 'negative',
          label: 'Error creating contract',
          message: 'Status: 400, Message: Bad Request',
        },
      );
    });

    it('should handle missing tx in API response', async () => {
      // Mock fetch to return success but no tx
      global.fetch = vi.fn().mockResolvedValueOnce({
        status: 200,
        json: vi.fn().mockResolvedValueOnce({}),
      });

      const { result } = renderHook(() => useCreateContract());
      const submitResult = await result.current.submit(mockContractData);

      expect(submitResult).toBeUndefined();
      expect(mocksHook.useNotifications().addNotification).toHaveBeenCalledWith(
        {
          intent: 'negative',
          label: 'Error creating contract',
          message: 'Unknown error occurred',
        },
        expect.any(Object),
      );
    });

    it('should handle signing failure', async () => {
      // Mock fetch with successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        status: 200,
        json: vi.fn().mockResolvedValueOnce({
          tx: { cmd: 'unsigned-command' },
        }),
      });

      // Mock sign to return null (failure)
      mocksHook.useAccount.mockReturnValueOnce({
        ...mocksHook.useAccount(),
        sign: vi.fn().mockResolvedValueOnce(null),
      });

      const { result } = renderHook(() => useCreateContract());
      const submitResult = await result.current.submit(mockContractData);

      expect(submitResult).toBeUndefined();
      expect(mocksHook.useNotifications().addNotification).toHaveBeenCalledWith(
        {
          intent: 'negative',
          label: 'Signing transaction failed',
          message: 'Please check your account and try again.',
        },
        expect.any(Object),
      );
    });

    it('should handle duplicate contract error gracefully', async () => {
      // Setup for a successful flow until the contract duplicate error
      global.fetch = vi.fn().mockResolvedValueOnce({
        status: 200,
        json: vi.fn().mockResolvedValueOnce({
          tx: { cmd: 'unsigned-command' },
        }),
      });

      // Mock client listen to return a "duplicate table" error
      mocksHook.getClient.mockReturnValueOnce({
        submit: vi.fn().mockResolvedValue({ requestKeys: ['req-123'] }),
        listen: vi.fn().mockResolvedValue({
          result: {
            status: 'failure',
            error: { message: '"PactDuplicateTableError something' },
          },
          reqKey: 'req-123',
        }),
      });

      // Mock window.location.href
      const originalHref = window.location.href;
      Object.defineProperty(window, 'location', {
        value: {
          href: '',
        },
        writable: true,
      });

      const { result } = renderHook(() => useCreateContract());
      const submitResult = await result.current.submit(mockContractData);

      expect(submitResult).toBe(false);
      expect(window.location.href).toBe(
        '/assets/create/test-namespace/test-contract',
      );

      // Restore window.location.href
      Object.defineProperty(window, 'location', {
        value: {
          href: originalHref,
        },
        writable: true,
      });
    });

    it('should return false for other failure states', async () => {
      // Setup for a successful flow until some other failure type
      global.fetch = vi.fn().mockResolvedValueOnce({
        status: 200,
        json: vi.fn().mockResolvedValueOnce({
          tx: { cmd: 'unsigned-command' },
        }),
      });

      // Mock client listen to return a general failure
      mocksHook.getClient.mockReturnValueOnce({
        submit: vi.fn().mockResolvedValue({ requestKeys: ['req-123'] }),
        listen: vi.fn().mockResolvedValue({
          result: {
            status: 'failure',
            error: { message: 'Some other error' },
          },
          reqKey: 'req-123',
        }),
      });

      const { result } = renderHook(() => useCreateContract());
      const submitResult = await result.current.submit(mockContractData);

      expect(submitResult).toBe(false);
    });

    it('should handle unexpected exceptions during submission', async () => {
      // Setup successful API response
      global.fetch = vi.fn().mockResolvedValueOnce({
        status: 200,
        json: vi.fn().mockResolvedValueOnce({
          tx: { cmd: 'unsigned-command' },
        }),
      });

      // But make client.submit throw an error
      mocksHook.getClient.mockReturnValueOnce({
        submit: vi.fn().mockRejectedValue(new Error('Network error')),
        listen: vi.fn(),
      });

      const { result } = renderHook(() => useCreateContract());
      await result.current.submit(mockContractData);

      // Just check that notification was called with negative intent
      expect(mocksHook.useNotifications().addNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          intent: 'negative',
          label: 'there was an error',
        }),
      );
    });

    it('should successfully submit a contract and return true', async () => {
      // Mock successful API response
      global.fetch = vi.fn().mockResolvedValueOnce({
        status: 200,
        json: vi.fn().mockResolvedValueOnce({
          tx: { cmd: 'unsigned-command' },
        }),
      });

      // Mock successful client operations
      const mockSubmitResult = { requestKeys: ['req-123'] };
      const mockListenResult = {
        result: { status: 'success' },
        reqKey: 'req-123',
      };

      mocksHook.getClient.mockReturnValueOnce({
        submit: vi.fn().mockResolvedValue(mockSubmitResult),
        listen: vi.fn().mockResolvedValue(mockListenResult),
      });

      const { result } = renderHook(() => useCreateContract());
      const submitResult = await result.current.submit(mockContractData);

      // Verify API call
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/admin/contract?organisationId=org-123`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token-123',
          }),
          body: JSON.stringify({
            ...mockContractData,
            accountAddress: 'k:he-man',
          }),
        }),
      );

      // Verify transaction was added
      expect(mocksHook.useTransactions().addTransaction).toHaveBeenCalledWith({
        ...mockSubmitResult,
        type: TXTYPES.CREATECONTRACT,
        accounts: ['k:he-man'],
      });

      // Verify successful result
      expect(submitResult).toBe(true);
    });
  });
});
