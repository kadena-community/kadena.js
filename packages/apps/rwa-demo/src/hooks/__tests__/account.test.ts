import { AccountContext } from '@/contexts/AccountContext/AccountContext';
import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { useAccount } from '../account';

const mocks = vi.hoisted(() => ({
  useContext: vi.fn(),
  addAccountMock: vi.fn().mockResolvedValue([]),
  removeAccountMock: vi.fn(),
  signMock: vi.fn().mockResolvedValue(undefined),
  selectAccountMock: vi.fn(),
  checkAccountAssetRolesMock: vi.fn(),

  // Setup mock role functions
  getAllMock: vi.fn().mockReturnValue([]),
  isAgentAdminMock: vi.fn().mockReturnValue(false),
  isFreezerMock: vi.fn().mockReturnValue(false),
  isTransferManagerMock: vi.fn().mockReturnValue(false),
}));

const mockContext = vi.hoisted(() => ({
  isMounted: true,
  addAccount: mocks.addAccountMock,
  removeAccount: mocks.removeAccountMock,
  sign: mocks.signMock,
  selectAccount: mocks.selectAccountMock,
  isAgent: false,
  isOwner: false,
  isComplianceOwner: false,
  isInvestor: false,
  isFrozen: false,
  isGasPayable: false,
  accountRoles: {
    isMounted: true,
    getAll: mocks.getAllMock,
    isAgentAdmin: mocks.isAgentAdminMock,
    isFreezer: mocks.isFreezerMock,
    isTransferManager: mocks.isTransferManagerMock,
  },
  checkAccountAssetRoles: mocks.checkAccountAssetRolesMock,
}));

// Mock the account module for most tests

describe('useAccount', () => {
  // Setup mock functions

  beforeEach(() => {
    // Mock React's useContext
    vi.mock('react', async () => {
      const actual = await vi.importActual('react');
      return {
        ...actual,
        useContext: mocks.useContext,
      };
    });

    // Setup mock context

    // Set the mock implementation for useAccount
    // vi.mocked(useAccount).mockReturnValue(
    //   mockContext as unknown as ReturnType<typeof useAccount>,
    // );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should throw an error when used outside of AccountContextProvider', async () => {
    // The function should throw an error
    expect(() => {
      const { result } = renderHook(() => useAccount());
      return result.current;
    }).toThrow('useAccount must be used within a AccountContextProvider');

    // Verify useContext was called with AccountContext
    expect(useContext).toHaveBeenCalledWith(AccountContext);
  });

  it('should provide access to all account context properties', () => {
    // Create a mock account
    const mockAccount = {
      address: 'k:test123',
      publicKey: 'test-public-key',
      chainId: '1',
      networkId: 'testnet04',
    };

    // Setup context with account data
    const contextWithAccount = {
      ...mockContext,
      account: mockAccount,
      accounts: [mockAccount],
    };

    vi.mocked(mocks.useContext).mockReturnValueOnce(
      contextWithAccount as unknown as ReturnType<typeof useAccount>,
    );

    const { result } = renderHook(() => useAccount());

    // Verify properties
    expect(result.current.account).toBe(mockAccount);
    expect(result.current.accounts).toEqual([mockAccount]);
    expect(result.current.isAgent).toBe(false);
    expect(result.current.isInvestor).toBe(false);
    expect(result.current.isMounted).toBe(true);

    // Verify methods
    expect(typeof result.current.addAccount).toBe('function');
    expect(typeof result.current.removeAccount).toBe('function');
    expect(typeof result.current.sign).toBe('function');
    expect(typeof result.current.selectAccount).toBe('function');
    expect(typeof result.current.checkAccountAssetRoles).toBe('function');
  });
});
