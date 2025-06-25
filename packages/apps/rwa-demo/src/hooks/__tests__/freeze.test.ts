import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { renderHook, waitFor } from '@testing-library/react';
import { useFreeze } from '../freeze';

// Create hoisted mocks
const mocks = vi.hoisted(() => ({
  useEventSubscriptionSubscription: vi.fn(),
  isFrozen: vi.fn(),
  getAsset: vi.fn((asset) => {
    if (asset?.contractName === 'test-asset') {
      return 'free.test-asset';
    }
    return 'default-asset';
  }),
  useAccount: vi.fn(),
  useAsset: vi.fn(),
}));

// Mock the imported dependencies
vi.mock('@/__generated__/sdk', () => ({
  useEventSubscriptionSubscription: mocks.useEventSubscriptionSubscription,
}));

vi.mock('@/services/isFrozen', () => ({
  isFrozen: mocks.isFrozen,
}));

vi.mock('@/utils/getAsset', () => ({
  getAsset: mocks.getAsset,
}));

vi.mock('../account', () => ({
  useAccount: mocks.useAccount,
}));

vi.mock('../asset', () => ({
  useAsset: mocks.useAsset,
}));

describe('useFreeze', () => {
  const mockInvestorAccount = 'k:investor123';
  const mockWalletAccount: IWalletAccount = {
    address: 'k:myaddress123',
    publicKey: 'publicKey123',
    guard: { keys: ['publicKey123'], pred: 'keys-all' },
    keyset: { keys: ['publicKey123'], pred: 'keys-all' },
    alias: 'Test Wallet',
    contract: '',
    chains: [{ chainId: '0', balance: '100' }],
    overallBalance: '100',
    walletName: 'ECKO',
  };

  const mockAsset: IAsset = {
    uuid: 'asset-123',
    contractName: 'test-asset',
    namespace: 'free',
    supply: 1000,
    investorCount: 0,
    compliance: {
      maxSupply: {
        key: 'supply-limit-compliance-v1',
        isActive: true,
        value: 1000,
      },
      maxBalance: {
        key: 'max-balance-compliance-v1',
        isActive: true,
        value: 100,
      },
      maxInvestors: {
        key: 'max-investors-compliance-v1',
        isActive: true,
        value: 50,
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    mocks.isFrozen.mockResolvedValue(true);

    mocks.useAccount.mockReturnValue({
      account: mockWalletAccount,
    });

    mocks.useAsset.mockReturnValue({
      asset: mockAsset,
    });

    mocks.useEventSubscriptionSubscription.mockReturnValue({
      data: null,
    });
  });

  it('should initialize with frozen set to true', () => {
    const { result } = renderHook(() =>
      useFreeze({ investorAccount: mockInvestorAccount }),
    );
    expect(result.current.frozen).toBe(true);
  });

  it('should not fetch data if account is not provided', () => {
    mocks.useAccount.mockReturnValue({ account: null });

    renderHook(() => useFreeze({ investorAccount: mockInvestorAccount }));
    expect(mocks.isFrozen).not.toHaveBeenCalled();
  });

  it('should not fetch data if investorAccount is not provided', () => {
    renderHook(() => useFreeze({ investorAccount: undefined }));
    expect(mocks.isFrozen).not.toHaveBeenCalled();
  });

  it('should not fetch data if asset is not provided', () => {
    mocks.useAsset.mockReturnValue({ asset: null });

    renderHook(() => useFreeze({ investorAccount: mockInvestorAccount }));
    expect(mocks.isFrozen).not.toHaveBeenCalled();
  });

  it('should fetch frozen status when all dependencies are provided', async () => {
    // Create a promise we can resolve manually
    let resolvePromise: (value: boolean) => void;
    const frozenPromise = new Promise<boolean>((resolve) => {
      resolvePromise = resolve;
    });

    // Mock the isFrozen function to return our controllable promise
    mocks.isFrozen.mockReturnValue(frozenPromise);

    const { result } = renderHook(() =>
      useFreeze({ investorAccount: mockInvestorAccount }),
    );

    // Initially the frozen state should be true (default value)
    expect(result.current.frozen).toBe(true);

    // Resolve the promise
    resolvePromise!(false);

    // Wait for the state to change
    await waitFor(() => {
      expect(result.current.frozen).toBe(false);
    });

    expect(mocks.isFrozen).toHaveBeenCalledWith(
      {
        investorAccount: mockInvestorAccount,
        account: mockWalletAccount,
      },
      mockAsset,
    );
    expect(result.current.frozen).toBe(false);
  });

  it('should update data when account changes', async () => {
    // Create the initial promise
    let resolveInitialPromise: (value: boolean) => void;
    const initialFrozenPromise = new Promise<boolean>((resolve) => {
      resolveInitialPromise = resolve;
    });

    mocks.isFrozen.mockReturnValueOnce(initialFrozenPromise);

    const { result, rerender } = renderHook(() =>
      useFreeze({ investorAccount: mockInvestorAccount }),
    );

    // Initial state is true (default value)
    expect(result.current.frozen).toBe(true);

    // Resolve the first promise
    resolveInitialPromise!(true);

    // Create the second promise for the account change
    let resolveSecondPromise: (value: boolean) => void;
    const secondFrozenPromise = new Promise<boolean>((resolve) => {
      resolveSecondPromise = resolve;
    });

    mocks.isFrozen.mockReturnValueOnce(secondFrozenPromise);

    // Update account
    const newWalletAccount = {
      ...mockWalletAccount,
      address: 'k:newaddress456',
      publicKey: 'newPublicKey456',
      guard: { keys: ['newPublicKey456'], pred: 'keys-all' },
      keyset: { keys: ['newPublicKey456'], pred: 'keys-all' },
    };

    // Update the account mock
    mocks.useAccount.mockReturnValue({
      account: newWalletAccount,
    });

    // Force rerender to trigger effect
    rerender();

    // Resolve the second promise with false
    resolveSecondPromise!(false);

    // Wait for the value to change
    await waitFor(() => {
      expect(result.current.frozen).toBe(false);
    });

    expect(mocks.isFrozen).toHaveBeenCalledWith(
      {
        investorAccount: mockInvestorAccount,
        account: newWalletAccount,
      },
      mockAsset,
    );
    expect(result.current.frozen).toBe(false);
  });

  it('should update data when investorAccount changes', async () => {
    // Create the initial promise
    let resolveInitialPromise: (value: boolean) => void;
    const initialFrozenPromise = new Promise<boolean>((resolve) => {
      resolveInitialPromise = resolve;
    });

    mocks.isFrozen.mockReturnValueOnce(initialFrozenPromise);

    const { result, rerender } = renderHook(
      ({ investorAccount }) => useFreeze({ investorAccount }),
      {
        initialProps: { investorAccount: mockInvestorAccount },
      },
    );

    // Initial state is true (default value)
    expect(result.current.frozen).toBe(true);

    // Resolve the first promise
    resolveInitialPromise!(true);

    // Create the second promise for the investorAccount change
    let resolveSecondPromise: (value: boolean) => void;
    const secondFrozenPromise = new Promise<boolean>((resolve) => {
      resolveSecondPromise = resolve;
    });

    mocks.isFrozen.mockReturnValueOnce(secondFrozenPromise);

    // Update the investorAccount
    const newInvestorAccount = 'k:newinvestor456';

    // Force rerender with new investor account
    rerender({ investorAccount: newInvestorAccount });

    // Resolve the second promise with false
    resolveSecondPromise!(false);

    // Wait for the value to change
    await waitFor(() => {
      expect(result.current.frozen).toBe(false);
    });

    expect(mocks.isFrozen).toHaveBeenCalledWith(
      {
        investorAccount: newInvestorAccount,
        account: mockWalletAccount,
      },
      mockAsset,
    );
    expect(result.current.frozen).toBe(false);
  });

  it('should update data when asset changes', async () => {
    // Create the initial promise
    let resolveInitialPromise: (value: boolean) => void;
    const initialFrozenPromise = new Promise<boolean>((resolve) => {
      resolveInitialPromise = resolve;
    });

    mocks.isFrozen.mockReturnValueOnce(initialFrozenPromise);

    const { result, rerender } = renderHook(() =>
      useFreeze({ investorAccount: mockInvestorAccount }),
    );

    // Initial state is true (default value)
    expect(result.current.frozen).toBe(true);

    // Resolve the first promise
    resolveInitialPromise!(true);

    // Create the second promise for the asset change
    let resolveSecondPromise: (value: boolean) => void;
    const secondFrozenPromise = new Promise<boolean>((resolve) => {
      resolveSecondPromise = resolve;
    });

    mocks.isFrozen.mockReturnValueOnce(secondFrozenPromise);

    // Create a new asset
    const newAsset = {
      ...mockAsset,
      uuid: 'asset-456',
      contractName: 'new-test-asset',
    };

    // Update the asset mock
    mocks.useAsset.mockReturnValue({
      asset: newAsset,
    });

    // Force rerender to trigger effect
    rerender();

    // Resolve the second promise with false
    resolveSecondPromise!(false);

    // Wait for the value to change
    await waitFor(() => {
      expect(result.current.frozen).toBe(false);
    });

    expect(mocks.isFrozen).toHaveBeenCalledWith(
      {
        investorAccount: mockInvestorAccount,
        account: mockWalletAccount,
      },
      newAsset,
    );
    expect(result.current.frozen).toBe(false);
  });

  it('should update frozen status when ADDRESS-FROZEN event is received for the investor account', async () => {
    // Create the initial promise
    let resolveInitialPromise: (value: boolean) => void;
    const initialFrozenPromise = new Promise<boolean>((resolve) => {
      resolveInitialPromise = resolve;
    });

    mocks.isFrozen.mockReturnValueOnce(initialFrozenPromise);

    const { result, rerender } = renderHook(() =>
      useFreeze({ investorAccount: mockInvestorAccount }),
    );

    // Initial state is true (default value)
    expect(result.current.frozen).toBe(true);

    // Resolve the first promise
    resolveInitialPromise!(true);

    // No need to wait since we're not checking the intermediate state

    // Update the subscription data mock to simulate receiving an event that changes status to false
    mocks.useEventSubscriptionSubscription.mockReturnValue({
      data: {
        events: [
          {
            id: '1',
            parameters: JSON.stringify([mockInvestorAccount, false]),
          },
        ],
      },
    });

    // Force rerender to trigger subscription effect
    rerender();

    // Event handler is synchronous, so we can immediately check the result
    expect(result.current.frozen).toBe(false);
  });

  it('should not update frozen status when ADDRESS-FROZEN event is for a different account', async () => {
    // Create the initial promise
    let resolveInitialPromise: (value: boolean) => void;
    const initialFrozenPromise = new Promise<boolean>((resolve) => {
      resolveInitialPromise = resolve;
    });

    mocks.isFrozen.mockReturnValueOnce(initialFrozenPromise);

    const { result, rerender } = renderHook(() =>
      useFreeze({ investorAccount: mockInvestorAccount }),
    );

    // Initial state is true (default value)
    expect(result.current.frozen).toBe(true);

    // Resolve the first promise
    resolveInitialPromise!(true);

    // Update the subscription data mock to simulate receiving an event for a different account
    mocks.useEventSubscriptionSubscription.mockReturnValue({
      data: {
        events: [
          {
            id: '1',
            parameters: JSON.stringify(['k:different-account', false]),
          },
        ],
      },
    });

    // Force rerender to trigger subscription effect
    rerender();

    // Status should not change because the event is for a different account
    expect(result.current.frozen).toBe(true);
  });

  it('should handle invalid or malformed event parameters', async () => {
    // Create the initial promise
    let resolveInitialPromise: (value: boolean) => void;
    const initialFrozenPromise = new Promise<boolean>((resolve) => {
      resolveInitialPromise = resolve;
    });

    mocks.isFrozen.mockReturnValueOnce(initialFrozenPromise);

    const { result, rerender } = renderHook(() =>
      useFreeze({ investorAccount: mockInvestorAccount }),
    );

    // Initial state is true (default value)
    expect(result.current.frozen).toBe(true);

    // Resolve the first promise
    resolveInitialPromise!(true);

    // Update the subscription data mock to simulate receiving an event with malformed parameters
    mocks.useEventSubscriptionSubscription.mockReturnValue({
      data: {
        events: [
          {
            id: '1',
            parameters: JSON.stringify([]), // Empty parameters array
          },
        ],
      },
    });

    // Force rerender to trigger subscription effect
    rerender();

    // Status should not change because the event parameters are invalid
    expect(result.current.frozen).toBe(true);
  });
});
