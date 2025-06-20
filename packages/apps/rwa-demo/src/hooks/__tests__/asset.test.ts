import { AssetContext } from '@/contexts/AssetContext/AssetContext';
import { renderHook } from '@testing-library/react-hooks';
import { useContext } from 'react';
import { useAsset } from '../asset';

const mocks = vi.hoisted(() => ({
  useContext: vi.fn(),
  setAssetMock: vi.fn(),
  addAssetMock: vi.fn(),
  addExistingAssetMock: vi.fn(),
  removeAssetMock: vi.fn(),
  getAssetMock: vi.fn().mockResolvedValue(undefined),
  maxComplianceMock: vi.fn().mockReturnValue(10),
  initFetchInvestorsMock: vi.fn(),
  initFetchAgentsMock: vi.fn(),
  mockAsset: {
    uuid: 'test-uuid-1',
    contractName: 'test-contract',
    namespace: 'test-namespace',
    supply: 1000000,
    investorCount: 5,
    compliance: {
      maxSupply: {
        key: 'supply-limit-compliance-v1' as const,
        isActive: true,
        value: 1000000,
      },
      maxBalance: {
        key: 'max-balance-compliance-v1' as const,
        isActive: true,
        value: 100000,
      },
      maxInvestors: {
        key: 'max-investors-compliance-v1' as const,
        isActive: true,
        value: 100,
      },
    },
  },
}));

const mockContext = vi.hoisted(() => ({
  asset: mocks.mockAsset,
  assets: [mocks.mockAsset],
  paused: false,
  setAsset: mocks.setAssetMock,
  addAsset: mocks.addAssetMock,
  addExistingAsset: mocks.addExistingAssetMock,
  removeAsset: mocks.removeAssetMock,
  getAsset: mocks.getAssetMock,
  maxCompliance: mocks.maxComplianceMock,
  investors: [],
  initFetchInvestors: mocks.initFetchInvestorsMock,
  investorsIsLoading: false,
  agents: [],
  initFetchAgents: mocks.initFetchAgentsMock,
  agentsIsLoading: false,
}));

describe('useAsset', () => {
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

  it('should throw an error when used outside of AssetContextProvider', async () => {
    // Set useContext to return null to simulate being outside of AssetContextProvider
    mocks.useContext.mockReturnValueOnce(null);

    // The function should throw an error
    expect(() => {
      const { result } = renderHook(() => useAsset());
      return result.current;
    }).toThrow('useAsset must be used within a AssetContextProvider');

    // Verify useContext was called with AssetContext
    expect(useContext).toHaveBeenCalledWith(AssetContext);
  });

  it('should provide access to all asset context properties', () => {
    // Setup context with asset data
    mocks.useContext.mockReturnValueOnce(mockContext);

    const { result } = renderHook(() => useAsset());

    // Verify properties
    expect(result.current.asset).toBe(mocks.mockAsset);
    expect(result.current.assets).toEqual([mocks.mockAsset]);
    expect(result.current.paused).toBe(false);
    expect(result.current.investors).toEqual([]);
    expect(result.current.investorsIsLoading).toBe(false);
    expect(result.current.agents).toEqual([]);
    expect(result.current.agentsIsLoading).toBe(false);

    // Verify methods
    expect(typeof result.current.setAsset).toBe('function');
    expect(typeof result.current.addAsset).toBe('function');
    expect(typeof result.current.addExistingAsset).toBe('function');
    expect(typeof result.current.removeAsset).toBe('function');
    expect(typeof result.current.getAsset).toBe('function');
    expect(typeof result.current.maxCompliance).toBe('function');
    expect(typeof result.current.initFetchInvestors).toBe('function');
    expect(typeof result.current.initFetchAgents).toBe('function');
  });

  it('should call the correct functions when methods are used', async () => {
    // Setup context with asset data
    mocks.useContext.mockReturnValueOnce(mockContext);

    const { result } = renderHook(() => useAsset());

    // Test setAsset function
    result.current.setAsset(mocks.mockAsset);
    expect(mocks.setAssetMock).toHaveBeenCalledWith(mocks.mockAsset);

    // Test addAsset function
    const assetParams = {
      contractName: 'new-contract',
      namespace: 'new-namespace',
    };
    result.current.addAsset(assetParams);
    expect(mocks.addAssetMock).toHaveBeenCalledWith(assetParams);

    // Test addExistingAsset function
    result.current.addExistingAsset('existing-asset');
    expect(mocks.addExistingAssetMock).toHaveBeenCalledWith('existing-asset');

    // Test removeAsset function
    result.current.removeAsset(mocks.mockAsset);
    expect(mocks.removeAssetMock).toHaveBeenCalledWith(mocks.mockAsset);

    // Test getAsset function
    const mockAccount = {
      address: 'k:test123',
      publicKey: 'test-pk',
      guard: {
        keys: ['test-pk'],
        pred: 'keys-all' as const,
      },
      keyset: {
        keys: ['test-pk'],
        pred: 'keys-all' as const,
      },
      alias: 'test-account',
      contract: 'test-contract',
      chains: [{ chainId: '1' as const, balance: '100.0' }],
      overallBalance: '100.0',
      walletName: 'CHAINWEAVER' as const,
    };
    await result.current.getAsset('test-uuid', mockAccount);
    expect(mocks.getAssetMock).toHaveBeenCalledWith('test-uuid', mockAccount);

    // Test maxCompliance function
    result.current.maxCompliance('max-investors-compliance-v1');
    expect(mocks.maxComplianceMock).toHaveBeenCalledWith(
      'max-investors-compliance-v1',
    );

    // Test initFetchInvestors function
    result.current.initFetchInvestors();
    expect(mocks.initFetchInvestorsMock).toHaveBeenCalled();

    // Test initFetchAgents function
    result.current.initFetchAgents();
    expect(mocks.initFetchAgentsMock).toHaveBeenCalled();
  });
});
