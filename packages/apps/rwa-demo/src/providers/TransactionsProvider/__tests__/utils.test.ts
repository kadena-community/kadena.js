import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getWalletConnection, sleep } from '../utils';

// Mock window.open, focus, blur, etc.
const mockOpen = vi.fn();
const mockFocus = vi.fn();
const mockBlur = vi.fn();
const mockClose = vi.fn();

// Mock window.addEventListener and removeEventListener
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

// Mock crypto.randomUUID
const mockRandomUUID = vi.fn(() => 'mock-uuid');

describe('TransactionsProvider/utils', () => {
  // Setup mocks before each test
  beforeEach(() => {
    // Save original implementations
    vi.stubGlobal('window', {
      ...window,
      open: mockOpen,
      focus: mockFocus,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    // Mock crypto.randomUUID
    vi.stubGlobal('crypto', {
      ...crypto,
      randomUUID: mockRandomUUID,
    });

    // Reset all mocks
    mockOpen.mockReset();
    mockFocus.mockReset();
    mockBlur.mockReset();
    mockClose.mockReset();
    mockAddEventListener.mockReset();
    mockRemoveEventListener.mockReset();
    mockRandomUUID.mockReset().mockReturnValue('mock-uuid');

    // Mock window.open to return a mock popup window
    mockOpen.mockImplementation(() => ({
      closed: false,
      focus: mockFocus,
      blur: mockBlur,
      close: mockClose,
      postMessage: vi.fn(),
      location: {
        href: '',
      },
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('sleep', () => {
    it('resolves after the specified time', async () => {
      // Mock setTimeout
      vi.useFakeTimers();

      const sleepPromise = sleep(500);

      // Fast-forward time
      vi.advanceTimersByTime(500);
      await sleepPromise;

      // Restore setTimeout
      vi.useRealTimers();

      // The promise should have resolved successfully
      expect(true).toBe(true);
    });
  });

  describe('getWalletConnection', () => {
    it('opens a new wallet window if none exists', async () => {
      // Setup mock response for message event
      const mockMessageEvent = {
        data: {
          id: 'mock-uuid',
          type: 'GET_STATUS',
        },
      };

      // Add event listener should call the handler with the mock event
      mockAddEventListener.mockImplementation((eventType, handler) => {
        setTimeout(() => handler(mockMessageEvent), 10);
      });

      const connection = await getWalletConnection();

      expect(mockOpen).toHaveBeenCalledWith(
        '',
        'Dev-Wallet',
        'width=800,height=800',
      );
      expect(connection).toHaveProperty('message');
      expect(connection).toHaveProperty('focus');
      expect(connection).toHaveProperty('close');
    });

    it('reuses existing wallet window if available', async () => {
      // First call to create a wallet window
      const mockWallet = {
        closed: false,
        focus: mockFocus,
        blur: mockBlur,
        close: mockClose,
        postMessage: vi.fn(),
        location: { href: '' },
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      };

      mockOpen.mockReturnValueOnce(mockWallet);

      // Setup mock response for message event
      const mockMessageEvent = {
        data: {
          id: 'mock-uuid',
          type: 'GET_STATUS',
        },
      };

      // Add event listener should call the handler with the mock event
      mockAddEventListener.mockImplementation((eventType, handler) => {
        setTimeout(() => handler(mockMessageEvent), 10);
      });

      // First call to create the wallet connection
      await getWalletConnection();

      // Reset mocks to verify second call
      mockOpen.mockReset();

      // Second call should reuse the existing window
      const connection = await getWalletConnection();

      // Window.open should not be called again
      expect(mockOpen).not.toHaveBeenCalled();
      expect(connection).toHaveProperty('message');
      expect(connection).toHaveProperty('focus');
      expect(connection).toHaveProperty('close');
    });

    it('throws error when popup is blocked', async () => {
      // Mock window.open to return null (popup blocked)
      mockOpen.mockReturnValueOnce(null);

      await expect(getWalletConnection()).rejects.toThrow('POPUP_BLOCKED');
    });

    it('handles timeout and retries when wallet is not ready', async () => {
      vi.useFakeTimers();

      const mockWallet = {
        closed: false,
        focus: mockFocus,
        blur: mockBlur,
        close: mockClose,
        postMessage: vi.fn(),
        location: { href: '' },
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      };

      mockOpen.mockReturnValueOnce(mockWallet);

      let callCount = 0;
      mockAddEventListener.mockImplementation((eventType, handler) => {
        // First call times out, second call succeeds
        if (callCount === 0) {
          // Don't respond to simulate timeout
          callCount++;
        } else {
          // Respond with success
          setTimeout(
            () =>
              handler({
                data: {
                  id: 'mock-uuid',
                  type: 'GET_STATUS',
                },
              }),
            10,
          );
        }
      });

      const connectionPromise = getWalletConnection();

      // Fast forward through the first timeout (300ms)
      await vi.advanceTimersByTimeAsync(350);

      // Fast forward through the retry attempt
      await vi.advanceTimersByTimeAsync(350);

      const connection = await connectionPromise;

      expect(connection).toHaveProperty('message');
      expect(mockWallet.location.href).toBe('');

      vi.useRealTimers();
    });

    it('opens wallet window with custom page parameter', async () => {
      const mockWallet = {
        closed: false,
        focus: mockFocus,
        blur: mockBlur,
        close: mockClose,
        postMessage: vi.fn(),
        location: { href: '' },
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      };

      mockOpen.mockReturnValueOnce(mockWallet);

      const mockMessageEvent = {
        data: {
          id: 'mock-uuid',
          type: 'GET_STATUS',
        },
      };

      mockAddEventListener.mockImplementation((eventType, handler) => {
        setTimeout(() => handler(mockMessageEvent), 10);
      });

      await getWalletConnection('/custom-page');

      expect(mockOpen).toHaveBeenCalledWith(
        '/custom-page',
        'Dev-Wallet',
        'width=800,height=800',
      );
    });

    it('handles wallet window being closed during operation', async () => {
      const mockWallet = {
        closed: true, // Wallet window is closed
        focus: mockFocus,
        blur: mockBlur,
        close: mockClose,
        postMessage: vi.fn(),
        location: { href: '' },
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      };

      // First call creates a closed wallet
      mockOpen.mockReturnValueOnce(mockWallet);

      const mockMessageEvent = {
        data: {
          id: 'mock-uuid',
          type: 'GET_STATUS',
        },
      };

      mockAddEventListener.mockImplementation((eventType, handler) => {
        setTimeout(() => handler(mockMessageEvent), 10);
      });

      // First call
      await getWalletConnection();

      // Create a new open wallet for the second call
      const mockNewWallet = {
        closed: false,
        focus: mockFocus,
        blur: mockBlur,
        close: mockClose,
        postMessage: vi.fn(),
        location: { href: '' },
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      };

      mockOpen.mockReturnValueOnce(mockNewWallet);

      // Second call should create a new window since the previous one was closed
      const connection = await getWalletConnection();

      expect(mockOpen).toHaveBeenCalledTimes(2);
      expect(connection).toHaveProperty('message');
    });

    it('retries multiple times in waitForWallet before succeeding', async () => {
      vi.useFakeTimers();

      const mockWallet = {
        closed: false,
        focus: mockFocus,
        blur: mockBlur,
        close: mockClose,
        postMessage: vi.fn(),
        location: { href: '' },
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      };

      mockOpen.mockReturnValueOnce(mockWallet);

      let callCount = 0;
      mockAddEventListener.mockImplementation((eventType, handler) => {
        callCount++;
        if (callCount === 1) {
          // First call times out to trigger waitForWallet
          return;
        } else if (callCount <= 3) {
          // Next few calls in waitForWallet fail
          return;
        } else {
          // Finally succeed
          setTimeout(
            () =>
              handler({
                data: {
                  id: 'mock-uuid',
                  type: 'GET_STATUS',
                },
              }),
            10,
          );
        }
      });

      const connectionPromise = getWalletConnection();

      // Fast forward through initial timeout
      await vi.advanceTimersByTimeAsync(350);

      // Fast forward through retry attempts in waitForWallet
      for (let i = 0; i < 3; i++) {
        await vi.advanceTimersByTimeAsync(350);
      }

      const connection = await connectionPromise;

      expect(connection).toHaveProperty('message');
      expect(callCount).toBeGreaterThan(3);

      vi.useRealTimers();
    });

    it('returns connection with working focus and close methods', async () => {
      const mockWallet = {
        closed: false,
        focus: mockFocus,
        blur: mockBlur,
        close: mockClose,
        postMessage: vi.fn(),
        location: { href: '' },
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      };

      mockOpen.mockReturnValueOnce(mockWallet);

      const mockMessageEvent = {
        data: {
          id: 'mock-uuid',
          type: 'GET_STATUS',
        },
      };

      mockAddEventListener.mockImplementation((eventType, handler) => {
        setTimeout(() => handler(mockMessageEvent), 10);
      });

      const connection = await getWalletConnection();

      // Test focus method
      connection.focus();
      expect(mockFocus).toHaveBeenCalled();

      // Test close method
      connection.close();
      expect(mockClose).toHaveBeenCalled();
    });
  });

  describe('communicate function', () => {
    it('returns a function that sends messages and handles responses', async () => {
      // Open a connection to get the communicate function
      mockOpen.mockReturnValueOnce({
        closed: false,
        focus: mockFocus,
        blur: mockBlur,
        close: mockClose,
        postMessage: vi.fn(),
        location: { href: '' },
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      });

      // Setup mock response for message event
      const mockMessageEvent = {
        data: {
          id: 'mock-uuid',
          type: 'TEST_RESPONSE',
          payload: { result: 'success' },
        },
      };

      // Add event listener should call the handler with the mock event
      mockAddEventListener.mockImplementation((eventType, handler) => {
        setTimeout(() => handler(mockMessageEvent), 10);
      });

      const connection = await getWalletConnection();
      const result = await connection.message('TEST_MESSAGE', { test: true });

      expect(result).toEqual(mockMessageEvent.data);
      expect(mockBlur).toHaveBeenCalled();
      expect(mockFocus).toHaveBeenCalled();
    }, 10000); // Increase timeout for this test
  });

  describe('walletGlobal', () => {
    it('creates a new wallet window when walletGlobal is null', async () => {
      // Reset the walletGlobal by setting it to null
      // This requires importing the actual walletGlobal variable or forcing a new instance
      vi.resetModules(); // Reset modules to force a new instance of walletGlobal

      // Setup mock response for message event
      const mockMessageEvent = {
        data: {
          id: 'mock-uuid',
          type: 'GET_STATUS',
        },
      };

      // Add event listener should call the handler with the mock event
      mockAddEventListener.mockImplementation((eventType, handler) => {
        setTimeout(() => handler(mockMessageEvent), 10);
      });

      // Import the function again after resetting modules
      const { getWalletConnection } = await import('../utils');

      // Call getWalletConnection which should create a new wallet since walletGlobal is null
      const connection = await getWalletConnection();

      // Verify window.open was called to create a new wallet window
      expect(mockOpen).toHaveBeenCalledWith(
        '',
        'Dev-Wallet',
        'width=800,height=800',
      );
      expect(connection).toHaveProperty('message');
      expect(connection).toHaveProperty('focus');
      expect(connection).toHaveProperty('close');
    });
  });
});
