import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { renderHook } from '@testing-library/react';
import { getStepIdx, useAssetSetup } from '../assetSetup';

const mocks = vi.hoisted(() => ({
  setAssetMock: vi.fn(),
  useAssetMock: vi.fn(),
}));

// Mock the useAsset hook
vi.mock('../asset', () => ({
  useAsset: mocks.useAssetMock,
}));

// Mock React's useState and useEffect
const mockSetState = vi.fn();

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: vi.fn().mockImplementation((initial) => {
      if (typeof initial === 'function') {
        return [initial(), mockSetState];
      }
      return [initial, mockSetState];
    }),
    useEffect: vi.fn().mockImplementation((fn) => fn()),
  };
});

describe('getStepIdx', () => {
  it('should return the correct index for each step', () => {
    expect(getStepIdx('setup')).toBe(0);
    expect(getStepIdx('compliancerules')).toBe(1);
    expect(getStepIdx('startcompliance')).toBe(2);
    expect(getStepIdx('agent')).toBe(3);
    expect(getStepIdx('investor')).toBe(4);
    expect(getStepIdx('distribute')).toBe(5);
    expect(getStepIdx('success')).toBe(6);
  });

  it('should return -1 for non-existent step', () => {
    // @ts-expect-error Testing invalid step key
    expect(getStepIdx('nonexistent')).toBe(-1);
  });
});

describe('useAssetSetup', () => {
  const mockAsset: IAsset = {
    uuid: 'test-uuid-1',
    contractName: 'test-contract',
    namespace: 'test-namespace',
    supply: 1000,
    investorCount: 5,
    compliance: {
      maxSupply: {
        key: 'supply-limit-compliance-v1',
        isActive: true,
        value: 1000000,
      },
      maxBalance: {
        key: 'max-balance-compliance-v1',
        isActive: false,
        value: 100000,
      },
      maxInvestors: {
        key: 'max-investors-compliance-v1',
        isActive: false,
        value: 100,
      },
    },
  };

  const mockAgents = [
    { id: 'agent-1', name: 'Agent 1' },
    { id: 'agent-2', name: 'Agent 2' },
  ];

  const mockInvestors = [
    { id: 'investor-1', name: 'Investor 1' },
    { id: 'investor-2', name: 'Investor 2' },
  ];

  const defaultUseAssetReturn = {
    setAsset: mocks.setAssetMock,
    asset: undefined,
    agents: [],
    investors: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useAssetMock.mockReturnValue(defaultUseAssetReturn);
  });

  it('should initialize with setup step and correct stepIdx', () => {
    const { result } = renderHook(() =>
      useAssetSetup({ tempAsset: undefined }),
    );

    expect(result.current.activeStep.id).toBe('setup');
    expect(result.current.activeStepIdx).toBe(0);
    expect(result.current.steps).toHaveLength(7);
  });

  it('should set asset when tempAsset is provided', () => {
    renderHook(() => useAssetSetup({ tempAsset: mockAsset }));

    expect(mocks.setAssetMock).toHaveBeenCalledWith(mockAsset);
  });

  it('should not set asset when tempAsset is undefined', () => {
    renderHook(() => useAssetSetup({ tempAsset: undefined }));

    expect(mocks.setAssetMock).not.toHaveBeenCalled();
  });

  describe('step progression logic', () => {
    it('should progress to compliancerules step when asset is available', () => {
      mocks.useAssetMock.mockReturnValue({
        ...defaultUseAssetReturn,
        asset: mockAsset,
      });

      renderHook(() => useAssetSetup({ tempAsset: undefined }));

      // The step should be set to 'compliancerules' in useEffect
      expect(mockSetState).toHaveBeenCalledWith({
        label: 'Set up Compliance Rules',
        id: 'compliancerules',
      });
    });

    it('should progress to startcompliance step when compliance rule is set', () => {
      const assetWithComplianceRule: IAsset = {
        ...mockAsset,
        compliance: {
          ...mockAsset.compliance,
          maxBalance: {
            key: 'max-balance-compliance-v1',
            isActive: false,
            value: 50000, // >= 0 means rule is set
          },
        },
      };

      mocks.useAssetMock.mockReturnValue({
        ...defaultUseAssetReturn,
        asset: assetWithComplianceRule,
      });

      renderHook(() => useAssetSetup({ tempAsset: undefined }));

      expect(mockSetState).toHaveBeenCalledWith({
        label: 'Enforce a compliance rule',
        id: 'startcompliance',
      });
    });

    it('should progress to agent step when compliance rule is started', () => {
      const assetWithActiveCompliance: IAsset = {
        ...mockAsset,
        compliance: {
          ...mockAsset.compliance,
          maxBalance: {
            key: 'max-balance-compliance-v1',
            isActive: true, // Rule is active/started
            value: 50000,
          },
        },
      };

      mocks.useAssetMock.mockReturnValue({
        ...defaultUseAssetReturn,
        asset: assetWithActiveCompliance,
      });

      renderHook(() => useAssetSetup({ tempAsset: undefined }));

      expect(mockSetState).toHaveBeenCalledWith({
        label: 'Add first agent',
        id: 'agent',
      });
    });

    it('should progress to investor step when agents are available', () => {
      mocks.useAssetMock.mockReturnValue({
        ...defaultUseAssetReturn,
        asset: mockAsset,
        agents: mockAgents,
      });

      renderHook(() => useAssetSetup({ tempAsset: undefined }));

      expect(mockSetState).toHaveBeenCalledWith({
        label: 'Add first investor',
        id: 'investor',
      });
    });

    it('should progress to distribute step when investors are available', () => {
      mocks.useAssetMock.mockReturnValue({
        ...defaultUseAssetReturn,
        asset: mockAsset,
        agents: mockAgents,
        investors: mockInvestors,
      });

      renderHook(() => useAssetSetup({ tempAsset: undefined }));

      expect(mockSetState).toHaveBeenCalledWith({
        label: 'Distribute first tokens',
        id: 'distribute',
      });
    });

    it('should progress to success step when asset has supply > 0', () => {
      const assetWithSupply: IAsset = {
        ...mockAsset,
        supply: 1000, // > 0 means tokens have been distributed
      };

      mocks.useAssetMock.mockReturnValue({
        ...defaultUseAssetReturn,
        asset: assetWithSupply,
        agents: mockAgents,
        investors: mockInvestors,
      });

      renderHook(() => useAssetSetup({ tempAsset: undefined }));

      expect(mockSetState).toHaveBeenCalledWith({
        label: 'Complete',
        id: 'success',
      });
    });
  });

  describe('compliance rule validation', () => {
    it('should identify when no compliance rules are set', () => {
      const assetWithoutRules: IAsset = {
        ...mockAsset,
        compliance: {
          maxSupply: {
            key: 'supply-limit-compliance-v1',
            isActive: false,
            value: -1, // < 0 means not set
          },
          maxBalance: {
            key: 'max-balance-compliance-v1',
            isActive: false,
            value: -1,
          },
          maxInvestors: {
            key: 'max-investors-compliance-v1',
            isActive: false,
            value: -1,
          },
        },
      };

      mocks.useAssetMock.mockReturnValue({
        ...defaultUseAssetReturn,
        asset: assetWithoutRules,
      });

      renderHook(() => useAssetSetup({ tempAsset: undefined }));

      // Should not progress beyond compliancerules step
      expect(mockSetState).toHaveBeenCalledWith({
        label: 'Set up Compliance Rules',
        id: 'compliancerules',
      });
      expect(mockSetState).not.toHaveBeenCalledWith({
        label: 'Start a compliance rule',
        id: 'startcompliance',
      });
    });

    it('should identify when compliance rules are set but not active', () => {
      const assetWithInactiveRules: IAsset = {
        ...mockAsset,
        compliance: {
          maxSupply: {
            key: 'supply-limit-compliance-v1',
            isActive: false, // Not active
            value: 1000000, // But set (>= 0)
          },
          maxBalance: {
            key: 'max-balance-compliance-v1',
            isActive: false,
            value: 100000,
          },
          maxInvestors: {
            key: 'max-investors-compliance-v1',
            isActive: false,
            value: 100,
          },
        },
      };

      mocks.useAssetMock.mockReturnValue({
        ...defaultUseAssetReturn,
        asset: assetWithInactiveRules,
      });

      renderHook(() => useAssetSetup({ tempAsset: undefined }));

      // Should progress to startcompliance but not to agent
      expect(mockSetState).toHaveBeenCalledWith({
        label: 'Enforce a compliance rule',
        id: 'startcompliance',
      });
      expect(mockSetState).not.toHaveBeenCalledWith({
        label: 'Add first agent',
        id: 'agent',
      });
    });
  });

  it('should return current asset from useAsset hook', () => {
    mocks.useAssetMock.mockReturnValue({
      ...defaultUseAssetReturn,
      asset: mockAsset,
      agents: mockAgents,
      investors: mockInvestors,
    });

    const { result } = renderHook(() =>
      useAssetSetup({ tempAsset: undefined }),
    );

    expect(result.current.asset).toBe(mockAsset);
  });

  it('should have correct step configuration', () => {
    const { result } = renderHook(() =>
      useAssetSetup({ tempAsset: undefined }),
    );

    const expectedSteps = [
      { label: 'Set up your asset', id: 'setup' },
      { label: 'Set up Compliance Rules', id: 'compliancerules' },
      { label: 'Enforce a compliance rule', id: 'startcompliance' },
      { label: 'Add first agent', id: 'agent' },
      { label: 'Add first investor', id: 'investor' },
      { label: 'Distribute first tokens', id: 'distribute' },
      { label: 'Complete', id: 'success' },
    ];

    expect(result.current.steps).toEqual(expectedSteps);
  });

  describe('edge cases', () => {
    it('should handle undefined compliance object', () => {
      const assetWithoutCompliance = {
        ...mockAsset,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        compliance: undefined as any,
      };

      mocks.useAssetMock.mockReturnValue({
        ...defaultUseAssetReturn,
        asset: assetWithoutCompliance,
      });

      // Should not throw error
      expect(() => {
        renderHook(() => useAssetSetup({ tempAsset: undefined }));
      }).not.toThrow();
    });

    it('should handle asset with zero supply', () => {
      const assetWithZeroSupply: IAsset = {
        ...mockAsset,
        supply: 0,
      };

      mocks.useAssetMock.mockReturnValue({
        ...defaultUseAssetReturn,
        asset: assetWithZeroSupply,
        agents: mockAgents,
        investors: mockInvestors,
      });

      renderHook(() => useAssetSetup({ tempAsset: undefined }));

      // Should not progress to success step with zero supply
      expect(mockSetState).not.toHaveBeenCalledWith('success');
    });

    it('should handle tempAsset uuid change', () => {
      const firstAsset: IAsset = { ...mockAsset, uuid: 'first-uuid' };
      const secondAsset: IAsset = { ...mockAsset, uuid: 'second-uuid' };

      const { rerender } = renderHook(
        ({ tempAsset }) => useAssetSetup({ tempAsset }),
        {
          initialProps: { tempAsset: firstAsset },
        },
      );

      expect(mocks.setAssetMock).toHaveBeenCalledWith(firstAsset);

      mocks.setAssetMock.mockClear();

      // Change tempAsset uuid
      rerender({ tempAsset: secondAsset });

      expect(mocks.setAssetMock).toHaveBeenCalledWith(secondAsset);
    });
  });
});
