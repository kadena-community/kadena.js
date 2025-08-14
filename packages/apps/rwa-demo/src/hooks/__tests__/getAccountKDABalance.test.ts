import { useEventSubscriptionFilteredSubscription } from '@/__generated__/sdk';
import { accountKDABalance } from '@/services/accountKDABalance';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useGetAccountKDABalance } from '../getAccountKDABalance';

// Mock the dependencies
vi.mock('@/services/accountKDABalance', () => ({
  accountKDABalance: vi.fn(),
}));

// This is needed because the hook is destructuring the return value
vi.mock('@/__generated__/sdk', () => ({
  useEventSubscriptionFilteredSubscription: vi.fn(),
}));

describe('useGetAccountKDABalance', () => {
  const mockAccountKDABalance = accountKDABalance as unknown as ReturnType<
    typeof vi.fn
  >;
  const mockSubscriptionData =
    useEventSubscriptionFilteredSubscription as unknown as ReturnType<
      typeof vi.fn
    >;
  const testAccountAddress = 'test-account-address';
  const initialBalance = 100;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAccountKDABalance.mockResolvedValue(initialBalance);
    // Default mock for subscription
    mockSubscriptionData.mockReturnValue({
      data: null,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return 0 and not mounted when no account address is provided', () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useGetAccountKDABalance({ accountAddress: undefined }),
    );

    // Assert
    expect(result.current.data).toBe(0);
    expect(result.current.isMounted).toBe(false);
    expect(mockAccountKDABalance).not.toHaveBeenCalled();
  });

  it('should initially return 0 and not mounted when an account address is provided', () => {
    // This test only checks initial state, not the effect
    const { result } = renderHook(() =>
      useGetAccountKDABalance({ accountAddress: testAccountAddress }),
    );

    // Assert initial state
    expect(result.current.data).toBe(0);
    expect(result.current.isMounted).toBe(false);
    // The effect will run in the background, but we're not waiting for it
  });

  it('should call accountKDABalance when account address is provided', async () => {
    // Setup mock implementation
    vi.useFakeTimers();

    // Arrange & Act
    const { result } = renderHook(() =>
      useGetAccountKDABalance({ accountAddress: testAccountAddress }),
    );
    expect(result.current.data).toBe(0);
    // Advance timers to trigger useEffect
    vi.runAllTimers();

    // Give a chance for promises to resolve
    await vi.runAllTimersAsync();

    // Assert
    expect(mockAccountKDABalance).toHaveBeenCalled();
    expect(mockAccountKDABalance.mock.calls[0][0]).toEqual({
      accountName: testAccountAddress,
    });

    // Capture the promise (adjust index if multiple calls)
    const balancePromise = mockAccountKDABalance.mock.results[0].value;

    await act(async () => balancePromise);

    expect(result.current.data).toBe(100);
    // Cleanup
    vi.useRealTimers();
  });

  describe('formatData function (via subscription events)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should increase balance when account receives a transfer', async () => {
      const transferAmount = 50;
      const mockEventData = {
        events: [
          {
            parameters: JSON.stringify([
              'sender-account',
              testAccountAddress,
              transferAmount,
            ]),
          },
        ],
      };

      // Start with subscription returning null
      mockSubscriptionData.mockReturnValue({ data: null });

      const { result, rerender } = renderHook(() =>
        useGetAccountKDABalance({ accountAddress: testAccountAddress }),
      );

      const balancePromiseInit = mockAccountKDABalance.mock.results[0].value;

      // Wait for the async effect to complete
      await act(async () => balancePromiseInit);

      // Wait for initial balance to load
      vi.runAllTimers();
      await vi.runAllTimersAsync();
      expect(result.current.data).toBe(initialBalance);

      // Now simulate receiving transfer event
      mockSubscriptionData.mockReturnValue({ data: mockEventData });
      rerender();

      expect(result.current.data).toBe(initialBalance + transferAmount);
    });

    it('should decrease balance when account sends a transfer', async () => {
      const transferAmount = 30;
      const mockEventData = {
        events: [
          {
            parameters: JSON.stringify([
              testAccountAddress,
              'recipient-account',
              transferAmount,
            ]),
          },
        ],
      };

      mockSubscriptionData.mockReturnValue({ data: null });

      const { result, rerender } = renderHook(() =>
        useGetAccountKDABalance({ accountAddress: testAccountAddress }),
      );

      const balancePromiseInit = mockAccountKDABalance.mock.results[0].value;

      // Wait for the async effect to complete
      await act(async () => balancePromiseInit);

      // Wait for initial balance to load
      vi.runAllTimers();
      await vi.runAllTimersAsync();
      expect(result.current.data).toBe(initialBalance);

      // Now simulate sending transfer event
      mockSubscriptionData.mockReturnValue({ data: mockEventData });
      rerender();

      expect(result.current.data).toBe(initialBalance - transferAmount);
    });

    it('should handle multiple events in a single subscription update', async () => {
      const mockEventData = {
        events: [
          {
            // Receiving 50
            parameters: JSON.stringify(['sender1', testAccountAddress, 50]),
          },
          {
            // Sending 20
            parameters: JSON.stringify([testAccountAddress, 'recipient1', 20]),
          },
          {
            // Receiving 10
            parameters: JSON.stringify(['sender2', testAccountAddress, 10]),
          },
        ],
      };

      mockSubscriptionData.mockReturnValue({ data: null });

      const { result, rerender } = renderHook(() =>
        useGetAccountKDABalance({ accountAddress: testAccountAddress }),
      );

      const balancePromiseInit = mockAccountKDABalance.mock.results[0].value;

      // Wait for the async effect to complete
      await act(async () => balancePromiseInit);

      // Wait for initial balance to load
      vi.runAllTimers();
      await vi.runAllTimersAsync();
      expect(result.current.data).toBe(initialBalance);

      // Process multiple events
      mockSubscriptionData.mockReturnValue({ data: mockEventData });
      rerender();

      // Should be: 100 + 50 - 20 + 10 = 140
      expect(result.current.data).toBe(140);
    });

    it('should ignore events without amount parameter', async () => {
      const mockEventData = {
        events: [
          {
            // Missing amount parameter
            parameters: JSON.stringify(['sender', 'recipient']),
          },
          {
            // Valid event
            parameters: JSON.stringify(['sender', testAccountAddress, 25]),
          },
        ],
      };

      mockSubscriptionData.mockReturnValue({ data: null });

      const { result, rerender } = renderHook(() =>
        useGetAccountKDABalance({ accountAddress: testAccountAddress }),
      );

      const balancePromiseInit = mockAccountKDABalance.mock.results[0].value;

      // Wait for the async effect to complete
      await act(async () => balancePromiseInit);

      // Wait for initial balance to load
      vi.runAllTimers();
      await vi.runAllTimersAsync();
      expect(result.current.data).toBe(initialBalance);

      // Process events
      mockSubscriptionData.mockReturnValue({ data: mockEventData });
      rerender();

      // Should only process the valid event
      expect(result.current.data).toBe(initialBalance + 25);
    });

    it('should ignore events when account is not involved', async () => {
      const mockEventData = {
        events: [
          {
            parameters: JSON.stringify([
              'other-sender',
              'other-recipient',
              100,
            ]),
          },
        ],
      };

      mockSubscriptionData.mockReturnValue({ data: null });

      const { result, rerender } = renderHook(() =>
        useGetAccountKDABalance({ accountAddress: testAccountAddress }),
      );

      const balancePromiseInit = mockAccountKDABalance.mock.results[0].value;

      // Wait for the async effect to complete
      await act(async () => balancePromiseInit);

      // Wait for initial balance to load
      vi.runAllTimers();
      await vi.runAllTimersAsync();
      expect(result.current.data).toBe(initialBalance);

      // Process event that doesn't involve our account
      mockSubscriptionData.mockReturnValue({ data: mockEventData });
      rerender();

      // Balance should remain unchanged
      expect(result.current.data).toBe(initialBalance);
    });

    it('should handle events with invalid JSON parameters gracefully', async () => {
      const mockEventData = {
        events: [
          {
            parameters: 'invalid-json',
          },
          {
            // Valid event after invalid one
            parameters: JSON.stringify(['sender', testAccountAddress, 15]),
          },
        ],
      };

      const { result, rerender } = renderHook(() =>
        useGetAccountKDABalance({ accountAddress: testAccountAddress }),
      );

      mockSubscriptionData.mockReturnValue({ data: null });
      const balancePromiseInit = mockAccountKDABalance.mock.results[0].value;

      // Wait for the async effect to complete
      await act(async () => balancePromiseInit);

      // Wait for initial balance to load
      vi.runAllTimers();
      await vi.runAllTimersAsync();
      expect(result.current.data).toBe(initialBalance);

      // Process events with invalid JSON
      mockSubscriptionData.mockReturnValue({ data: mockEventData });
      // Capture the promise (adjust index if multiple calls)
      const balancePromise = mockSubscriptionData.mock.results[0].value;

      // Wait for the async effect to complete
      await act(async () => balancePromise);

      rerender();

      // Should process only the valid event (the hook should handle JSON parse errors)
      expect(result.current.data).toBe(initialBalance + 15);
    });
  });
});
