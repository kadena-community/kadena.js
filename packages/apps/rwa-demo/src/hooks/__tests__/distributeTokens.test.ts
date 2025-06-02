import { renderHook } from '@testing-library/react-hooks';
import { useDistributeTokens } from '../distributeTokens';

describe('distribute Tokens hook', () => {
  const mocksCompliance = vi.hoisted(() => {
    return {
      maxCompliance: vi.fn(),
    };
  });

  const mocksHook = vi.hoisted(() => {
    return {
      useFreeze: vi.fn().mockReturnValue({
        frozen: true,
      }),
      useAsset: vi.fn().mockReturnValue({
        paused: true,
        asset: {
          supply: 0,
          investorCount: 0,
        },
        maxCompliance: mocksCompliance.maxCompliance,
      }),

      useAccount: vi.fn().mockReturnValue({
        account: {
          address: 'k:skeletor',
        },
        sign: vi.fn(),
        isMounted: true,
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(false),
        },
      }),

      useGetInvestorBalance: vi.fn().mockReturnValue({
        data: 0,
      }),

      useTransactions: vi.fn().mockReturnValue({
        addTransaction: vi.fn(),
        isActiveAccountChangeTx: false,
      }),
      useNotifications: vi.fn().mockReturnValue({
        addNotification: vi.fn(),
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
    vi.mock('./../getInvestorBalance', async () => {
      const actual = await vi.importActual('./../getInvestorBalance');
      return {
        ...actual,
        useGetInvestorBalance: mocksHook.useGetInvestorBalance,
      };
    });

    vi.mock('./../freeze', async () => {
      const actual = await vi.importActual('./../freeze');
      return {
        ...actual,
        useFreeze: mocksHook.useFreeze,
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

    vi.mock('@kadena/kode-ui/patterns', async () => {
      const actual = await vi.importActual('@kadena/kode-ui/patterns');
      return {
        ...actual,
        useNotifications: mocksHook.useNotifications,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct properties', async () => {
    const { result } = renderHook(() =>
      useDistributeTokens({ investorAccount: 'k:1' }),
    );
    expect(result.current.hasOwnProperty('isAllowed')).toBe(true);
    expect(result.current.hasOwnProperty('submit')).toBe(true);
  });

  describe('isAllowed', () => {
    it('should return true, when account is mounted, when contract is NOT paused, when account is NOT frozen, when account has role transfermanager, when investorbalance is not empty, when compliance rules are not set, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:skeletor',
        },
        isMounted: true,
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(true),
        },
      }));
      mocksHook.useGetInvestorBalance.mockImplementation(() => ({
        ...mocksHook.useGetInvestorBalance.getMockImplementation(),
        data: 100,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
        asset: {
          supply: 10,
          investorCount: 2,
        },
        maxCompliance: mocksCompliance.maxCompliance.mockReturnValue(-1),
      }));
      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() =>
        useDistributeTokens({ investorAccount: 'k:skeletor' }),
      );

      expect(result.current.isAllowed).toBe(true);
    });

    it('should return false, when account is NOT mounted, when contract is NOT paused, when account is NOT frozen, when account has role transfermanager, when investorbalance is not empty, when compliance rules are not set, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:skeletor',
        },
        isMounted: false,
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(true),
        },
      }));
      mocksHook.useGetInvestorBalance.mockImplementation(() => ({
        ...mocksHook.useGetInvestorBalance.getMockImplementation(),
        data: 100,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
        asset: {
          supply: 10,
          investorCount: 2,
        },
        maxCompliance: mocksCompliance.maxCompliance.mockReturnValue(-1),
      }));
      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() =>
        useDistributeTokens({ investorAccount: 'k:skeletor' }),
      );

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is  mounted, when contract is paused, when account is NOT frozen, when account has role transfermanager, when investorbalance is not empty, when compliance rules are not set, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:skeletor',
        },
        isMounted: true,
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(true),
        },
      }));
      mocksHook.useGetInvestorBalance.mockImplementation(() => ({
        ...mocksHook.useGetInvestorBalance.getMockImplementation(),
        data: 100,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: true,
        asset: {
          supply: 10,
          investorCount: 2,
        },
        maxCompliance: mocksCompliance.maxCompliance.mockReturnValue(-1),
      }));
      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() =>
        useDistributeTokens({ investorAccount: 'k:skeletor' }),
      );

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is  mounted, when contract is NOT paused, when account is frozen, when account has role transfermanager, when investorbalance is not empty, when compliance rules are not set, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:skeletor',
        },
        isMounted: true,
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(true),
        },
      }));
      mocksHook.useGetInvestorBalance.mockImplementation(() => ({
        ...mocksHook.useGetInvestorBalance.getMockImplementation(),
        data: 100,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
        asset: {
          supply: 10,
          investorCount: 2,
        },
        maxCompliance: mocksCompliance.maxCompliance.mockReturnValue(-1),
      }));
      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: true,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() =>
        useDistributeTokens({ investorAccount: 'k:skeletor' }),
      );

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is  mounted, when contract is NOT paused, when account is NOT frozen, when account NOT has role transfermanager, when investorbalance is not empty, when compliance rules are not set, when no activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:skeletor',
        },
        isMounted: true,
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(false),
        },
      }));
      mocksHook.useGetInvestorBalance.mockImplementation(() => ({
        ...mocksHook.useGetInvestorBalance.getMockImplementation(),
        data: 100,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
        asset: {
          supply: 10,
          investorCount: 2,
        },
        maxCompliance: mocksCompliance.maxCompliance.mockReturnValue(-1),
      }));
      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: false,
      }));

      const { result } = renderHook(() =>
        useDistributeTokens({ investorAccount: 'k:skeletor' }),
      );

      expect(result.current.isAllowed).toBe(false);
    });

    it('should return false, when account is  mounted, when contract is NOT paused, when account is NOT frozen, when account has role transfermanager, when investorbalance is not empty, when compliance rules are not set, when IS activeAccountTx busy', () => {
      mocksHook.useAccount.mockImplementation(() => ({
        account: {
          address: 'k:skeletor',
        },
        isMounted: true,
        accountRoles: {
          isTransferManager: vi.fn().mockReturnValue(true),
        },
      }));
      mocksHook.useGetInvestorBalance.mockImplementation(() => ({
        ...mocksHook.useGetInvestorBalance.getMockImplementation(),
        data: 100,
      }));
      mocksHook.useAsset.mockImplementation(() => ({
        ...mocksHook.useAsset.getMockImplementation(),
        paused: false,
        asset: {
          supply: 10,
          investorCount: 2,
        },
        maxCompliance: mocksCompliance.maxCompliance.mockReturnValue(-1),
      }));
      mocksHook.useFreeze.mockImplementation(() => ({
        ...mocksHook.useFreeze.getMockImplementation(),
        frozen: false,
      }));
      mocksHook.useTransactions.mockImplementation(() => ({
        ...mocksHook.useTransactions.getMockImplementation(),
        isActiveAccountChangeTx: true,
      }));

      const { result } = renderHook(() =>
        useDistributeTokens({ investorAccount: 'k:skeletor' }),
      );

      expect(result.current.isAllowed).toBe(false);
    });

    describe('compliance max supply', () => {
      it('should return false, when defaults, but compliance mxsupplyis lower than the supply', () => {
        mocksHook.useAccount.mockImplementation(() => ({
          account: {
            address: 'k:skeletor',
          },
          isMounted: true,
          accountRoles: {
            isTransferManager: vi.fn().mockReturnValue(true),
          },
        }));
        mocksHook.useGetInvestorBalance.mockImplementation(() => ({
          ...mocksHook.useGetInvestorBalance.getMockImplementation(),
          data: 0,
        }));
        mocksHook.useAsset.mockImplementation(() => ({
          ...mocksHook.useAsset.getMockImplementation(),
          paused: false,
          asset: {
            supply: 10,
            investorCount: 2,
          },
          maxCompliance: mocksCompliance.maxCompliance.mockImplementation(
            (arg) => {
              if (arg === 'supply-limit-compliance-v1') {
                return 1;
              }
              return -1;
            },
          ),
        }));
        mocksHook.useFreeze.mockImplementation(() => ({
          ...mocksHook.useFreeze.getMockImplementation(),
          frozen: false,
        }));
        mocksHook.useTransactions.mockImplementation(() => ({
          ...mocksHook.useTransactions.getMockImplementation(),
          isActiveAccountChangeTx: false,
        }));

        const { result } = renderHook(() =>
          useDistributeTokens({ investorAccount: 'k:skeletor' }),
        );

        expect(result.current.isAllowed).toBe(false);
      });

      it('should return true, when defaults, but compliance mxsupplyis higher than the supply', () => {
        mocksHook.useAccount.mockImplementation(() => ({
          account: {
            address: 'k:skeletor',
          },
          isMounted: true,
          accountRoles: {
            isTransferManager: vi.fn().mockReturnValue(true),
          },
        }));
        mocksHook.useGetInvestorBalance.mockImplementation(() => ({
          ...mocksHook.useGetInvestorBalance.getMockImplementation(),
          data: 0,
        }));
        mocksHook.useAsset.mockImplementation(() => ({
          ...mocksHook.useAsset.getMockImplementation(),
          paused: false,
          asset: {
            supply: 10,
            investorCount: 2,
          },
          maxCompliance: mocksCompliance.maxCompliance.mockImplementation(
            (arg) => {
              if (arg === 'supply-limit-compliance-v1') {
                return 100;
              }
              return -1;
            },
          ),
        }));
        mocksHook.useFreeze.mockImplementation(() => ({
          ...mocksHook.useFreeze.getMockImplementation(),
          frozen: false,
        }));
        mocksHook.useTransactions.mockImplementation(() => ({
          ...mocksHook.useTransactions.getMockImplementation(),
          isActiveAccountChangeTx: false,
        }));

        const { result } = renderHook(() =>
          useDistributeTokens({ investorAccount: 'k:skeletor' }),
        );

        expect(result.current.isAllowed).toBe(true);
      });
    });

    describe('compliance max investors', () => {
      it('should return false, when defaults, but compliance maxInvestors is set and is lower than investorCount', () => {
        mocksHook.useAccount.mockImplementation(() => ({
          account: {
            address: 'k:skeletor',
          },
          isMounted: true,
          accountRoles: {
            isTransferManager: vi.fn().mockReturnValue(true),
          },
        }));
        mocksHook.useGetInvestorBalance.mockImplementation(() => ({
          ...mocksHook.useGetInvestorBalance.getMockImplementation(),
          data: 0,
        }));
        mocksHook.useAsset.mockImplementation(() => ({
          ...mocksHook.useAsset.getMockImplementation(),
          paused: false,
          asset: {
            supply: 10,
            investorCount: 2,
          },
          maxCompliance: mocksCompliance.maxCompliance.mockImplementation(
            (arg) => {
              if (arg === 'max-investors-compliance') {
                return 1;
              }
              return -1;
            },
          ),
        }));
        mocksHook.useFreeze.mockImplementation(() => ({
          ...mocksHook.useFreeze.getMockImplementation(),
          frozen: false,
        }));
        mocksHook.useTransactions.mockImplementation(() => ({
          ...mocksHook.useTransactions.getMockImplementation(),
          isActiveAccountChangeTx: false,
        }));

        const { result } = renderHook(() =>
          useDistributeTokens({ investorAccount: 'k:skeletor' }),
        );

        expect(result.current.isAllowed).toBe(false);
      });

      it('should return true, when defaults, but compliance maxInvestors is set and is higher than investorCount', () => {
        mocksHook.useAccount.mockImplementation(() => ({
          account: {
            address: 'k:skeletor',
          },
          isMounted: true,
          accountRoles: {
            isTransferManager: vi.fn().mockReturnValue(true),
          },
        }));
        mocksHook.useGetInvestorBalance.mockImplementation(() => ({
          ...mocksHook.useGetInvestorBalance.getMockImplementation(),
          data: 100,
        }));
        mocksHook.useAsset.mockImplementation(() => ({
          ...mocksHook.useAsset.getMockImplementation(),
          paused: false,
          asset: {
            supply: 10,
            investorCount: 2,
          },
          maxCompliance: mocksCompliance.maxCompliance.mockImplementation(
            (arg) => {
              if (arg === 'max-investors-compliance') {
                return 13;
              }
              return -1;
            },
          ),
        }));
        mocksHook.useFreeze.mockImplementation(() => ({
          ...mocksHook.useFreeze.getMockImplementation(),
          frozen: false,
        }));
        mocksHook.useTransactions.mockImplementation(() => ({
          ...mocksHook.useTransactions.getMockImplementation(),
          isActiveAccountChangeTx: false,
        }));

        const { result } = renderHook(() =>
          useDistributeTokens({ investorAccount: 'k:skeletor' }),
        );

        expect(result.current.isAllowed).toBe(true);
      });

      it('should return true, when defaults, but compliance maxInvestors is set and is the same than investorCount', () => {
        mocksHook.useAccount.mockImplementation(() => ({
          account: {
            address: 'k:skeletor',
          },
          isMounted: true,
          accountRoles: {
            isTransferManager: vi.fn().mockReturnValue(true),
          },
        }));
        mocksHook.useGetInvestorBalance.mockImplementation(() => ({
          ...mocksHook.useGetInvestorBalance.getMockImplementation(),
          data: 100,
        }));
        mocksHook.useAsset.mockImplementation(() => ({
          ...mocksHook.useAsset.getMockImplementation(),
          paused: false,
          asset: {
            supply: 10,
            investorCount: 2,
          },
          maxCompliance: mocksCompliance.maxCompliance.mockImplementation(
            (arg) => {
              if (arg === 'max-investors-compliance') {
                return 2;
              }
              return -1;
            },
          ),
        }));
        mocksHook.useFreeze.mockImplementation(() => ({
          ...mocksHook.useFreeze.getMockImplementation(),
          frozen: false,
        }));
        mocksHook.useTransactions.mockImplementation(() => ({
          ...mocksHook.useTransactions.getMockImplementation(),
          isActiveAccountChangeTx: false,
        }));

        const { result } = renderHook(() =>
          useDistributeTokens({ investorAccount: 'k:skeletor' }),
        );

        expect(result.current.isAllowed).toBe(true);
      });
    });
  });
});
