import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { act, renderHook } from '@testing-library/react';
import { useGetComplianceRules } from '../getComplianceRules';

// Create hoisted mocks
const mocks = vi.hoisted(() => ({
  useEventSubscriptionSubscription: vi.fn(),
  getComplianceRules: vi.fn(),
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

vi.mock('@/services/getComplianceRules', () => ({
  getComplianceRules: mocks.getComplianceRules,
}));

vi.mock('@/utils/getAsset', () => ({
  getAsset: mocks.getAsset,
}));

describe('useGetComplianceRules', () => {
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

  const mockComplianceRulesResponse = {
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
  };

  const mockSubscriptionData = {
    events: [
      {
        parameters: JSON.stringify([
          [
            {
              refName: { name: 'max-balance-compliance-v1' },
            },
            {
              refName: { name: 'supply-limit-compliance-v1' },
            },
          ],
        ]),
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    mocks.getComplianceRules.mockResolvedValue(mockComplianceRulesResponse);

    mocks.useEventSubscriptionSubscription.mockReturnValue({
      data: null,
    });
  });

  it('should initialize with undefined data', () => {
    const { result } = renderHook(() => useGetComplianceRules({}));
    expect(result.current.data).toBeUndefined();
  });

  it('should not fetch data if asset is not provided', () => {
    renderHook(() => useGetComplianceRules({}));
    expect(mocks.getComplianceRules).not.toHaveBeenCalled();
  });

  it('should fetch compliance rules when asset is provided', async () => {
    // Setup the mock to resolve on next tick
    let resolvePromise: (value: typeof mockComplianceRulesResponse) => void;
    const promise = new Promise<typeof mockComplianceRulesResponse>(
      (resolve) => {
        resolvePromise = resolve;
      },
    );

    mocks.getComplianceRules.mockImplementation(() => {
      resolvePromise(mockComplianceRulesResponse);
      return promise;
    });

    const { result } = renderHook(() =>
      useGetComplianceRules({ asset: mockAsset }),
    );

    // Wait for the async effect to complete
    await act(async () => {
      await promise;
    });

    expect(mocks.getComplianceRules).toHaveBeenCalledWith(mockAsset);
    expect(result.current.data).toEqual(mockComplianceRulesResponse);
  });

  it('should handle getComplianceRules returning a number (error case)', async () => {
    // Mock an error response
    const errorCode = 404;
    let resolvePromise: (value: number) => void;
    const promise = new Promise<number>((resolve) => {
      resolvePromise = resolve;
    });

    mocks.getComplianceRules.mockImplementation(() => {
      resolvePromise(errorCode);
      return promise;
    });

    const { result } = renderHook(() =>
      useGetComplianceRules({ asset: mockAsset }),
    );

    // Wait for the async effect to complete
    await act(async () => {
      await promise;
    });

    expect(mocks.getComplianceRules).toHaveBeenCalledWith(mockAsset);
    expect(result.current.data).toBeUndefined();
  });

  it('should update compliance rules when subscription data is received', async () => {
    // First, mock with null subscription data
    mocks.useEventSubscriptionSubscription.mockReturnValue({
      data: null,
    });

    // Setup the initial mock response for getComplianceRules
    let resolvePromise: (value: typeof mockComplianceRulesResponse) => void;
    const promise = new Promise<typeof mockComplianceRulesResponse>(
      (resolve) => {
        resolvePromise = resolve;
      },
    );

    mocks.getComplianceRules.mockImplementation(() => {
      resolvePromise(mockComplianceRulesResponse);
      return promise;
    });

    // Render the hook
    const { result, rerender } = renderHook(() =>
      useGetComplianceRules({ asset: mockAsset }),
    );

    // Wait for the initial fetch to complete
    await act(async () => {
      await promise;
    });

    // Verify initial state has all rules active
    expect(result.current.data?.maxInvestors.isActive).toBe(true);
    expect(result.current.data?.maxSupply.isActive).toBe(true);
    expect(result.current.data?.maxBalance.isActive).toBe(true);

    // Now update the subscription mock to trigger the effect
    mocks.useEventSubscriptionSubscription.mockReturnValue({
      data: mockSubscriptionData,
    });

    // Force a re-render to trigger the subscription effect
    rerender({ asset: mockAsset });

    // The maxInvestors rule should be marked as inactive since it's not in the subscription data
    expect(result.current.data?.maxInvestors.isActive).toBe(false);

    // The maxSupply rule should still be active
    expect(result.current.data?.maxSupply.isActive).toBe(true);

    // The maxBalance rule should still be active
    expect(result.current.data?.maxBalance.isActive).toBe(true);
  });

  it('should not process subscription data if there are no events', async () => {
    // Start with no subscription data
    mocks.useEventSubscriptionSubscription.mockReturnValue({
      data: null,
    });

    // Setup for async resolution
    let resolvePromise: (value: typeof mockComplianceRulesResponse) => void;
    const promise = new Promise<typeof mockComplianceRulesResponse>(
      (resolve) => {
        resolvePromise = resolve;
      },
    );

    mocks.getComplianceRules.mockImplementation(() => {
      resolvePromise(mockComplianceRulesResponse);
      return promise;
    });

    const { result, rerender } = renderHook(() =>
      useGetComplianceRules({ asset: mockAsset }),
    );

    // Wait for the async effect to complete
    await act(async () => {
      await promise;
    });

    const initialData = result.current.data;

    // Update subscription data to empty events array
    mocks.useEventSubscriptionSubscription.mockReturnValue({
      data: { events: [] },
    });

    // Force a re-render to trigger the subscription effect
    rerender({ asset: mockAsset });

    // Data should not change
    expect(result.current.data).toEqual(initialData);
  });

  it('should handle asset changes correctly', async () => {
    // Setup for first async resolution
    let resolveFirstPromise: (
      value: typeof mockComplianceRulesResponse,
    ) => void;
    const firstPromise = new Promise<typeof mockComplianceRulesResponse>(
      (resolve) => {
        resolveFirstPromise = resolve;
      },
    );

    mocks.getComplianceRules.mockImplementationOnce(() => {
      resolveFirstPromise(mockComplianceRulesResponse);
      return firstPromise;
    });

    const { result, rerender } = renderHook(
      ({ asset }) => useGetComplianceRules({ asset }),
      {
        initialProps: { asset: mockAsset },
      },
    );

    // Wait for the first async effect to complete
    await act(async () => {
      await firstPromise;
    });

    // Initial data should match our mock
    expect(result.current.data).toEqual(mockComplianceRulesResponse);

    // Create a new asset
    const newAsset = {
      ...mockAsset,
      uuid: 'asset-456',
      compliance: {
        ...mockAsset.compliance,
        maxSupply: {
          ...mockAsset.compliance.maxSupply,
          value: 2000,
        },
      },
    };

    // Set up a different response for the new asset
    const newComplianceRules = {
      ...mockComplianceRulesResponse,
      maxSupply: {
        ...mockComplianceRulesResponse.maxSupply,
        value: 2000,
      },
    };

    // Setup for second async resolution
    let resolveSecondPromise: (value: typeof newComplianceRules) => void;
    const secondPromise = new Promise<typeof newComplianceRules>((resolve) => {
      resolveSecondPromise = resolve;
    });

    mocks.getComplianceRules.mockImplementationOnce(() => {
      resolveSecondPromise(newComplianceRules);
      return secondPromise;
    });

    // Trigger rerender with new asset
    rerender({ asset: newAsset });

    // Wait for the second async effect to complete
    await act(async () => {
      await secondPromise;
    });

    // Verify the hook called getComplianceRules with the new asset
    expect(mocks.getComplianceRules).toHaveBeenCalledWith(newAsset);

    // Verify the data has been updated
    expect(result.current.data).toEqual(newComplianceRules);
  });

  it('should handle case when subscription parameters format is unexpected', async () => {
    // Setup initial state with no subscription data
    mocks.useEventSubscriptionSubscription.mockReturnValue({
      data: null,
    });

    // Setup for async resolution of initial data
    let resolvePromise: (value: typeof mockComplianceRulesResponse) => void;
    const promise = new Promise<typeof mockComplianceRulesResponse>(
      (resolve) => {
        resolvePromise = resolve;
      },
    );

    mocks.getComplianceRules.mockImplementation(() => {
      resolvePromise(mockComplianceRulesResponse);
      return promise;
    });

    // Render the hook
    const { result, rerender } = renderHook(() =>
      useGetComplianceRules({ asset: mockAsset }),
    );

    // Wait for the async effect to complete
    await act(async () => {
      await promise;
    });

    // Store initial data for comparison
    const initialData = result.current.data;

    // Set up subscription data with unexpected format
    const unexpectedFormatData = {
      events: [
        {
          parameters: JSON.stringify(['unexpected-format']), // Not the expected object with refName
        },
      ],
    };

    // Update the subscription mock
    mocks.useEventSubscriptionSubscription.mockReturnValue({
      data: unexpectedFormatData,
    });

    // Force a re-render to trigger the subscription effect
    rerender({ asset: mockAsset });

    // Verify that the hook doesn't crash and data is preserved
    expect(result.current.data).toEqual(initialData);
  });
});
