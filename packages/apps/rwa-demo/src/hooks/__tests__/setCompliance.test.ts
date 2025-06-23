import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { setCompliance } from '@/services/setCompliance';
import { setComplianceParameters } from '@/services/setComplianceParameters';
import { getActiveRulesKeys } from '@/utils/getActiveRulesKeys';
import { renderHook } from '@testing-library/react-hooks';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSetCompliance } from '../setCompliance';

vi.mock('@/utils/getActiveRulesKeys', () => ({
  getActiveRulesKeys: vi.fn().mockReturnValue(['rule1', 'rule2']),
}));

vi.mock('@/services/setCompliance', () => ({
  setCompliance: vi.fn().mockResolvedValue({
    cmd: 'test-unsigned-setcompliance-command',
  }),
}));

vi.mock('@/services/setComplianceParameters', () => ({
  setComplianceParameters: vi.fn().mockResolvedValue({
    cmd: 'test-unsigned-setcomplianceparameters-command',
  }),
}));

describe('setCompliance hook', () => {
  const mocksHook = vi.hoisted(() => {
    return {
      useAsset: vi.fn().mockReturnValue({
        asset: {
          id: 'asset-123',
          name: 'Test Asset',
          compliance: {
            rule1: true,
            rule2: false,
            rule3: true,
          },
        },
        paused: true,
      }),
      useAccount: vi.fn().mockReturnValue({
        account: {
          address: 'k:1',
        },
        sign: vi.fn(),
        isMounted: true,
        isOwner: false,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
        },
      }),

      useTransactions: vi.fn().mockReturnValue({
        addTransaction: vi.fn(),
        isActiveAccountChangeTx: false,
      }),
      useNotifications: vi.fn().mockReturnValue({
        addNotification: vi.fn(),
      }),
      useSubmit2Chain: vi.fn().mockReturnValue({
        submit2Chain: vi
          .fn()
          .mockImplementation((data, { chainFunction, transaction }) => {
            return Promise.resolve({
              requestKey: 'test-request-key',
              hash: 'test-hash',
            });
          }),
      }),
    };
  });

  beforeEach(async () => {
    vi.mock('./../account', async () => {
      const actual = await vi.importActual('./../account');
      return {
        ...actual,
        useAccount: mocksHook.useAccount,
      };
    });

    vi.mock('./../asset', async () => {
      const actual = await vi.importActual('./../asset');
      return {
        ...actual,
        useAsset: mocksHook.useAsset,
      };
    });

    vi.mock('./../transactions', async () => {
      const actual = await vi.importActual('./../transactions');
      return {
        ...actual,
        useTransactions: mocksHook.useTransactions,
      };
    });

    vi.mock('@/hooks/notifications', async () => {
      const actual = await vi.importActual('@/hooks/notifications');
      return {
        ...actual,
        useNotifications: mocksHook.useNotifications,
      };
    });

    vi.mock('./../useSubmit2Chain', async () => {
      const actual = await vi.importActual('./../useSubmit2Chain');
      return {
        ...actual,
        useSubmit2Chain: mocksHook.useSubmit2Chain,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct properties', async () => {
    const { result } = renderHook(() => useSetCompliance());
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
    expect(result.current.hasOwnProperty('toggleComplianceRule')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true, when account is mounted, when contract is NOT paused, when account has role ADMIN, when account is NOT owner, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isOwner: false,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() => useSetCompliance());

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return true, when account is mounted, when contract is NOT paused, when account has NOT role ADMIN, when account is owner, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isOwner: true,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() => useSetCompliance());

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return false, when account is NOT mounted, when contract is NOT paused, when account has role ADMIN, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isOwner: false,
        isMounted: false,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() => useSetCompliance());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is paused, when account has role ADMIN, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isOwner: false,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: true,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() => useSetCompliance());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is NOT paused, when account has NO role ADMIN and not owner, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isOwner: false,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(false),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() => useSetCompliance());

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is mounted, when contract is paused, when account has role ADMIN, when IS activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isOwner: false,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));

      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: true,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: true,
      }));

      const { result } = renderHook(() => useSetCompliance());

      expect(result.current.isAllowed).toBe(false);
    });
  });

  describe('toggleComplianceRule', () => {
    it('should call submit2Chain with the correct parameters', async () => {
      const submit2ChainMock = vi.fn().mockResolvedValue({
        requestKey: 'test-request-key',
        hash: 'test-hash',
      });

      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: submit2ChainMock,
      });

      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isOwner: false,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));

      const mockAsset = {
        id: 'asset-123',
        name: 'Test Asset',
        compliance: {
          rule1: true,
          rule2: false,
          rule3: true,
        },
      };

      mocksHook.useAsset.mockImplementation(() => ({
        asset: mockAsset,
        paused: false,
      }));

      const { result } = renderHook(() => useSetCompliance());

      await result.current.toggleComplianceRule(
        'max-balance-compliance-v1',
        false,
      );

      // Check submit2Chain was called
      expect(submit2ChainMock).toHaveBeenCalledWith(undefined, {
        notificationSentryName: 'error:submit:togglecompliancerule',
        chainFunction: expect.any(Function),
        transaction: {
          type: TXTYPES.SETCOMPLIANCERULE,
          accounts: ['k:he-man'],
        },
      });

      // Test the chain function
      const chainFunction = submit2ChainMock.mock.calls[0][1].chainFunction;
      const mockAccount = { address: 'k:he-man' };
      await chainFunction(mockAccount, mockAsset);

      // Verify getActiveRulesKeys was called with correct parameters
      expect(getActiveRulesKeys).toHaveBeenCalledWith(
        mockAsset.compliance,
        'max-balance-compliance-v1',
        false,
      );

      // Verify setCompliance was called with correct parameters
      expect(setCompliance).toHaveBeenCalledWith(
        ['rule1', 'rule2'],
        mockAccount,
        mockAsset,
      );
    });
  });

  describe('submit', () => {
    it('should call submit2Chain with the correct parameters', async () => {
      const submit2ChainMock = vi.fn().mockResolvedValue({
        requestKey: 'test-request-key',
        hash: 'test-hash',
      });

      mocksHook.useSubmit2Chain.mockReturnValue({
        submit2Chain: submit2ChainMock,
      });

      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:he-man',
        },
        isOwner: false,
        isMounted: true,
        accountRoles: {
          isAgentAdmin: vi.fn().mockReturnValue(true),
        },
      }));

      const mockAsset = {
        id: 'asset-123',
        name: 'Test Asset',
        compliance: {
          rule1: true,
          rule2: false,
          rule3: true,
        },
      };

      mocksHook.useAsset.mockImplementation(() => ({
        asset: mockAsset,
        paused: false,
      }));

      const { result } = renderHook(() => useSetCompliance());

      const complianceParameters = {
        maxSupply: '1000',
        maxBalance: '100',
        maxInvestors: '50',
      };

      await result.current.submit(complianceParameters);

      // Check submit2Chain was called
      expect(submit2ChainMock).toHaveBeenCalledWith(complianceParameters, {
        notificationSentryName: 'error:submit:setcompliance',
        chainFunction: expect.any(Function),
        transaction: {
          type: TXTYPES.SETCOMPLIANCE,
          accounts: ['k:he-man'],
        },
      });

      // Test the chain function
      const chainFunction = submit2ChainMock.mock.calls[0][1].chainFunction;
      const mockAccount = { address: 'k:he-man' };
      await chainFunction(mockAccount, mockAsset);

      // Verify setComplianceParameters was called with correct parameters
      expect(setComplianceParameters).toHaveBeenCalledWith(
        complianceParameters,
        mockAccount,
        mockAsset,
      );
    });
  });
});
