import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IComplianceRule } from '@/services/getComplianceRules';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetInvestorCount } from '../getInvestorCount';

// Create hoisted mocks
const mocks = vi.hoisted(() => ({
  useEventSubscriptionSubscription: vi.fn().mockReturnValue({
    data: {
      events: [{ id: 'event1' }],
    },
  }),
  getInvestorCount: vi.fn(),
  getAsset: vi.fn((asset) => {
    if (asset?.contractName === 'test-asset') {
      return 'free.test-asset';
    }
    return 'default-asset';
  }),
}));

// Mock the imported dependencies
vi.mock('@/__generated__/sdk', () => ({
  useEventSubscriptionSubscription: mocks.useEventSubscriptionSubscription,
}));

vi.mock('@/services/getInvestorCount', () => ({
  getInvestorCount: mocks.getInvestorCount,
}));

vi.mock('@/utils/getAsset', () => ({
  getAsset: mocks.getAsset,
}));

describe('useGetInvestorCount', () => {
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
      } as IComplianceRule,
      maxBalance: {
        key: 'max-balance-compliance-v1',
        isActive: true,
        value: 100,
      } as IComplianceRule,
      maxInvestors: {
        key: 'max-investors-compliance-v1',
        isActive: true,
        value: 50,
      } as IComplianceRule,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with 0', async () => {
    const { result } = renderHook(() => useGetInvestorCount());

    expect(result.current.data).toBe(0);
  });

  it('should return investor count when asset is provided and event is received', async () => {
    // Mock the getInvestorCount service to return 42
    mocks.getInvestorCount.mockResolvedValue(42);

    // Render the hook with a mock asset
    const { result } = renderHook(() => useGetInvestorCount(mockAsset));

    // Initial value should be 0
    expect(result.current.data).toBe(0);

    // Wait for the effect to trigger and update the state
    await waitFor(() => {
      expect(result.current.data).toBe(42);
    });

    // Verify that the investor count was fetched
    expect(mocks.getInvestorCount).toHaveBeenCalledWith(mockAsset);
  });

  it('should not fetch investor count when no events are present', async () => {
    // Override the mock to return no events
    mocks.useEventSubscriptionSubscription.mockReturnValue({
      data: {
        events: [],
      },
    });

    // Mock the getInvestorCount service
    mocks.getInvestorCount.mockResolvedValue(10);

    // Render the hook with a mock asset
    renderHook(() => useGetInvestorCount(mockAsset));

    // Verify that getInvestorCount was not called
    expect(mocks.getInvestorCount).not.toHaveBeenCalled();
  });

  it('should not fetch investor count when no asset is provided', async () => {
    // Override the mock to return events
    mocks.useEventSubscriptionSubscription.mockReturnValue({
      data: {
        events: [{ id: 'event1' }],
      },
    });

    // Mock the getInvestorCount service
    mocks.getInvestorCount.mockResolvedValue(10);

    // Render the hook without an asset
    renderHook(() => useGetInvestorCount());

    // Verify that getInvestorCount was not called
    expect(mocks.getInvestorCount).not.toHaveBeenCalled();
  });

  it('should fetch investor count when subscription data changes', async () => {
    // Mock the getInvestorCount service
    mocks.getInvestorCount.mockResolvedValue(15);

    // Setup subscription mock with a reference we can change
    let subscriptionMock = {
      data: {
        events: [] as Array<{ id: string }>,
      },
    };

    mocks.useEventSubscriptionSubscription.mockImplementation(
      () => subscriptionMock,
    );

    // Render the hook
    const { result, rerender } = renderHook(() =>
      useGetInvestorCount(mockAsset),
    );

    // Initial value should be 0
    expect(result.current.data).toBe(0);

    // Update subscription data to trigger effect
    subscriptionMock = {
      data: {
        events: [{ id: 'new-event' }],
      },
    };

    // Rerender to trigger effect with new subscription data
    rerender();

    // Wait for the effect to trigger and update the state
    await waitFor(() => {
      expect(result.current.data).toBe(15);
    });

    // Verify that getInvestorCount was called
    expect(mocks.getInvestorCount).toHaveBeenCalledWith(mockAsset);
  });
});
