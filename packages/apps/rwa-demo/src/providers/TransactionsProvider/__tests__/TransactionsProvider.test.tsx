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
    asset: {
      uuid: 'test-asset-uuid',
      name: 'test-asset',
    },
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
    organisation: {
      id: 'test-org-id',
      name: 'test-org',
    },
  }),
}));

// Mock RWAStore
const mockStoreCallbacks: Array<(txs: ITransaction[]) => void> = [];
const mockTransactions: ITransaction[] = [];
const mockStore = {
  addTransaction: vi.fn(async (transaction: ITransaction) => {
    mockTransactions.push(transaction);
    // Trigger the callback with updated transactions (filtered for current account)
    const filteredTransactions = mockTransactions.filter(
      (tx) =>
        tx.type.overall || tx.accounts.indexOf('test-account-address') >= 0,
    );
    mockStoreCallbacks.forEach((callback) => callback(filteredTransactions));
  }),
  removeTransaction: vi.fn(async (transaction: ITransaction) => {
    const index = mockTransactions.findIndex(
      (tx) => tx.uuid === transaction.uuid,
    );
    if (index !== -1) {
      mockTransactions.splice(index, 1);
      // Trigger the callback with updated transactions (filtered for current account)
      const filteredTransactions = mockTransactions.filter(
        (tx) =>
          tx.type.overall || tx.accounts.indexOf('test-account-address') >= 0,
      );
      mockStoreCallbacks.forEach((callback) => callback(filteredTransactions));
    }
  }),
  listenToTransactions: vi.fn((callback) => {
    mockStoreCallbacks.push(callback);
    // Immediately call with current transactions (filtered for current account)
    const filteredTransactions = mockTransactions.filter(
      (tx) =>
        tx.type.overall || tx.accounts.indexOf('test-account-address') >= 0,
    );
    callback(filteredTransactions);
    return () => {
      const index = mockStoreCallbacks.indexOf(callback);
      if (index !== -1) {
        mockStoreCallbacks.splice(index, 1);
      }
    };
  }),
};

vi.mock('@/utils/store', () => ({
  RWAStore: vi.fn(() => mockStore),
}));

// Mock crypto.randomUUID
const mockRandomUUID = vi.fn(() => 'test-uuid');

// Mock analytics
vi.mock('@/utils/analytics', () => ({
  analyticsEvent: vi.fn(),
}));

// Mock GraphQL transaction subscription
vi.mock('@/services/graph/transactionSubscription.graph', () => ({
  transactionsQuery: 'MOCK_TRANSACTION_QUERY',
}));

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

    // Clear store callbacks and transactions
    mockStoreCallbacks.length = 0;
    mockTransactions.length = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
    it('should render provider with children', () => {
      render(
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

      // Wait for the store to be set up
      await waitFor(() => {
        expect(mockStore.listenToTransactions).toHaveBeenCalled();
      });

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

      // Wait for the store to be set up
      await waitFor(() => {
        expect(mockStore.listenToTransactions).toHaveBeenCalled();
      });

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

    it('should prevent duplicate transactions with same requestKey', async () => {
      const TestComponentDuplicate = () => {
        const context = React.useContext(TransactionsContext);
        const [addResult, setAddResult] = React.useState<ITransaction | null>(
          null,
        );

        if (!context) {
          return <div data-testid="no-context">No Context Available</div>;
        }

        return (
          <div>
            <div data-testid="transactions-count">
              {context.transactions.length}
            </div>
            <button
              data-testid="add-duplicate-transaction-btn"
              onClick={async () => {
                const result = await context.addTransaction({
                  requestKey: 'duplicate-request-key',
                  type: TXTYPES.ADDINVESTOR,
                  accounts: ['test-account-address'],
                });
                setAddResult(result);
              }}
            >
              Add Duplicate Transaction
            </button>
            <div data-testid="add-result">{addResult?.uuid || 'none'}</div>
          </div>
        );
      };

      render(
        <TransactionsProvider>
          <TestComponentDuplicate />
        </TransactionsProvider>,
      );

      // Wait for the store to be set up
      await waitFor(() => {
        expect(mockStore.listenToTransactions).toHaveBeenCalled();
      });

      // Add first transaction
      fireEvent.click(screen.getByTestId('add-duplicate-transaction-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('transactions-count').textContent).toBe('1');
        expect(screen.getByTestId('add-result').textContent).toBe('test-uuid');
      });

      // Try to add the same transaction again
      fireEvent.click(screen.getByTestId('add-duplicate-transaction-btn'));

      // Should still be 1 transaction and return the existing one
      await waitFor(() => {
        expect(screen.getByTestId('transactions-count').textContent).toBe('1');
        expect(screen.getByTestId('add-result').textContent).toBe('test-uuid');
      });
    });

    it('should handle transaction subscription success', async () => {
      render(
        <TransactionsProvider>
          <TestComponent />
        </TransactionsProvider>,
      );

      // Wait for the store to be set up
      await waitFor(() => {
        expect(mockStore.listenToTransactions).toHaveBeenCalled();
      });

      // Add a transaction to set up the subscription
      fireEvent.click(screen.getByTestId('add-transaction-btn'));

      await waitFor(() => {
        expect(mockSubscribe).toHaveBeenCalled();
      });

      // Get the onNext callback
      const onNext = mockSubscribe.mock.calls[0][0];

      // Simulate successful response
      onNext({
        data: {
          transaction: {
            result: {
              goodResult: 'success',
            },
          },
        },
      });

      // Check that store.removeTransaction was called
      await waitFor(() => {
        expect(mockStore.removeTransaction).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle transaction subscription success with success message', async () => {
      const TestComponentWithSuccessMessage = () => {
        const context = React.useContext(TransactionsContext);

        if (!context) {
          return <div data-testid="no-context">No Context Available</div>;
        }

        return (
          <div>
            <button
              data-testid="add-transaction-with-success-btn"
              onClick={async () => {
                await context.addTransaction({
                  requestKey: 'test-request-key',
                  type: TXTYPES.ADDINVESTOR,
                  accounts: ['test-account-address'],
                  successMessage: 'Transaction completed successfully!',
                });
              }}
            >
              Add Transaction with Success Message
            </button>
          </div>
        );
      };

      render(
        <TransactionsProvider>
          <TestComponentWithSuccessMessage />
        </TransactionsProvider>,
      );

      // Wait for the store to be set up
      await waitFor(() => {
        expect(mockStore.listenToTransactions).toHaveBeenCalled();
      });

      // Add a transaction to set up the subscription
      fireEvent.click(screen.getByTestId('add-transaction-with-success-btn'));

      await waitFor(() => {
        expect(mockSubscribe).toHaveBeenCalled();
      });

      // Get the onNext callback
      const onNext = mockSubscribe.mock.calls[0][0];

      // Simulate successful response
      onNext({
        data: {
          transaction: {
            result: {
              goodResult: 'success',
            },
          },
        },
      });

      // Check that success notification was called
      await waitFor(() => {
        expect(mocks.addNotification).toHaveBeenCalledWith({
          intent: 'positive',
          label: 'transaction successful',
          message: 'Transaction completed successfully!',
        });
      });

      // Check that store.removeTransaction was called
      await waitFor(() => {
        expect(mockStore.removeTransaction).toHaveBeenCalled();
      });
    });

    it('should handle transaction error responses with badResult', async () => {
      render(
        <TransactionsProvider>
          <TestComponent />
        </TransactionsProvider>,
      );

      // Wait for the store to be set up
      await waitFor(() => {
        expect(mockStore.listenToTransactions).toHaveBeenCalled();
      });

      // Add a transaction to set up the subscription
      fireEvent.click(screen.getByTestId('add-transaction-btn'));

      await waitFor(() => {
        expect(mockSubscribe).toHaveBeenCalled();
      });

      // Get the onNext callback
      const onNext = mockSubscribe.mock.calls[0][0];

      // Simulate error response with badResult
      onNext({
        data: {
          transaction: {
            result: {
              badResult: JSON.stringify({ message: 'Transaction failed' }),
            },
          },
        },
      });

      // Check that addNotification was called with the error
      await waitFor(() => {
        expect(mocks.addNotification).toHaveBeenCalled();
      });

      // Check that removeTransaction was called
      await waitFor(() => {
        expect(mockStore.removeTransaction).toHaveBeenCalled();
      });
    });

    it('should handle transaction error responses with errors array', async () => {
      render(
        <TransactionsProvider>
          <TestComponent />
        </TransactionsProvider>,
      );

      // Wait for the store to be set up
      await waitFor(() => {
        expect(mockStore.listenToTransactions).toHaveBeenCalled();
      });

      // Add a transaction to set up the subscription
      fireEvent.click(screen.getByTestId('add-transaction-btn'));

      await waitFor(() => {
        expect(mockSubscribe).toHaveBeenCalled();
      });

      // Get the onNext callback
      const onNext = mockSubscribe.mock.calls[0][0];

      // Simulate error response with errors array
      onNext({
        errors: ['Error 1', 'Error 2'],
        data: {
          transaction: {
            result: {},
          },
        },
      });

      // Check that addNotification was called with the error
      await waitFor(() => {
        expect(mocks.addNotification).toHaveBeenCalled();
      });

      // Check that removeTransaction was called
      await waitFor(() => {
        expect(mockStore.removeTransaction).toHaveBeenCalled();
      });
    });

    it('should handle transaction subscription errors', async () => {
      render(
        <TransactionsProvider>
          <TestComponent />
        </TransactionsProvider>,
      );

      // Wait for the store to be set up
      await waitFor(() => {
        expect(mockStore.listenToTransactions).toHaveBeenCalled();
      });

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
      await waitFor(() => {
        expect(mocks.addNotification).toHaveBeenCalled();
      });
    });

    it('should handle transaction completion', async () => {
      render(
        <TransactionsProvider>
          <TestComponent />
        </TransactionsProvider>,
      );

      // Wait for the store to be set up
      await waitFor(() => {
        expect(mockStore.listenToTransactions).toHaveBeenCalled();
      });

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
      await waitFor(() => {
        expect(mockStore.removeTransaction).toHaveBeenCalled();
      });
    });

    it('should check if account is active in transaction', async () => {
      render(
        <TransactionsProvider>
          <TestComponent />
        </TransactionsProvider>,
      );

      // Initially isActiveAccountChangeTx should be false
      expect(screen.getByTestId('is-active-change-tx').textContent).toBe(
        'false',
      );

      // Wait for the store to be set up
      await waitFor(() => {
        expect(mockStore.listenToTransactions).toHaveBeenCalled();
      });

      // Create mock transaction that includes the current account
      const mockTxData: ITransaction = {
        uuid: 'agent-uuid',
        requestKey: 'agent-request-key',
        type: TXTYPES.ADDAGENT,
        accounts: ['test-account-address'],
      };

      // Add the transaction to the mock store
      mockTransactions.push(mockTxData);

      // Simulate store calling back with transactions
      const storeCallback = mockStore.listenToTransactions.mock.calls[0][0];
      storeCallback([mockTxData]);

      // Now isActiveAccountChangeTx should be true
      await waitFor(() => {
        expect(screen.getByTestId('is-active-change-tx').textContent).toBe(
          'true',
        );
      });
    });
  });
});
