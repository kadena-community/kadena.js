import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGetInvestors } from '../getInvestors';

// Create hoisted mocks
const mocks = vi.hoisted(() => ({
  useEventsQuery: vi.fn().mockImplementation(() => ({
    data: null,
    loading: false,
  })),
  useEventSubscriptionSubscription: vi.fn().mockImplementation(() => ({
    data: null,
  })),
  filterRemovedRecords: vi.fn().mockImplementation((records) => records),
  getAsset: vi.fn((asset) => {
    if (asset?.contractName === 'test-contract') {
      return 'test-namespace.test-contract';
    }
    return '';
  }),
}));

// Define interface for query params
interface IQueryParams {
  variables: {
    qualifiedName: string;
  };
  skip?: boolean;
  fetchPolicy?: string;
}

// Define interface for subscription params
interface ISubscriptionParams {
  variables: {
    qualifiedName: string;
  };
  skip?: boolean;
}

// Mock the imported dependencies
vi.mock('@/__generated__/sdk', () => ({
  useEventsQuery: (params: IQueryParams) => mocks.useEventsQuery(params),
  useEventSubscriptionSubscription: (params: ISubscriptionParams) =>
    mocks.useEventSubscriptionSubscription(params),
}));

vi.mock('@/utils/filterRemovedRecords', () => ({
  filterRemovedRecords: mocks.filterRemovedRecords,
}));

vi.mock('@/utils/getAsset', () => ({
  getAsset: mocks.getAsset,
}));

// Temporarily skip the entire test suite to fix the timeout issues
describe('useGetInvestors', () => {
  const mockAsset: IAsset = {
    namespace: 'test-namespace',
    contractName: 'test-contract',
    uuid: 'test-uuid',
    supply: 1000,
    investorCount: 10,
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

  // Sample investor records
  const mockInvestorsAdded = [
    {
      node: {
        block: {
          height: 123,
          creationTime: 1672531200000, // 2023-01-01T00:00:00Z
        },
        chainId: '1',
        requestKey: 'key1',
        parameters: '["investor1"]',
      },
    },
    {
      node: {
        block: {
          height: 124,
          creationTime: 1672617600000, // 2023-01-02T00:00:00Z
        },
        chainId: '1',
        requestKey: 'key2',
        parameters: '["investor2"]',
      },
    },
  ];

  const mockInvestorsRemoved = [
    {
      node: {
        block: {
          height: 125,
          creationTime: 1672704000000, // 2023-01-03T00:00:00Z
        },
        chainId: '1',
        requestKey: 'key3',
        parameters: '["investor1"]',
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    mocks.useEventsQuery.mockImplementation(({ variables }) => {
      if (variables.qualifiedName.includes('IDENTITY-REGISTERED')) {
        return {
          data: {
            events: {
              edges: [],
            },
          },
          loading: false,
          error: null,
        };
      } else if (variables.qualifiedName.includes('IDENTITY-REMOVED')) {
        return {
          data: {
            events: {
              edges: [],
            },
          },
          loading: false,
          error: null,
        };
      }
      return { data: null, loading: false, error: null };
    });

    mocks.useEventSubscriptionSubscription.mockImplementation(() => ({
      data: null,
    }));

    mocks.filterRemovedRecords.mockImplementation((records) => records);
  });

  it('initializes with empty data and isLoading=false', () => {
    const { result } = renderHook(() => useGetInvestors());

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('does not fetch data until initFetchInvestors is called', () => {
    const { result } = renderHook(() => useGetInvestors(mockAsset));

    // Initially, no queries should be executed (skip: true)
    expect(mocks.useEventsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: true,
      }),
    );

    // Call initFetchInvestors to start fetching
    act(() => {
      result.current.initFetchInvestors();
    });

    // Now queries should be executed (skip: false)
    expect(mocks.useEventsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: false,
      }),
    );
  });

  it('processes investor data correctly when queries return results', async () => {
    // Create the expected records
    const expectedRecords: IRecord[] = [
      {
        isRemoved: false,
        blockHeight: 123,
        chainId: '1',
        requestKey: 'key1',
        accountName: 'investor1',
        creationTime: 1672531200000, // 2023-01-01T00:00:00Z
        result: true,
      },
      {
        isRemoved: false,
        blockHeight: 124,
        chainId: '1',
        requestKey: 'key2',
        accountName: 'investor2',
        creationTime: 1672617600000, // 2023-01-02T00:00:00Z
        result: true,
      },
    ];

    // Setup mock implementations with state changes
    let loadingState = true;

    // Mock filterRemovedRecords before rendering
    mocks.filterRemovedRecords.mockReturnValue(expectedRecords);

    // Setup mock that will change from loading: true to loading: false during the test
    mocks.useEventsQuery.mockImplementation(({ variables }) => {
      if (variables.qualifiedName.includes('IDENTITY-REGISTERED')) {
        return {
          data: {
            events: {
              edges: mockInvestorsAdded,
            },
          },
          loading: loadingState,
          error: null,
        };
      } else if (variables.qualifiedName.includes('IDENTITY-REMOVED')) {
        return {
          data: {
            events: {
              edges: mockInvestorsRemoved,
            },
          },
          loading: loadingState,
          error: null,
        };
      }
      return { data: null, loading: false, error: null };
    });

    // Render hook with empty initial state
    const { result, rerender } = renderHook(() => useGetInvestors(mockAsset));

    // Start fetching
    act(() => {
      result.current.initFetchInvestors();
    });

    // Now simulate that loading has finished
    loadingState = false;

    // Re-render to trigger the effect that depends on loading state
    rerender();

    // Check that the initialization happened correctly
    expect(mocks.useEventsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          qualifiedName: 'test-namespace.test-contract.IDENTITY-REGISTERED',
        }),
        skip: false,
      }),
    );

    // Verify data is correct after loading is done
    expect(result.current.data).toEqual(expectedRecords);
  });

  it('handles loading state correctly', () => {
    // Start with loading state for queries
    let isLoading = true;

    // Set up the loading state mock
    mocks.useEventsQuery.mockImplementation(() => ({
      data: isLoading ? null : { events: { edges: [] } },
      loading: isLoading,
      error: null,
    }));

    const { result, rerender } = renderHook(() => useGetInvestors(mockAsset));

    // Start fetching
    act(() => {
      result.current.initFetchInvestors();
    });

    // Loading should be true initially
    expect(result.current.isLoading).toBe(true);

    // Change loading state in the mock
    isLoading = false;

    // Re-render to reflect the updated mock
    act(() => {
      rerender();
    });

    // Loading state should now be false
    expect(result.current.isLoading).toBe(false);
  });

  it('handles error state correctly', () => {
    const testError = new Error('Test error');

    // Set error state for queries
    mocks.useEventsQuery.mockImplementation(() => ({
      data: null,
      loading: false,
      error: testError,
    }));

    const { result } = renderHook(() => useGetInvestors(mockAsset));

    // Start fetching
    act(() => {
      result.current.initFetchInvestors();
    });

    // Error should be directly accessible
    expect(result.current.error).toBe(testError);
  });
});
