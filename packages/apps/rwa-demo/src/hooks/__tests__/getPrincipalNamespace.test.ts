import type { IAccountContext } from '@/contexts/AccountContext/AccountContext';
import { getPrincipalNamespace } from '@/services/getPrincipalNamespace';
import type { ChainId } from '@kadena/client';
import { renderHook, waitFor } from '@testing-library/react';
import { useAccount } from '../account';
import { useGetPrincipalNamespace } from '../getPrincipalNamespace';

// Mock the dependencies
vi.mock('../account', () => ({
  useAccount: vi.fn(),
}));

vi.mock('@/services/getPrincipalNamespace', () => ({
  getPrincipalNamespace: vi.fn(),
}));

describe('useGetPrincipalNamespace', () => {
  const mockAccount = {
    address: 'k:test123',
    publicKey: 'test-public-key',
    guard: {
      keys: ['test-public-key'],
      pred: 'keys-all' as const,
    },
    keyset: {
      keys: ['test-public-key'],
      pred: 'keys-all' as const,
    },
    alias: 'test-account',
    contract: 'coin',
    chains: [{ chainId: '1' as ChainId, balance: '100.0' }],
    overallBalance: '100.0',
    walletName: 'CHAINWEAVER' as const,
    walletType: 'default' as const,
    chainId: '1' as ChainId,
    networkId: 'testnet04',
  };

  // Create a complete mock of AccountContext
  const mockAccountContext: IAccountContext = {
    account: undefined,
    accounts: [],
    isMounted: true,
    addAccount: vi.fn(),
    removeAccount: vi.fn(),
    sign: vi.fn(),
    selectAccount: vi.fn(),
    isAgent: false,
    isOwner: false,
    isComplianceOwner: false,
    isInvestor: false,
    isFrozen: false,
    isGasPayable: false,
    accountRoles: {
      isMounted: true,
      getAll: vi.fn(),
      isAgentAdmin: vi.fn(),
      isFreezer: vi.fn(),
      isTransferManager: vi.fn(),
    },
    checkAccountAssetRoles: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return undefined data when no account is available', async () => {
    // Mock useAccount to return context without account
    vi.mocked(useAccount).mockReturnValue({
      ...mockAccountContext,
      account: undefined,
    });

    const { result } = renderHook(() => useGetPrincipalNamespace());

    expect(result.current.data).toBeUndefined();
    expect(getPrincipalNamespace).not.toHaveBeenCalled();
  });

  it('should fetch principal namespace data when account is available', async () => {
    // Mock useAccount to return an account
    vi.mocked(useAccount).mockReturnValue({
      ...mockAccountContext,
      account: mockAccount,
    });

    // Mock getPrincipalNamespace to return test data
    const mockNamespace = 'test-namespace-123';
    vi.mocked(getPrincipalNamespace).mockResolvedValue(mockNamespace);

    const { result } = renderHook(() => useGetPrincipalNamespace());

    // Initially data should be undefined
    expect(result.current.data).toBeUndefined();

    // Wait for the effect to run
    await waitFor(() => {
      // Check that the service was called with correct parameters
      expect(getPrincipalNamespace).toHaveBeenCalledWith({
        owner: mockAccount,
      });

      // Check that the data was updated
      expect(result.current.data).toBe(mockNamespace);
    });
  });

  it('should update data when account changes', async () => {
    // First render with no account
    vi.mocked(useAccount).mockReturnValue({
      ...mockAccountContext,
      account: undefined,
    });

    const { result, rerender } = renderHook(() => useGetPrincipalNamespace());
    expect(result.current.data).toBeUndefined();

    // Update the account
    vi.mocked(useAccount).mockReturnValue({
      ...mockAccountContext,
      account: mockAccount,
    });

    // Mock service to return data
    const mockNamespace = 'test-namespace-456';
    vi.mocked(getPrincipalNamespace).mockResolvedValue(mockNamespace);

    // Rerender with the new account
    rerender();

    // Wait for the effect to run
    await waitFor(() => {
      // Check the service was called and data updated
      expect(getPrincipalNamespace).toHaveBeenCalledWith({
        owner: mockAccount,
      });
      expect(result.current.data).toBe(mockNamespace);
    });
  });
});
