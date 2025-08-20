import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { isPaused } from '@/services/isPaused';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from '../account';
import { usePaused } from '../paused';

// Mock dependencies
vi.mock('../account', () => ({
  useAccount: vi.fn(),
}));

vi.mock('@/services/isPaused', () => ({
  isPaused: vi.fn(),
}));

vi.mock('@/__generated__/sdk', () => ({
  useEventSubscriptionSubscription: vi.fn(),
}));

describe('usePaused', () => {
  // Mock account
  const mockAccount = { address: 'test-address' };

  // Create a mock asset that matches the IAsset interface
  const mockAsset: IAsset = {
    uuid: 'test-uuid',
    contractName: 'test-contract',
    namespace: 'test-namespace',
    supply: 1000,
    investorCount: 10,
    compliance: {
      maxSupply: {
        key: 'supply-limit-compliance-v1',
        isActive: true,
        value: 10000,
      },
      maxBalance: {
        key: 'max-balance-compliance-v1',
        isActive: true,
        value: 1000,
      },
      maxInvestors: {
        key: 'max-investors-compliance-v1',
        isActive: true,
        value: 100,
      },
    },
  };

  // Setup mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers(); // Enable fake timers for all tests

    // Mock useAccount hook
    (useAccount as Mock).mockReturnValue({
      account: mockAccount,
    });

    // Mock isPaused service
    (isPaused as Mock).mockResolvedValue(true);

    // Mock GraphQL subscriptions with default empty arrays
    (useEventSubscriptionSubscription as Mock).mockImplementation(() => {
      return {
        data: {
          events: [],
        },
        loading: false,
        error: null,
      };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.useRealTimers(); // Restore real timers after each test
  });

  it('should initialize with paused state as true', () => {
    const { result } = renderHook(() => usePaused(mockAsset));

    expect(result.current.paused).toBe(true);
  });

  it('should call isPaused with correct parameters', async () => {
    renderHook(() => usePaused(mockAsset));

    // Advance timers to trigger the effect
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(isPaused).toHaveBeenCalledWith({ account: mockAccount }, mockAsset);
  });

  it('should update paused state based on isPaused result', async () => {
    // Mock isPaused to return false
    (isPaused as Mock).mockResolvedValue(false);

    const { result } = renderHook(() => usePaused(mockAsset));

    // Initial state should be true
    expect(result.current.paused).toBe(true);

    // Run effect and wait for state update
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // State should be updated to false
    expect(result.current.paused).toBe(false);
  });

  it('should not call isPaused if account is missing', async () => {
    // Mock useAccount to return no account
    (useAccount as Mock).mockReturnValue({ account: null });

    renderHook(() => usePaused(mockAsset));

    // Advance timers to trigger the effect
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(isPaused).not.toHaveBeenCalled();
  });

  it('should not call isPaused if asset is missing', async () => {
    renderHook(() => usePaused(undefined));

    // Advance timers to trigger the effect
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(isPaused).not.toHaveBeenCalled();
  });

  it('should update paused state to false when unpaused event is received', async () => {
    // Start with no events
    let unpausedEvents: Array<{
      __typename: 'Event';
      parameters: string | null;
    }> = [];

    // Mock the subscription to use our controllable events array
    (useEventSubscriptionSubscription as Mock).mockImplementation(
      ({ variables }) => {
        const qualifiedName = variables?.qualifiedName || '';

        if (qualifiedName.endsWith('.UNPAUSED')) {
          return { data: { events: unpausedEvents } };
        }

        return { data: { events: [] } };
      },
    );

    const { result, rerender } = renderHook(() => usePaused(mockAsset));

    // Initial state should be true
    expect(result.current.paused).toBe(true);

    // Run the initial isPaused effect
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Update our events array to trigger the subscription update
    unpausedEvents = [
      {
        __typename: 'Event',
        parameters: JSON.stringify({ id: '1' }),
      },
    ];

    // Force a re-render to simulate the GraphQL subscription receiving data
    await act(async () => {
      rerender();
      // Wait for state updates to propagate
      await vi.advanceTimersByTimeAsync(10);
    });

    // State should be updated to false
    expect(result.current.paused).toBe(false);
  });

  it('should update paused state to true when paused event is received', async () => {
    // Mock isPaused to return false initially
    (isPaused as Mock).mockResolvedValue(false);

    // Start with no events
    let pausedEvents: Array<{
      __typename: 'Event';
      parameters: string | null;
    }> = [];

    // Mock the subscription to use our controllable events array
    (useEventSubscriptionSubscription as Mock).mockImplementation(
      ({ variables }) => {
        const qualifiedName = variables?.qualifiedName || '';

        if (qualifiedName.endsWith('.PAUSED')) {
          return { data: { events: pausedEvents } };
        }

        return { data: { events: [] } };
      },
    );

    const { result, rerender } = renderHook(() => usePaused(mockAsset));

    // Let the isPaused effect run and set the state to false
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.paused).toBe(false);

    // Update our events array to trigger the subscription update
    pausedEvents = [
      {
        __typename: 'Event',
        parameters: JSON.stringify({ id: '1' }),
      },
    ];

    // Force a re-render to simulate the GraphQL subscription receiving data
    await act(async () => {
      rerender();
      // Wait for state updates to propagate
      await vi.advanceTimersByTimeAsync(10);
    });

    // State should be updated to true
    expect(result.current.paused).toBe(true);
  });
});
