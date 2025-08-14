import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useInvestorTransactions } from '../investorTransactions';

// Create hoisted mocks
const mocks = vi.hoisted(() => ({
  useInvestorTransfersEventsQuery: vi.fn(),
  getAsset: vi.fn((asset) => {
    if (asset?.contractName === 'test-asset') {
      return 'free.test-asset';
    }
    return 'default-asset';
  }),
  useAsset: vi.fn(),
}));

// Mock the imported dependencies
vi.mock('@/__generated__/sdk', () => ({
  useInvestorTransfersEventsQuery: mocks.useInvestorTransfersEventsQuery,
}));

vi.mock('@/utils/getAsset', () => ({
  getAsset: mocks.getAsset,
}));

vi.mock('../asset', () => ({
  useAsset: mocks.useAsset,
}));

describe('useInvestorTransactions', () => {
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

  // Mock data for incoming transfers (to investor)
  const mockToData = {
    events: {
      edges: [
        {
          node: {
            block: {
              height: 100,
              creationTime: '2023-01-01T12:00:00Z',
            },
            requestKey: 'req-key-1',
            parameterText: JSON.stringify([
              50, // amount
              { account: 'sender1' }, // from
              { account: 'test-investor' }, // to
            ]),
          },
        },
      ],
    },
  };

  // Mock data for outgoing transfers (from investor)
  const mockFromData = {
    events: {
      edges: [
        {
          node: {
            block: {
              height: 101,
              creationTime: '2023-01-02T12:00:00Z',
            },
            requestKey: 'req-key-2',
            parameterText: JSON.stringify([
              30, // amount
              { account: 'test-investor' }, // from
              { account: 'receiver1' }, // to
            ]),
          },
        },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    mocks.useAsset.mockReturnValue({
      asset: mockAsset,
    });

    // Setup default query responses for to/from transfers
    mocks.useInvestorTransfersEventsQuery.mockImplementation(
      ({ variables }) => {
        // Determine which query we're handling based on the filter
        if (variables.parametersFilter.includes('"1", "account"')) {
          // This is the fromData query
          return {
            data: mockFromData,
          };
        } else {
          // This is the toData query
          return {
            data: mockToData,
          };
        }
      },
    );
  });

  it('should initialize with empty data array and loading state', () => {
    // Set queries to return no data initially
    mocks.useInvestorTransfersEventsQuery.mockReturnValue({
      data: null,
    });

    const { result } = renderHook(() =>
      useInvestorTransactions({ investorAccount: 'test-investor' }),
    );

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBeTruthy();
  });

  it('should process incoming transfers correctly', () => {
    // Mock only the "to" query with data
    mocks.useInvestorTransfersEventsQuery.mockImplementation(
      ({ variables }) => {
        if (variables.parametersFilter.includes('"2", "account"')) {
          return { data: mockToData };
        } else {
          return { data: { events: { edges: [] } } };
        }
      },
    );

    const { result } = renderHook(() =>
      useInvestorTransactions({ investorAccount: 'test-investor' }),
    );

    // Wait for effects to run
    act(() => {});

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0]).toEqual({
      amount: 50, // Positive for incoming
      fromAccount: 'sender1',
      toAccount: 'test-investor',
      requestKey: 'req-key-1',
      creationTime: '2023-01-01T12:00:00Z',
    });
  });

  it('should process outgoing transfers with negative amount', () => {
    // Mock only the "from" query with data
    mocks.useInvestorTransfersEventsQuery.mockImplementation(
      ({ variables }) => {
        if (variables.parametersFilter.includes('"1", "account"')) {
          return { data: mockFromData };
        } else {
          return { data: { events: { edges: [] } } };
        }
      },
    );

    const { result } = renderHook(() =>
      useInvestorTransactions({ investorAccount: 'test-investor' }),
    );

    // Wait for effects to run
    act(() => {});

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0]).toEqual({
      amount: -30, // Negative for outgoing
      fromAccount: 'test-investor',
      toAccount: 'receiver1',
      requestKey: 'req-key-2',
      creationTime: '2023-01-02T12:00:00Z',
    });
  });

  it('should handle both incoming and outgoing transfers', () => {
    // Mock both queries with data
    mocks.useInvestorTransfersEventsQuery.mockImplementation(
      ({ variables }) => {
        if (variables.parametersFilter.includes('"1", "account"')) {
          return { data: mockFromData };
        } else {
          return { data: mockToData };
        }
      },
    );

    const { result } = renderHook(() =>
      useInvestorTransactions({ investorAccount: 'test-investor' }),
    );

    // Wait for effects to run
    act(() => {});

    expect(result.current.data).toHaveLength(2);

    // Data should include both transactions
    const transactions = result.current.data;
    expect(transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          amount: 50,
          fromAccount: 'sender1',
          toAccount: 'test-investor',
          requestKey: 'req-key-1',
        }),
        expect.objectContaining({
          amount: -30,
          fromAccount: 'test-investor',
          toAccount: 'receiver1',
          requestKey: 'req-key-2',
        }),
      ]),
    );
  });

  it('should not duplicate transactions with the same requestKey', () => {
    // Create data with duplicate requestKey
    const duplicateMockData = {
      events: {
        edges: [
          {
            node: {
              block: {
                height: 100,
                creationTime: '2023-01-01T12:00:00Z',
              },
              requestKey: 'req-key-1', // Same as in mockToData
              parameterText: JSON.stringify([
                60,
                { account: 'another-sender' },
                { account: 'test-investor' },
              ]),
            },
          },
        ],
      },
    };

    // First return regular data, then in a subsequent render return duplicate data
    let count = 0;
    mocks.useInvestorTransfersEventsQuery.mockImplementation(
      ({ variables }) => {
        if (variables.parametersFilter.includes('"2", "account"')) {
          return count++ === 0
            ? { data: mockToData }
            : { data: duplicateMockData };
        } else {
          return { data: { events: { edges: [] } } };
        }
      },
    );

    const { result, rerender } = renderHook(() =>
      useInvestorTransactions({ investorAccount: 'test-investor' }),
    );

    // Initial render
    act(() => {});

    // Data should contain the first transaction
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].requestKey).toBe('req-key-1');
    expect(result.current.data[0].amount).toBe(50);

    // Trigger rerender with duplicate data
    rerender();
    act(() => {});

    // Should still have only one transaction with the original values
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].requestKey).toBe('req-key-1');
    expect(result.current.data[0].amount).toBe(50);
  });

  it('should set loading to false when fromData is loaded', () => {
    // Initial loading state
    mocks.useInvestorTransfersEventsQuery.mockReturnValue({
      data: null,
    });

    const { result, rerender } = renderHook(() =>
      useInvestorTransactions({ investorAccount: 'test-investor' }),
    );

    // Should start with loading true
    expect(result.current.loading).toBeTruthy();

    // Now return data for fromData query
    mocks.useInvestorTransfersEventsQuery.mockImplementation(
      ({ variables }) => {
        if (variables.parametersFilter.includes('"1", "account"')) {
          return { data: mockFromData };
        } else {
          return { data: null };
        }
      },
    );

    // Trigger rerender
    rerender();
    act(() => {});

    // Loading should be false now
    expect(result.current.loading).toBeFalsy();
  });

  it('should handle empty data gracefully', () => {
    // Mock empty data responses
    mocks.useInvestorTransfersEventsQuery.mockImplementation(() => ({
      data: { events: { edges: [] } },
    }));

    const { result } = renderHook(() =>
      useInvestorTransactions({ investorAccount: 'test-investor' }),
    );

    act(() => {});

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBeFalsy();
  });

  it('should correctly use getAsset with asset from useAsset', () => {
    // Render hook - we don't need to check the result here, just verify the mocks
    renderHook(() =>
      useInvestorTransactions({ investorAccount: 'test-investor' }),
    );

    act(() => {});

    // Verify getAsset was called with the correct asset
    expect(mocks.getAsset).toHaveBeenCalledWith(mockAsset);
    expect(mocks.useInvestorTransfersEventsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          qualifiedName: 'free.test-asset.RECONCILE',
        }),
      }),
    );
  });
});
