import { accountKDABalance } from '@/services/accountKDABalance';
import { renderHook } from '@testing-library/react-hooks';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useGetAccountKDABalance } from '../getAccountKDABalance';

// Mock the dependencies
vi.mock('@/services/accountKDABalance', () => ({
  accountKDABalance: vi.fn(),
}));

// This is needed because the hook is destructuring the return value
vi.mock('@/__generated__/sdk', () => ({
  useEventSubscriptionFilteredSubscription: () => ({
    data: null,
  }),
}));

describe('useGetAccountKDABalance', () => {
  const mockAccountKDABalance = accountKDABalance as unknown as ReturnType<
    typeof vi.fn
  >;
  const testAccountAddress = 'test-account-address';
  const initialBalance = 100;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAccountKDABalance.mockResolvedValue(initialBalance);
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

    expect(result.current.data).toBe(100);
    // Cleanup
    vi.useRealTimers();
  });
});
