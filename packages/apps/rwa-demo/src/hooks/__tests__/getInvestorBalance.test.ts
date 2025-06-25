import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import { getInvestorBalance } from '@/services/getInvestorBalance';
import { getAsset } from '@/utils/getAsset';
import { renderHook, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';
import { useAsset } from '../asset';
import { useGetInvestorBalance } from '../getInvestorBalance';

// Mock dependencies
vi.mock('../asset', () => ({
  useAsset: vi.fn(),
}));

vi.mock('@/__generated__/sdk', () => ({
  useEventSubscriptionSubscription: vi.fn(),
}));

vi.mock('@/services/getInvestorBalance', () => ({
  getInvestorBalance: vi.fn(),
}));

vi.mock('@/utils/getAsset', () => ({
  getAsset: vi.fn(),
}));

const mockAsset = {
  uuid: 'test-uuid',
  contractName: 'test-contract',
  namespace: 'test-namespace',
  supply: 1000000,
  investorCount: 5,
  compliance: {
    maxSupply: {
      key: 'supply-limit-compliance-v1',
      isActive: true,
      value: 1000000,
    },
    maxBalance: {
      key: 'max-balance-compliance-v1',
      isActive: true,
      value: 100000,
    },
    maxInvestors: {
      key: 'max-investors-compliance-v1',
      isActive: true,
      value: 100,
    },
  },
};

describe('useGetInvestorBalance', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    (useAsset as Mock).mockReturnValue({ asset: mockAsset });
    (getAsset as Mock).mockReturnValue('test-namespace.test-contract');
    (useEventSubscriptionSubscription as Mock).mockReturnValue({
      data: null,
    });
    (getInvestorBalance as Mock).mockResolvedValue(1000);
  });

  it('should return initial state', () => {
    const { result } = renderHook(() =>
      useGetInvestorBalance({ investorAccount: 'test-account' }),
    );

    expect(result.current).toEqual({
      data: 0,
      isPending: true, // Initially set to true when the effect runs
    });
  });

  it('should fetch investor balance when investor account and asset are provided', async () => {
    const { result } = renderHook(() =>
      useGetInvestorBalance({ investorAccount: 'test-account' }),
    );

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(getInvestorBalance).toHaveBeenCalledWith(
      {
        investorAccount: 'test-account',
      },
      mockAsset,
    );

    expect(result.current).toEqual({
      data: 1000,
      isPending: false,
    });
  });

  it('should not fetch investor balance when investor account is not provided', () => {
    renderHook(() => useGetInvestorBalance({}));

    expect(getInvestorBalance).not.toHaveBeenCalled();
  });

  it('should not fetch investor balance when asset is not provided', () => {
    (useAsset as Mock).mockReturnValue({ asset: undefined });

    renderHook(() =>
      useGetInvestorBalance({ investorAccount: 'test-account' }),
    );

    expect(getInvestorBalance).not.toHaveBeenCalled();
  });

  it('should update balance when subscription data is received for sender', async () => {
    // Set up initial mock for subscription data (null)
    (useEventSubscriptionSubscription as Mock).mockReturnValue({
      data: null,
    });

    const { result, rerender } = renderHook(() =>
      useGetInvestorBalance({ investorAccount: 'test-account' }),
    );

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
    expect(result.current.data).toBe(1000);

    // Update the mock to return subscription data with events
    (useEventSubscriptionSubscription as Mock).mockReturnValue({
      data: {
        events: [
          {
            parameters: JSON.stringify([
              'param1',
              { account: 'test-account', current: 800 },
              { account: 'other-account', current: 200 },
            ]),
          },
        ],
      },
    });

    // Rerender to get updated data from the subscription
    rerender();

    // Now the data should be updated
    expect(result.current.data).toBe(800);
  });

  it('should update balance when subscription data is received for receiver', async () => {
    // Set up initial mock for subscription data (null)
    (useEventSubscriptionSubscription as Mock).mockReturnValue({
      data: null,
    });

    const { result, rerender } = renderHook(() =>
      useGetInvestorBalance({ investorAccount: 'test-account' }),
    );

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
    expect(result.current.data).toBe(1000);

    // Update the mock to return subscription data with events
    (useEventSubscriptionSubscription as Mock).mockReturnValue({
      data: {
        events: [
          {
            parameters: JSON.stringify([
              'param1',
              { account: 'other-account', current: 700 },
              { account: 'test-account', current: 1200 },
            ]),
          },
        ],
      },
    });

    // Rerender to get updated data from the subscription
    rerender();

    // Now the data should be updated
    expect(result.current.data).toBe(1200);
  });

  it('should handle both sender and receiver updates in subscription data', async () => {
    // Set up initial mock for subscription data (null)
    (useEventSubscriptionSubscription as Mock).mockReturnValue({
      data: null,
    });

    const { result, rerender } = renderHook(() =>
      useGetInvestorBalance({ investorAccount: 'test-account' }),
    );

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
    expect(result.current.data).toBe(1000);

    // Update the mock to return subscription data with multiple events
    (useEventSubscriptionSubscription as Mock).mockReturnValue({
      data: {
        events: [
          {
            parameters: JSON.stringify([
              'param1',
              { account: 'test-account', current: 800 },
              { account: 'other-account', current: 200 },
            ]),
          },
          {
            parameters: JSON.stringify([
              'param1',
              { account: 'other-account', current: 250 },
              { account: 'test-account', current: 1200 },
            ]),
          },
        ],
      },
    });

    // Rerender to get updated data from the subscription
    rerender();

    // The last update should be the current value
    expect(result.current.data).toBe(1200);
  });

  it('should do nothing if subscription event data is malformed', async () => {
    // Set up initial mock for subscription data (null)
    (useEventSubscriptionSubscription as Mock).mockReturnValue({
      data: null,
    });

    const { result, rerender } = renderHook(() =>
      useGetInvestorBalance({ investorAccount: 'test-account' }),
    );

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    // Initial balance after API call
    expect(result.current.data).toBe(1000);

    // Update the mock to return subscription data with malformed event
    (useEventSubscriptionSubscription as Mock).mockReturnValue({
      data: {
        events: [
          {
            parameters: JSON.stringify(['param1']), // Missing account data
          },
        ],
      },
    });

    // Rerender to trigger the subscription useEffect
    rerender();

    // The balance should remain unchanged
    expect(result.current.data).toBe(1000);
  });

  it('should subscribe to the correct event using getAsset', () => {
    renderHook(() =>
      useGetInvestorBalance({ investorAccount: 'test-account' }),
    );

    expect(getAsset).toHaveBeenCalledWith(mockAsset);
    expect(useEventSubscriptionSubscription).toHaveBeenCalledWith({
      variables: {
        qualifiedName: 'test-namespace.test-contract.RECONCILE',
      },
    });
  });
});
