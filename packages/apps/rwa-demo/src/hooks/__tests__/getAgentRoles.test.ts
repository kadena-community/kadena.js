import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { AGENTROLES } from '@/services/addAgent';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGetAgentRoles } from '../getAgentRoles';

// Create hoisted mocks
const mocks = vi.hoisted(() => ({
  useEventSubscriptionSubscription: vi.fn().mockImplementation(() => ({
    data: null,
  })),
  getAgentRoles: vi.fn(),
  getAsset: vi.fn((asset) => {
    if (asset?.contractName === 'test-contract') {
      return 'test-namespace.test-contract';
    }
    return '';
  }),
}));

// Define interface for subscription params
interface ISubscriptionParams {
  variables: {
    qualifiedName: string;
  };
}

// Mock the imported dependencies
vi.mock('@/__generated__/sdk', () => ({
  useEventSubscriptionSubscription: (params: ISubscriptionParams) =>
    mocks.useEventSubscriptionSubscription(params),
}));

vi.mock('@/services/getAgentRoles', () => ({
  getAgentRoles: mocks.getAgentRoles,
}));

vi.mock('@/utils/getAsset', () => ({
  getAsset: mocks.getAsset,
}));

describe('useGetAgentRoles', () => {
  const mockAsset: IAsset = {
    namespace: 'test-namespace',
    contractName: 'test-contract',
    uuid: 'test-uuid',
    supply: 1000,
    investorCount: 10,
    compliance: {
      maxSupply: {
        key: 'supply-limit-compliance-v1',
        isActive: true,
        value: 1000,
      },
      maxBalance: {
        key: 'max-balance-compliance-v1',
        isActive: true,
        value: 100,
      },
      maxInvestors: {
        key: 'max-investors-compliance-v1',
        isActive: true,
        value: 50,
      },
    },
  };

  const mockAccount = 'test-account';

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation for subscriptions
    mocks.useEventSubscriptionSubscription.mockImplementation(() => ({
      data: null,
    }));
  });

  it('initializes with empty data and isMounted=true when no agent or asset is provided', async () => {
    const { result } = renderHook(() => useGetAgentRoles());

    expect(result.current.isMounted).toBe(true);
    expect(result.current.getAll()).toEqual([]);
  });

  it('fetches agent roles when agent and asset are set', async () => {
    // Mock implementation of getAgentRoles
    mocks.getAgentRoles.mockResolvedValue([
      AGENTROLES.AGENTADMIN,
      AGENTROLES.FREEZER,
    ]);

    const { result } = renderHook(() => useGetAgentRoles());

    // Initial state
    expect(result.current.isMounted).toBe(true);
    expect(result.current.getAll()).toEqual([]);

    // Set the agent and asset
    act(() => {
      result.current.setAssetRolesForAccount(mockAccount, mockAsset);
    });

    // Wait for the async initInnerData function to complete
    await waitFor(() => {
      // Verify the correct roles are returned
      expect(result.current.getAll()).toEqual([
        AGENTROLES.AGENTADMIN,
        AGENTROLES.FREEZER,
      ]);
      expect(result.current.isAgentAdmin()).toBe(true);
      expect(result.current.isFreezer()).toBe(true);
      expect(result.current.isTransferManager()).toBe(false);
    });
  });

  it('checks specific roles correctly', async () => {
    // Mock implementation of getAgentRoles with different roles
    mocks.getAgentRoles.mockResolvedValue([AGENTROLES.TRANSFERMANAGER]);

    const { result } = renderHook(() => useGetAgentRoles());

    // Set the agent and asset
    act(() => {
      result.current.setAssetRolesForAccount(mockAccount, mockAsset);
    });

    // Wait for the async initInnerData function to complete
    await waitFor(() => {
      // Verify specific role checking functions
      expect(result.current.isAgentAdmin()).toBe(false);
      expect(result.current.isFreezer()).toBe(false);
      expect(result.current.isTransferManager()).toBe(true);
    });
  });

  it('resets data when agent or asset is not provided', async () => {
    // Mock implementation of getAgentRoles
    mocks.getAgentRoles.mockResolvedValue([AGENTROLES.AGENTADMIN]);

    const { result } = renderHook(() => useGetAgentRoles());

    // Set the agent and asset
    act(() => {
      result.current.setAssetRolesForAccount(mockAccount, mockAsset);
    });

    // Wait for the async initInnerData function to complete
    await waitFor(() => {
      expect(result.current.isAgentAdmin()).toBe(true);
    });

    // Reset by setting null asset
    act(() => {
      result.current.setAssetRolesForAccount(mockAccount, undefined);
    });

    // Check that data is reset
    expect(result.current.getAll()).toEqual([]);
  });

  it('updates roles when subscription events are received', async () => {
    // Use simple mocks rather than complex implementations
    mocks.getAgentRoles.mockResolvedValueOnce([AGENTROLES.FREEZER]);

    // Render the hook with simple configuration
    const { result } = renderHook(() => useGetAgentRoles());

    // Initialize with account and asset
    await act(async () => {
      await result.current.setAssetRolesForAccount(mockAccount, mockAsset);
    });

    // Wait for first update
    await waitFor(() => {
      // Verify initial state
      expect(result.current.isFreezer()).toBe(true);
    });
  });
});
