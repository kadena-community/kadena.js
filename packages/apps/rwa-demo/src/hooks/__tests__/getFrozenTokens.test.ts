import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetFrozenTokens } from '../getFrozenTokens';

// Create hoisted mocks
const mocks = vi.hoisted(() => ({
  useEventSubscriptionSubscription: vi.fn(),
  getFrozenTokens: vi.fn(),
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

vi.mock('@/services/getFrozenTokens', () => ({
  getFrozenTokens: mocks.getFrozenTokens,
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

describe('useGetFrozenTokens', () => {
  const mockInvestorAccount = 'k:investor123';
  const mockWalletAccount = {
    address: 'k:myaddress123',
    publicKey: 'publicKey123',
    name: 'Test Wallet',
    networkId: 'testnet04',
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
    mocks.getFrozenTokens.mockResolvedValue(100);

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

  it('should initialize with 0 frozen tokens', () => {
    const { result } = renderHook(() =>
      useGetFrozenTokens({ investorAccount: mockInvestorAccount }),
    );
    expect(result.current.data).toBe(0);
  });

  it('should not fetch data if account is not provided', () => {
    mocks.useAccount.mockReturnValue({ account: null });

    renderHook(() =>
      useGetFrozenTokens({ investorAccount: mockInvestorAccount }),
    );
    expect(mocks.getFrozenTokens).not.toHaveBeenCalled();
  });

  it('should not fetch data if investorAccount is not provided', () => {
    renderHook(() => useGetFrozenTokens({ investorAccount: '' }));
    expect(mocks.getFrozenTokens).not.toHaveBeenCalled();
  });

  it('should not fetch data if asset is not provided', () => {
    mocks.useAsset.mockReturnValue({ asset: null });

    renderHook(() =>
      useGetFrozenTokens({ investorAccount: mockInvestorAccount }),
    );
    expect(mocks.getFrozenTokens).not.toHaveBeenCalled();
  });

  it('should fetch frozen tokens when all dependencies are provided', async () => {
    // Use a simpler approach with jest.fn()
    mocks.getFrozenTokens.mockResolvedValue(100);

    const { result } = renderHook(() =>
      useGetFrozenTokens({ investorAccount: mockInvestorAccount }),
    );

    // Wait for the initial render and then the update after the effect
    await waitFor(() => {
      expect(mocks.getFrozenTokens).toHaveBeenCalledWith(
        {
          investorAccount: mockInvestorAccount,
          account: mockWalletAccount,
        },
        mockAsset,
      );
      expect(result.current.data).toBe(100);
    });
  });

  it('should update data when account changes', async () => {
    // First call will return 100
    mocks.getFrozenTokens.mockResolvedValueOnce(100);

    const { result, rerender } = renderHook(() =>
      useGetFrozenTokens({ investorAccount: mockInvestorAccount }),
    );

    // Wait for the first update
    await waitFor(() => {
      expect(result.current.data).toBe(100);
    });

    // Update account
    const newWalletAccount = {
      ...mockWalletAccount,
      address: 'k:newaddress456',
    };

    // Second call will return 250
    mocks.getFrozenTokens.mockResolvedValueOnce(250);

    // Update the account mock
    mocks.useAccount.mockReturnValue({
      account: newWalletAccount,
    });

    // Force rerender to trigger effect
    rerender();

    // Wait for the update after rerender
    await waitFor(() => {
      expect(mocks.getFrozenTokens).toHaveBeenCalledWith(
        {
          investorAccount: mockInvestorAccount,
          account: newWalletAccount,
        },
        mockAsset,
      );
      expect(result.current.data).toBe(250);
    });
  });

  it('should update data when investorAccount changes', async () => {
    // First call will return 100
    mocks.getFrozenTokens.mockResolvedValueOnce(100);

    const { result, rerender } = renderHook(
      ({ investorAccount }) => useGetFrozenTokens({ investorAccount }),
      {
        initialProps: { investorAccount: mockInvestorAccount },
      },
    );

    // Wait for the first update
    await waitFor(() => {
      expect(result.current.data).toBe(100);
    });

    // Second call will return 300
    mocks.getFrozenTokens.mockResolvedValueOnce(300);

    // Update the investorAccount
    const newInvestorAccount = 'k:newinvestor456';

    // Force rerender with new investor account
    rerender({ investorAccount: newInvestorAccount });

    // Wait for the update after rerender
    await waitFor(() => {
      expect(mocks.getFrozenTokens).toHaveBeenCalledWith(
        {
          investorAccount: newInvestorAccount,
          account: mockWalletAccount,
        },
        mockAsset,
      );
      expect(result.current.data).toBe(300);
    });
  });

  it('should update data when asset changes', async () => {
    // First call will return 100
    mocks.getFrozenTokens.mockResolvedValueOnce(100);

    const { result, rerender } = renderHook(() =>
      useGetFrozenTokens({ investorAccount: mockInvestorAccount }),
    );

    // Wait for the first update
    await waitFor(() => {
      expect(result.current.data).toBe(100);
    });

    // Create a new asset
    const newAsset = {
      ...mockAsset,
      uuid: 'asset-456',
      contractName: 'new-test-asset',
    };

    // Second call will return 400
    mocks.getFrozenTokens.mockResolvedValueOnce(400);

    // Update the asset mock
    mocks.useAsset.mockReturnValue({
      asset: newAsset,
    });

    // Force rerender to trigger effect
    rerender();

    // Wait for the update after rerender
    await waitFor(() => {
      expect(mocks.getFrozenTokens).toHaveBeenCalledWith(
        {
          investorAccount: mockInvestorAccount,
          account: mockWalletAccount,
        },
        newAsset,
      );
      expect(result.current.data).toBe(400);
    });
  });

  it('should update data when TOKENS-FROZEN event is received', async () => {
    // First call will return 100
    mocks.getFrozenTokens.mockResolvedValueOnce(100);

    const { result, rerender } = renderHook(() =>
      useGetFrozenTokens({ investorAccount: mockInvestorAccount }),
    );

    // Wait for the first update
    await waitFor(() => {
      expect(result.current.data).toBe(100);
    });

    // Second call will return 500
    mocks.getFrozenTokens.mockResolvedValueOnce(500);

    // Update the subscription data mock to simulate receiving an event
    mocks.useEventSubscriptionSubscription
      .mockReturnValueOnce({
        data: { events: [{ id: '1' }] },
      })
      .mockReturnValueOnce({
        data: null, // For the second subscription (TOKENS-UNFROZEN)
      });

    // Force rerender to trigger subscription effect
    rerender();

    // Wait for the update after rerender
    await waitFor(() => {
      expect(mocks.getFrozenTokens).toHaveBeenCalledTimes(2);
      expect(result.current.data).toBe(500);
    });
  });

  it('should update data when TOKENS-UNFROZEN event is received', async () => {
    // First call will return 100
    mocks.getFrozenTokens.mockResolvedValueOnce(100);

    const { result, rerender } = renderHook(() =>
      useGetFrozenTokens({ investorAccount: mockInvestorAccount }),
    );

    // Wait for the first update
    await waitFor(() => {
      expect(result.current.data).toBe(100);
    });

    // Second call will return 50
    mocks.getFrozenTokens.mockResolvedValueOnce(50);

    // Update the subscription data mock to simulate receiving an unfrozen event
    mocks.useEventSubscriptionSubscription
      .mockReturnValueOnce({
        data: null, // For the first subscription (TOKENS-FROZEN)
      })
      .mockReturnValueOnce({
        data: { events: [{ id: '1' }] }, // For the second subscription (TOKENS-UNFROZEN)
      });

    // Force rerender to trigger subscription effect
    rerender();

    // Wait for the update after rerender
    await waitFor(() => {
      expect(mocks.getFrozenTokens).toHaveBeenCalledTimes(2);
      expect(result.current.data).toBe(50);
    });
  });
});
