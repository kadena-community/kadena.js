import { renderHook } from '@testing-library/react-hooks';
import { useInvestorTransactions } from '../investorTransactions';

describe('useInvestorTransactions hook', () => {
  const mockFromData = {
    events: {
      edges: [
        {
          node: {
            parameterText: JSON.stringify([
              100,
              { account: 'k:test-investor' },
              { account: 'k:another-account' },
            ]),
            requestKey: 'req-key-1',
            block: { creationTime: 1623456789 },
          },
        },
      ],
    },
  };

  const mockToData = {
    events: {
      edges: [
        {
          node: {
            parameterText: JSON.stringify([
              50,
              { account: 'k:another-account' },
              { account: 'k:test-investor' },
            ]),
            requestKey: 'req-key-2',
            block: { creationTime: 1623456790 },
          },
        },
      ],
    },
  };

  const mocksHook = vi.hoisted(() => {
    return {
      useAsset: vi.fn().mockReturnValue({
        asset: { namespace: 'test', contractName: 'rwa' },
      }),
      getAsset: vi.fn().mockReturnValue('test.rwa'),
      useInvestorTransfersEventsQuery: vi.fn().mockImplementation((options) => {
        const parametersFilter = options?.variables?.parametersFilter || '';
        if (parametersFilter.includes('"1", "account"')) {
          return {
            data: mockFromData,
          };
        } else {
          return {
            data: mockToData,
          };
        }
      }),
    };
  });

  const investorAccount = 'k:test-investor';
  const mockedAsset = { namespace: 'test', contractName: 'rwa' };
  const investorAccount = 'k:test-investor';
  const assetQualifiedName = 'test.rwa.RECONCILE';

  // Mock data setup
  const mockFromData = {
    events: {
      edges: [
        {
          node: {
            parameterText: JSON.stringify([
              100,
              { account: 'k:test-investor' },
              { account: 'k:another-account' },
            ]),
            requestKey: 'req-key-1',
            block: { creationTime: 1623456789 },
          },
        },
      ],
    },
  };

  const mockToData = {
    events: {
      edges: [
        {
          node: {
            parameterText: JSON.stringify([
              50,
              { account: 'k:another-account' },
              { account: 'k:test-investor' },
            ]),
            requestKey: 'req-key-2',
            block: { creationTime: 1623456790 },
          },
        },
      ],
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    vi.mock('../asset', async () => {
      const actual = await vi.importActual('../asset');
      return {
        ...actual,
        useAsset: mocksHook.useAsset,
      };
    });

    vi.mock('@/utils/getAsset', async () => {
      const actual = await vi.importActual('@/utils/getAsset');
      return {
        ...actual,
        getAsset: mocksHook.getAsset,
      };
    });

    vi.mock('@/__generated__/sdk', async () => {
      const actual = await vi.importActual('@/__generated__/sdk');
      return {
        ...actual,
        useInvestorTransfersEventsQuery:
          mocksHook.useInvestorTransfersEventsQuery,
      };
    });
  });

  test('should initialize with loading state and empty data', () => {
    const { result } = renderHook(() =>
      useInvestorTransactions({ investorAccount }),
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
  });

  test('should make correct GraphQL queries with proper parameters', () => {
    renderHook(() => useInvestorTransactions({ investorAccount }));

    expect(useInvestorTransfersEventsQuery).toHaveBeenCalledTimes(2);
    expect(useInvestorTransfersEventsQuery).toHaveBeenCalledWith({
      variables: {
        qualifiedName: `${assetQualifiedName.slice(0, -10)}.RECONCILE`,
        parametersFilter: `{\"path\": [\"1\", \"account\"] ,\"string_contains\":\"${investorAccount}\"}`,
      },
    });
    expect(useInvestorTransfersEventsQuery).toHaveBeenCalledWith({
      variables: {
        qualifiedName: `${assetQualifiedName.slice(0, -10)}.RECONCILE`,
        parametersFilter: `{\"path\": [\"2\", \"account\"] ,\"string_contains\":\"${investorAccount}\"}`,
      },
    });
  });

  test('should process outgoing transfers (fromAccount === investorAccount)', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useInvestorTransactions({ investorAccount }),
    );

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toContainEqual({
      amount: -100, // Negative since this is an outgoing transfer
      fromAccount: 'k:test-investor',
      toAccount: 'k:another-account',
      requestKey: 'req-key-1',
      creationTime: 1623456789,
    });
  });

  test('should process incoming transfers (toAccount === investorAccount)', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useInvestorTransactions({ investorAccount }),
    );

    await waitForNextUpdate();

    expect(result.current.data).toContainEqual({
      amount: 50, // Positive since this is an incoming transfer
      fromAccount: 'k:another-account',
      toAccount: 'k:test-investor',
      requestKey: 'req-key-2',
      creationTime: 1623456790,
    });
  });

  test('should not add duplicate transactions based on requestKey', async () => {
    // Mock a duplicate transaction in both from and to data
    const duplicateData = {
      events: {
        edges: [
          {
            node: {
              parameterText: JSON.stringify([
                100,
                { account: 'k:test-investor' },
                { account: 'k:another-account' },
              ]),
              requestKey: 'req-key-1', // Same requestKey as one that's already included
              block: { creationTime: 1623456789 },
            },
          },
        ],
      },
    };

    (useInvestorTransfersEventsQuery as jest.Mock).mockImplementation(
      ({ variables }) => {
        if (variables.parametersFilter.includes('"1", "account"')) {
          return { data: mockFromData };
        } else {
          return { data: duplicateData };
        }
      },
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useInvestorTransactions({ investorAccount }),
    );

    await waitForNextUpdate();

    // Verify only unique transactions are stored
    const transactionCount = result.current.data.filter(
      (item) => item.requestKey === 'req-key-1',
    ).length;

    expect(transactionCount).toBe(1);
    expect(result.current.data.length).toBe(1);
  });

  test('should handle empty or invalid data gracefully', () => {
    // Mock empty data responses
    (useInvestorTransfersEventsQuery as jest.Mock).mockReturnValue({
      data: null,
    });

    const { result } = renderHook(() =>
      useInvestorTransactions({ investorAccount }),
    );

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(true);
  });
});
