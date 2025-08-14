import { TransactionsContext } from '@/contexts/TransactionsContext/TransactionsContext';
import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { useTransactions } from '../transactions';

const mocks = vi.hoisted(() => ({
  useContext: vi.fn(),
  addTransactionMock: vi.fn().mockResolvedValue({
    uuid: 'test-uuid',
    hash: 'test-hash',
    type: 'test-type',
    timestamp: new Date().toISOString(),
  }),
  getTransactionsMock: vi.fn().mockReturnValue([]),
  setTxsButtonRefMock: vi.fn(),
  setTxsAnimationRefMock: vi.fn(),
}));

const mockContext = vi.hoisted(() => ({
  transactions: [],
  addTransaction: mocks.addTransactionMock,
  getTransactions: mocks.getTransactionsMock,
  setTxsButtonRef: mocks.setTxsButtonRefMock,
  setTxsAnimationRef: mocks.setTxsAnimationRefMock,
  isActiveAccountChangeTx: false,
}));

describe('useTransactions', () => {
  beforeEach(() => {
    // Mock React's useContext
    vi.mock('react', async () => {
      const actual = await vi.importActual('react');
      return {
        ...actual,
        useContext: mocks.useContext,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should throw an error when used outside of TransactionsContextProvider', async () => {
    // The function should throw an error
    expect(() => {
      const { result } = renderHook(() => useTransactions());
      return result.current;
    }).toThrow(
      'useTransactions must be used within a TransactionsContextProvider',
    );

    // Verify useContext was called with TransactionsContext
    expect(useContext).toHaveBeenCalledWith(TransactionsContext);
  });

  it('should provide access to all transactions context properties', () => {
    // Create a mock transaction
    const mockTransaction = {
      uuid: 'test-uuid',
      hash: 'test-hash',
      type: 'test-type',
      timestamp: new Date().toISOString(),
    };

    // Setup context with transaction data
    const contextWithTransactions = {
      ...mockContext,
      transactions: [mockTransaction],
    };

    vi.mocked(mocks.useContext).mockReturnValueOnce(
      contextWithTransactions as unknown as ReturnType<typeof useTransactions>,
    );

    const { result } = renderHook(() => useTransactions());

    // Verify properties
    expect(result.current.transactions).toEqual([mockTransaction]);
    expect(result.current.isActiveAccountChangeTx).toBe(false);

    // Verify methods
    expect(typeof result.current.addTransaction).toBe('function');
    expect(typeof result.current.getTransactions).toBe('function');
    expect(typeof result.current.setTxsButtonRef).toBe('function');
    expect(typeof result.current.setTxsAnimationRef).toBe('function');
  });
});
