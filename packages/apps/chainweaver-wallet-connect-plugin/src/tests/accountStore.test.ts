import { IAccount } from '@/wallet-communication';
import { renderHook } from '@testing-library/react-hooks';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useAccountStore from '../hooks/useAccountStore';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  removeItem: vi.fn(),
  key: vi.fn(),
};

global.localStorage = mockLocalStorage;

describe('useAccountStore', () => {
  beforeEach(() => {
    // Clear mocks before each test
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
  });

  it('loads accountStore from localStorage on initialization', () => {
    const mockData = JSON.stringify({
      '123': [
        {
          name: 'account1',
          account: { id: '123', details: 'details' },
          publicKey: 'publicKey1',
        },
      ],
    });
    mockLocalStorage.getItem.mockReturnValueOnce(mockData);

    const { result } = renderHook(() => useAccountStore());

    expect(localStorage.getItem).toHaveBeenCalledWith('accountStore');
    expect(result.current[0]).toEqual(JSON.parse(mockData));
  });

  it('saves accountStore to localStorage when accountStore changes', () => {
    const { result, rerender } = renderHook(() => useAccountStore());

    const dummyAccount: IAccount = {
      uuid: '123',
      networkUUID: '456-789-123-456-789',
      profileId: '789',
      contract: 'coin',
      address: 'address',
      overallBalance: '100',
      chains: [{ chainId: '0', balance: '100' }],
      guard: { keys: ['key'], pred: 'keys-all' },
    };

    // Simulate a state change in accountStore
    const newAccountStore = {
      '456': [
        { name: 'account2', account: dummyAccount, publicKey: 'publicKey2' },
      ],
    };

    result.current[1](newAccountStore);
    rerender();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'accountStore',
      JSON.stringify(newAccountStore),
    );
    expect(result.current[0]).toEqual(newAccountStore);
  });
});
