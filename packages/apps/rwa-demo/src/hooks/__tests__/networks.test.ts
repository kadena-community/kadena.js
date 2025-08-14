import { NetworkContext } from '@/contexts/NetworkContext/NetworkContext';
import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { useNetwork } from '../networks';

const mocks = vi.hoisted(() => ({
  useContext: vi.fn(),
  mockNetwork: {
    name: 'Test Network',
    networkId: 'testnet',
    host: 'https://api.test.chainweb.com',
    chainId: '0',
    graphUrl: 'https://graph.test.kadena.network/graphql',
  },
}));

const mockContext = vi.hoisted(() => ({
  activeNetwork: mocks.mockNetwork,
  networks: [
    mocks.mockNetwork,
    {
      networkId: 'development',
      name: 'Development',
      host: 'https://localhost:8080',
      graphUrl: 'http://localhost:8080/graphql',
      chainId: '0',
    },
  ],
}));

describe('useNetwork', () => {
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

  it('should throw an error when used outside of NetworkContextProvider', async () => {
    // Set useContext to return null to simulate being outside of NetworkContextProvider
    mocks.useContext.mockReturnValueOnce(null);

    // The function should throw an error
    expect(() => {
      const { result } = renderHook(() => useNetwork());
      return result.current;
    }).toThrow('useNetwork must be used within a NetworkContextProvider');

    // Verify useContext was called with NetworkContext
    expect(useContext).toHaveBeenCalledWith(NetworkContext);
  });

  it('should provide access to all network context properties', () => {
    // Setup context with network data
    mocks.useContext.mockReturnValueOnce(mockContext);

    const { result } = renderHook(() => useNetwork());

    // Verify properties
    expect(result.current.activeNetwork).toBe(mocks.mockNetwork);
    expect(result.current.networks.length).toBe(2);
    expect(result.current.networks[0]).toBe(mocks.mockNetwork);
  });
});
