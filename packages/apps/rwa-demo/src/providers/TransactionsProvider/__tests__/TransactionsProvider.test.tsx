import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import {
  TransactionsContext,
  TXTYPES,
} from '@/contexts/TransactionsContext/TransactionsContext';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  interpretErrorMessage,
  TransactionsProvider,
} from '../TransactionsProvider';

// Mock interpretMessage
vi.mock('@/utils/interpretMessage', () => ({
  interpretMessage: vi.fn((message) => `Interpreted: ${message}`),
}));

const mocks = vi.hoisted(() => ({
  addNotification: vi.fn(),
}));

// Create ApolloClient mock
const mockSubscribe = vi.fn();
const mockUnsubscribe = vi.fn();

const mockApolloClient = {
  subscribe: vi.fn(() => ({
    subscribe: mockSubscribe,
  })),
};

vi.mock('@apollo/client', () => ({
  useApolloClient: () => mockApolloClient,
  gql: (query: string | TemplateStringsArray) => query, // Mock gql to return the query string as is
}));

// Mock hooks
vi.mock('@/hooks/account', () => ({
  useAccount: () => ({
    account: {
      address: 'test-account-address',
    },
  }),
}));

vi.mock('@/hooks/asset', () => ({
  useAsset: () => ({
    asset: 'test-asset',
  }),
}));

vi.mock('@/hooks/networks', () => ({
  useNetwork: () => ({
    activeNetwork: {
      name: 'testnet',
      networkId: 'testnet',
    },
  }),
}));

vi.mock('@/hooks/notifications', () => ({
  useNotifications: () => ({
    addNotification: mocks.addNotification,
  }),
}));

vi.mock('@/hooks/organisation', () => ({
  useOrganisation: () => ({
    organisation: 'test-org',
  }),
}));

// Mock RWAStore
const mockStoreCallbacks: Array<(txs: ITransaction[]) => void> = [];
const mockStore = {
  addTransaction: vi.fn(),
  removeTransaction: vi.fn(),
  listenToTransactions: vi.fn((callback) => {
    mockStoreCallbacks.push(callback);
    return () => {
      /* mock cleanup */
    };
  }),
};

vi.mock('@/utils/store', () => ({
  RWAStore: () => mockStore,
}));

// Mock crypto.randomUUID
const mockRandomUUID = vi.fn(() => 'test-uuid');

// Test component to access context values
const TestComponent = () => {
  const context = React.useContext(TransactionsContext);

  if (!context) {
    return <div data-testid="no-context">No Context Available</div>;
  }

  return (
    <div>
      <div data-testid="transactions-count">{context.transactions.length}</div>
      <button
        data-testid="add-transaction-btn"
        onClick={async () => {
          await context.addTransaction({
            requestKey: 'test-request-key',
            type: TXTYPES.ADDINVESTOR,
            accounts: ['test-account-address'],
          });
        }}
      >
        Add Transaction
      </button>
      <button
        data-testid="get-transactions-btn"
        onClick={() => {
          const txs = context.getTransactions(TXTYPES.ADDINVESTOR);
          document.getElementById('txs-count')!.textContent = String(
            txs.length,
          );
        }}
      >
        Get Transactions
      </button>
      <div id="txs-count">0</div>
      <div data-testid="is-active-change-tx">
        {context.isActiveAccountChangeTx ? 'true' : 'false'}
      </div>
    </div>
  );
};

describe('TransactionsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup crypto.randomUUID mock
    Object.defineProperty(global.crypto, 'randomUUID', {
      value: mockRandomUUID,
      configurable: true,
    });

    // Setup subscription mock
    mockSubscribe.mockImplementation((onNext, onError, onComplete) => {
      return { unsubscribe: mockUnsubscribe };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockStoreCallbacks.length = 0; // Clear callbacks array
  });

  describe('interpretErrorMessage', () => {
    it('should interpret string error messages', () => {
      const result = interpretErrorMessage('Error message');
      expect(result).toBe('Interpreted: Error message');
    });

    it('should interpret object error messages', () => {
      const mockResult = {
        result: {
          error: {
            message: 'Error message',
          },
        },
      };

      // Create a basic transaction object for testing
      const mockData: ITransaction = {
        uuid: 'test-uuid',
        requestKey: 'test-key',
        type: TXTYPES.ADDINVESTOR,
        accounts: ['test-account'],
      };

      const result = interpretErrorMessage(mockResult, mockData);
      expect(result).toBe('Interpreted: Error message');
    });
  });

  describe('TransactionsProvider Component', () => {
    it('should render provider with children', async () => {
      // Completely disable subscription mechanism

      const screen = render(
        <TransactionsProvider>
          <span data-testid="test-child">Test Child</span>
        </TransactionsProvider>,
      );
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should initialize with empty transactions', () => {
      render(
        <TransactionsProvider>
          <TestComponent />
        </TransactionsProvider>,
      );

      expect(screen.getByTestId('transactions-count').textContent).toBe('0');
    });

    it('should add transaction and call store', async () => {
      render(
        <TransactionsProvider>
          <TestComponent />
        </TransactionsProvider>,
      );

      fireEvent.click(screen.getByTestId('add-transaction-btn'));

      await waitFor(() => {
        // After adding a transaction, the count should be 1
        expect(screen.getByTestId('transactions-count').textContent).toBe('1');
        expect(mockStore.addTransaction).toHaveBeenCalledTimes(1);
        expect(mockApolloClient.subscribe).toHaveBeenCalledTimes(1);
      });
    });

    it('should get transactions by type', async () => {
      render(
        <TransactionsProvider>
          <TestComponent />
        </TransactionsProvider>,
      );

      // First add a transaction
      fireEvent.click(screen.getByTestId('add-transaction-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('transactions-count').textContent).toBe('1');
      });

      // Then get transactions of type ADDINVESTOR
      fireEvent.click(screen.getByTestId('get-transactions-btn'));

      await waitFor(() => {
        const txsCount = document.getElementById('txs-count');
        expect(txsCount?.textContent).toBe('1');
      });
    });

    it('should handle transaction subscription success', async () => {
      render(
        <TransactionsProvider>
          <TestComponent />
        </TransactionsProvider>,
      );

      // Add a transaction to set up the subscription
      fireEvent.click(screen.getByTestId('add-transaction-btn'));

      await waitFor(() => {
        expect(mockSubscribe).toHaveBeenCalled();
      });

      // Get the onComplete callback
      const onComplete = mockSubscribe.mock.calls[0][2];

      // Simulate completion
      onComplete();

      // Check that store.removeTransaction was called
      expect(mockStore.removeTransaction).toHaveBeenCalledTimes(1);
    });

    it('should handle transaction error responses', async () => {
      render(
        <TransactionsProvider>
          <TestComponent />
        </TransactionsProvider>,
      );

      // Add a transaction to set up the subscription
      fireEvent.click(screen.getByTestId('add-transaction-btn'));

      await waitFor(() => {
        expect(mockSubscribe).toHaveBeenCalled();
      });

      // Get the onNext callback
      const onNext = mockSubscribe.mock.calls[0][0];

      // Simulate error response
      onNext({
        errors: 'Test error',
        data: {
          transaction: {
            result: {
              badResult: 'bad result',
            },
          },
        },
      });

      // Check that addNotification was called with the error
      expect(mocks.addNotification).toHaveBeenCalledWith(
        {
          intent: 'negative',
          label: '"Test error"',
          message: 'Interpreted: "Test error"',
          url: 'https://explorer.kadena.io/testnet/transaction/test-request-key',
        },
        {
          name: 'error:ADDINVESTOR',
          options: {
            message: '"Test error"',
            requestKey: 'test-request-key',
            sentryData: {
              captureContext: {
                extra: {
                  message: '"bad result"',
                },
              },
              label: Error('"Test error"'),
              type: 'transaction-listener',
            },
          },
        },
      );
    });

    it('should handle transaction subscription errors', async () => {
      render(
        <TransactionsProvider>
          <TestComponent />
        </TransactionsProvider>,
      );

      // Add a transaction to set up the subscription
      fireEvent.click(screen.getByTestId('add-transaction-btn'));

      await waitFor(() => {
        expect(mockSubscribe).toHaveBeenCalled();
      });

      // Get the onError callback
      const onError = mockSubscribe.mock.calls[0][1];

      // Simulate error
      onError({ message: 'Subscription error' });

      // Check that addNotification was called with the error
      expect(mocks.addNotification).toHaveBeenCalledTimes(1);
    });

    it('should check if account is active in transaction', async () => {
      // Create mock transaction that includes the current account
      const mockTxData = {
        uuid: 'agent-uuid',
        requestKey: 'agent-request-key',
        type: TXTYPES.ADDAGENT,
        accounts: ['test-account-address'],
      };

      render(
        <TransactionsProvider>
          <TestComponent />
        </TransactionsProvider>,
      );

      // Initially isActiveAccountChangeTx should be false
      expect(screen.getByTestId('is-active-change-tx').textContent).toBe(
        'false',
      );

      // Simulate store calling back with transactions
      mockStoreCallbacks[0]([mockTxData]);

      // Now isActiveAccountChangeTx should be true
      await waitFor(() => {
        expect(screen.getByTestId('is-active-change-tx').textContent).toBe(
          'true',
        );
      });
    });
  });
});
