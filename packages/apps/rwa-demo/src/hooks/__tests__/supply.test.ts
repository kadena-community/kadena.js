import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IAccountContext } from '@/contexts/AccountContext/AccountContext';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IComplianceProps } from '@/services/getComplianceRules';
import { supply } from '@/services/supply';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import type { MockedFunction } from 'vitest';
import { useAccount } from '../account';
import { useSupply } from '../supply';

vi.useFakeTimers();

// Mock the dependencies
vi.mock('@/services/supply', () => ({
  supply: vi.fn(),
}));

vi.mock('@/__generated__/sdk', () => ({
  useEventSubscriptionSubscription: vi.fn(),
}));

vi.mock('../account', () => ({
  useAccount: vi.fn(),
}));

vi.mock('@/utils/getAsset', () => ({
  getAsset: vi.fn((asset) =>
    asset ? `${asset.namespace}.${asset.contractName}` : '',
  ),
}));

describe('useSupply', () => {
  const mockAccount = {
    address: 'k:test123',
    publicKey: 'test-public-key',
    chainId: '1',
    networkId: 'testnet04',
  };

  const mockAsset: IAsset = {
    uuid: '123',
    namespace: 'free',
    contractName: 'token',
    supply: 1000,
    investorCount: 10,
    compliance: {} as IComplianceProps,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    vi.mocked(useAccount).mockReturnValue({
      account: mockAccount,
    } as unknown as IAccountContext);

    vi.mocked(useEventSubscriptionSubscription).mockReturnValue({
      data: undefined,
      loading: false,
    } as unknown as ReturnType<typeof useEventSubscriptionSubscription>);

    vi.mocked(supply).mockResolvedValue(1000);
  });

  it('should initialize with data as 0', () => {
    const { result } = renderHook(() => useSupply());
    expect(result.current.data).toBe(0);
  });

  it('should not call supply when no asset is provided', () => {
    renderHook(() => useSupply());
    expect(supply).not.toHaveBeenCalled();
  });

  it('should not call supply when no account is available', () => {
    // Mock account as undefined
    vi.mocked(useAccount).mockReturnValue({
      account: undefined,
    } as unknown as IAccountContext);

    renderHook(() => useSupply(mockAsset));
    expect(supply).not.toHaveBeenCalled();
  });

  it('should call supply with correct arguments and update data when both account and asset are present', async () => {
    const { result } = renderHook(() => useSupply(mockAsset));

    // Initially data should be 0
    expect(result.current.data).toBe(0);

    expect(supply).toHaveBeenCalledWith({ account: mockAccount }, mockAsset);

    // Capture the promise (adjust index if multiple calls)
    const supplyPromise = (supply as MockedFunction<typeof supply>).mock
      .results[0].value;

    // Wait for the async effect to complete
    await act(async () => supplyPromise);
    expect(result.current.data).toBe(1000);
  });

  it('should not update data if supply returns non-numeric value', async () => {
    // Mock supply to return a non-numeric value
    vi.mocked(supply).mockResolvedValue(undefined);

    const { result } = renderHook(() => useSupply(mockAsset));

    // Initially data should be 0
    expect(result.current.data).toBe(0);

    // Wait for any pending promises
    await vi.runAllTimersAsync();

    // Data should still be 0
    expect(result.current.data).toBe(0);
  });

  it('should update data when receiving subscription events', async () => {
    // Initial setup
    const { result, rerender } = renderHook(() => useSupply(mockAsset));

    // Simulate a subscription update
    const subscriptionData = {
      events: [
        {
          parameters: JSON.stringify([2000]),
        },
      ],
    };

    vi.mocked(useEventSubscriptionSubscription).mockReturnValue({
      data: subscriptionData,
      loading: false,
    } as unknown as ReturnType<typeof useEventSubscriptionSubscription>);

    // Trigger a re-render to process the subscription data
    rerender();

    // Data should be updated with the event value
    expect(result.current.data).toBe(2000);
  });

  it('should not update data when subscription data is empty', () => {
    const { result, rerender } = renderHook(() => useSupply(mockAsset));

    // Simulate empty subscription data
    vi.mocked(useEventSubscriptionSubscription).mockReturnValue({
      data: { events: [] },
      loading: false,
    } as unknown as ReturnType<typeof useEventSubscriptionSubscription>);

    rerender();

    // Data should not be changed
    expect(result.current.data).toBe(0);
  });

  it('should not update data when subscription data contains non-numeric value', () => {
    // Initial setup
    const { result, rerender } = renderHook(() => useSupply(mockAsset));

    // Simulate a subscription update with non-numeric data
    const subscriptionData = {
      events: [
        {
          parameters: JSON.stringify(['not-a-number']),
        },
      ],
    };

    vi.mocked(useEventSubscriptionSubscription).mockReturnValue({
      data: subscriptionData,
      loading: false,
    } as unknown as ReturnType<typeof useEventSubscriptionSubscription>);

    rerender();

    // Data should not be changed
    expect(result.current.data).toBe(0);
  });

  it('should call useEventSubscriptionSubscription with the correct qualified name', () => {
    renderHook(() => useSupply(mockAsset));

    expect(useEventSubscriptionSubscription).toHaveBeenCalledWith({
      variables: {
        qualifiedName: 'free.token.SUPPLY',
      },
    });
  });
});
