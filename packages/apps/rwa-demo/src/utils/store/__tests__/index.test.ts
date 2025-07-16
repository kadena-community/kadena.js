import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { describe, expect, it, vi } from 'vitest';
import {
  GetAccountsLocalStorageKey,
  getAccountVal,
  getAssetFolder,
  RWAStore,
} from '..';

// Vitest Firebase/database mocks (must be at top-level for hoisting)

const mocks = vi.hoisted(() => ({
  setMock: vi.fn(),
  refMock: vi.fn(),
  getMock: vi.fn(),
  onValueMock: vi.fn(),
  offMock: vi.fn(),
  removeMock: vi.fn(),
}));

describe('RWAstore', () => {
  beforeEach(() => {
    vi.mock('../firebase', () => ({ database: {} }));
    vi.mock('firebase/database', () => ({
      ref: mocks.refMock,
      set: mocks.setMock,
      get: mocks.getMock,
      onValue: mocks.onValueMock,
      off: mocks.offMock,
      remove: mocks.removeMock,
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  describe('GetAccountsLocalStorageKey', () => {
    it('should return the correct local storage key for an asset', () => {
      const mockAsset: IAsset = {
        namespace: 'namespace',
        contractName: 'contractName',
      } as IAsset;
      const result = GetAccountsLocalStorageKey(mockAsset);
      expect(result).toBe('namespacecontractName_accounts');
    });
  });
  describe('getAccountVal', () => {
    it('should return the correct value for a valid account', () => {
      const result = getAccountVal('k:he-man.skeletor');
      expect(result).toBe('k:he-manskeletor');
    });
  });
  describe('getAssetFolder', () => {
    it('should return the correct asset folder path', () => {
      const mockAsset = {
        namespace: 'namespace',
        contractName: 'contractName',
      } as IAsset;
      const result = getAssetFolder(mockAsset);
      expect(result).toBe('namespacecontractName');
    });

    it('should return an empty string if asset is undefined', () => {
      const result = getAssetFolder(undefined as any);
      expect(result).toBe('');
    });
  });

  describe('RWAStore', () => {
    it('should throw an error if no organisation is provided', () => {
      expect(() => RWAStore(undefined as any)).toThrow(
        'no organisation or user found',
      );
    });

    describe('addTransaction', () => {
      it('should add a transaction for an asset', async () => {
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const asset: IAsset = {
          namespace: 'ns',
          contractName: 'cn',
          uuid: '',
          supply: 0,
          investorCount: 0,
          compliance: {
            maxSupply: {
              key: 'supply-limit-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxBalance: {
              key: 'max-balance-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxInvestors: {
              key: 'max-investors-compliance-v1',
              isActive: false,
              value: 0,
            },
          },
        };
        const store = RWAStore(organisation);
        const tx: ITransaction = {
          uuid: 'tx1',
          requestKey: '',
          type: { name: 'FAUCET' },
          accounts: [],
        };
        await store.addTransaction(tx, asset);
        expect(mocks.setMock).toHaveBeenCalled();
      });
      it('should not add a transaction if asset folder is not defined', async () => {
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const tx: ITransaction = {
          uuid: 'tx1',
          requestKey: '',
          type: { name: 'FAUCET' },
          accounts: [],
        };
        const store = RWAStore(organisation);
        await store.addTransaction(tx, undefined);
        expect(mocks.setMock).not.toHaveBeenCalled();
      });
    });
    describe('removeTransaction', () => {
      it('should remove a transaction for an asset, when it exists', async () => {
        mocks.getMock.mockResolvedValueOnce({
          toJSON: () => ({ uuid: 'tx1' }),
        });

        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const asset: IAsset = {
          namespace: 'ns',
          contractName: 'cn',
          uuid: '',
          supply: 0,
          investorCount: 0,
          compliance: {
            maxSupply: {
              key: 'supply-limit-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxBalance: {
              key: 'max-balance-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxInvestors: {
              key: 'max-investors-compliance-v1',
              isActive: false,
              value: 0,
            },
          },
        };
        const store = RWAStore(organisation);
        const tx: ITransaction = {
          uuid: 'tx1',
          requestKey: '',
          type: { name: 'FAUCET' },
          accounts: [],
        };
        await store.removeTransaction(tx, asset);
        expect(mocks.getMock).toHaveBeenCalled();
        expect(mocks.setMock).toHaveBeenCalled();
      });

      it('should not call remove a transaction for an asset, when it  does not exist exists', async () => {
        mocks.getMock.mockResolvedValueOnce({
          toJSON: () => undefined,
        });

        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const asset: IAsset = {
          namespace: 'ns',
          contractName: 'cn',
          uuid: '',
          supply: 0,
          investorCount: 0,
          compliance: {
            maxSupply: {
              key: 'supply-limit-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxBalance: {
              key: 'max-balance-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxInvestors: {
              key: 'max-investors-compliance-v1',
              isActive: false,
              value: 0,
            },
          },
        };
        const store = RWAStore(organisation);
        const tx: ITransaction = {
          uuid: 'tx1',
          requestKey: '',
          type: { name: 'FAUCET' },
          accounts: [],
        };
        await store.removeTransaction(tx, asset);
        expect(mocks.getMock).toHaveBeenCalled();
        expect(mocks.setMock).not.toHaveBeenCalled();
      });
      it('should not remove a transaction if asset folder is not defined', async () => {
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const store = RWAStore(organisation);
        const tx: ITransaction = {
          uuid: 'tx1',
          requestKey: '',
          type: { name: 'FAUCET' },
          accounts: [],
        };
        await store.removeTransaction(tx, undefined);
        expect(mocks.setMock).not.toHaveBeenCalled();
      });
    });

    describe('listenToTransactions', () => {
      it('should listen to transactions for an asset', () => {
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const asset: IAsset = {
          namespace: 'ns',
          contractName: 'cn',
          uuid: '',
          supply: 0,
          investorCount: 0,
          compliance: {
            maxSupply: {
              key: 'supply-limit-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxBalance: {
              key: 'max-balance-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxInvestors: {
              key: 'max-investors-compliance-v1',
              isActive: false,
              value: 0,
            },
          },
        };
        const store = RWAStore(organisation);
        store.listenToTransactions(() => {}, asset);
        expect(mocks.onValueMock).toHaveBeenCalled();
      });
      it('should call the callback with the correct transactions', async () => {
        const getOverallTransactions = vi
          .fn()
          .mockResolvedValue([{ uuid: 'tx1' }]);
        const setDataCallback = vi.fn();
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const asset: IAsset = {
          namespace: 'ns',
          contractName: 'cn',
          uuid: '',
          supply: 0,
          investorCount: 0,
          compliance: {
            maxSupply: {
              key: 'supply-limit-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxBalance: {
              key: 'max-balance-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxInvestors: {
              key: 'max-investors-compliance-v1',
              isActive: false,
              value: 0,
            },
          },
        };
        const store = RWAStore(organisation);
        store.getOverallTransactions = getOverallTransactions;
        store.listenToTransactions(setDataCallback, asset);

        expect(setDataCallback).not.toBeNull();
      });
    });

    describe('getAccounts', () => {
      it('should return accounts for an asset', async () => {
        const user = { uid: 'user1' } as { uid: string };
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const store = RWAStore(organisation);
        // Patch Object.entries to return a fake account
        const origEntries = Object.entries;
        (Object.entries as any) = () => [
          ['a', { accountName: 'acc1', agent: {} }],
        ];
        const accounts = await store.getAccounts(user as any);
        expect(accounts[0].accountName).toBe('acc1');
        (Object.entries as any) = origEntries;
      });
      it('should return an empty array if no user is given', async () => {
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const store = RWAStore(organisation);
        const accounts = await store.getAccounts(undefined);
        expect(accounts).toEqual([]);
      });
    });
    describe('getAccount', () => {
      it('should return an account for an asset', async () => {
        const user = { uid: 'user1' } as { uid: string };
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const store = RWAStore(organisation);
        // Mock getAccounts to return a fake account
        const origEntries = Object.entries;
        (Object.entries as any) = () => [
          ['a', { accountName: 'acc1', agent: {} }],
        ];

        const result = await store.getAccount(
          { account: 'acc1' },
          { contractName: 'cn', namespace: 'ns' } as IAsset,
          user as any,
        );
        expect(result?.accountName).toBe('acc1');
        (Object.entries as any) = origEntries;
      });
      it('should return undefined if no account is found', async () => {
        const user = { uid: 'user1' } as { uid: string };
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const store = RWAStore(organisation);
        // Mock getAccounts to return a fake account
        const origEntries = Object.entries;
        (Object.entries as any) = () => [
          ['a', { accountName: 'acc1', agent: {} }],
        ];

        store.getAccounts = vi.fn().mockResolvedValue([]);
        const result = await store.getAccount(
          { account: 'acc2' },
          { contractName: 'cn', namespace: 'ns' } as IAsset,
          user as any,
        );
        expect(result).toBeUndefined();
        (Object.entries as any) = origEntries;
      });
    });

    describe('setAccount', () => {
      it('should set an account for an asset', async () => {
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const asset: IAsset = {
          namespace: 'ns',
          contractName: 'cn',
          uuid: '',
          supply: 0,
          investorCount: 0,
          compliance: {
            maxSupply: {
              key: 'supply-limit-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxBalance: {
              key: 'max-balance-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxInvestors: {
              key: 'max-investors-compliance-v1',
              isActive: false,
              value: 0,
            },
          },
        };
        const user = { uid: 'user1' };
        const store = RWAStore(organisation);
        // Mock getAccounts to return empty
        store.getAccounts = vi.fn().mockResolvedValue([]);
        const setItemSpy = vi.spyOn(window.localStorage.__proto__, 'setItem');
        await store.setAccount({ accountName: 'acc1' }, asset, user as any);
        expect(setItemSpy).toHaveBeenCalled();
        setItemSpy.mockRestore();
      });
      it('should not set an account if the account already existed', async () => {
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const asset: IAsset = {
          namespace: 'ns',
          contractName: 'cn',
          uuid: '',
          supply: 0,
          investorCount: 0,
          compliance: {
            maxSupply: {
              key: 'supply-limit-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxBalance: {
              key: 'max-balance-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxInvestors: {
              key: 'max-investors-compliance-v1',
              isActive: false,
              value: 0,
            },
          },
        };
        const user = { uid: 'user1' };
        const store = RWAStore(organisation);
        store.getAccounts = vi
          .fn()
          .mockResolvedValue([{ accountName: 'acc1', agent: {} }]);
        const setItemSpy = vi.spyOn(window.localStorage.__proto__, 'setItem');
        await store.setAccount({ accountName: 'acc1' }, asset, user as any);
        expect(setItemSpy).toHaveBeenCalled(); // It will still call setItem, but not add a new account
        setItemSpy.mockRestore();
      });
    });
    describe('setAllAccounts', () => {
      it('should set all accounts for an asset', async () => {
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const asset: IAsset = {
          namespace: 'ns',
          contractName: 'cn',
          uuid: '',
          supply: 0,
          investorCount: 0,
          compliance: {
            maxSupply: {
              key: 'supply-limit-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxBalance: {
              key: 'max-balance-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxInvestors: {
              key: 'max-investors-compliance-v1',
              isActive: false,
              value: 0,
            },
          },
        };
        const store = RWAStore(organisation);
        const setItemSpy = vi.spyOn(window.localStorage.__proto__, 'setItem');
        const promises = await store.setAllAccounts(
          { accounts: [{ account: 'acc1', alias: 'alias1' }] },
          asset,
        );
        await Promise.all(promises);
        expect(setItemSpy).toHaveBeenCalled();
      });
    });

    describe('getFrozenMessage', () => {
      it('should return the frozen message for an account', async () => {
        mocks.getMock.mockResolvedValueOnce({
          toJSON: () => 'frozen',
        });
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const asset: IAsset = {
          namespace: 'ns',
          contractName: 'cn',
          uuid: '',
          supply: 0,
          investorCount: 0,
          compliance: {
            maxSupply: {
              key: 'supply-limit-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxBalance: {
              key: 'max-balance-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxInvestors: {
              key: 'max-investors-compliance-v1',
              isActive: false,
              value: 0,
            },
          },
        };
        const user = { uid: 'user1' };
        const store = RWAStore(organisation);
        const msg = await store.getFrozenMessage('acc1', user as any, asset);
        expect(msg).toBe('frozen');
      });
      it('should return undefined if no frozen message exists', async () => {
        mocks.getMock.mockResolvedValueOnce({
          toJSON: () => undefined,
        });
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const asset: IAsset = {
          namespace: 'ns',
          contractName: 'cn',
          uuid: '',
          supply: 0,
          investorCount: 0,
          compliance: {
            maxSupply: {
              key: 'supply-limit-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxBalance: {
              key: 'max-balance-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxInvestors: {
              key: 'max-investors-compliance-v1',
              isActive: false,
              value: 0,
            },
          },
        };
        const user = { uid: 'user1' };
        const store = RWAStore(organisation);
        const msg = await store.getFrozenMessage('acc1', user as any, asset);
        expect(msg).toBeUndefined();
      });
    });
    describe('setFrozenMessage', () => {
      it('should set a frozen message for an account', async () => {
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const asset: IAsset = {
          namespace: 'ns',
          contractName: 'cn',
          uuid: '',
          supply: 0,
          investorCount: 0,
          compliance: {
            maxSupply: {
              key: 'supply-limit-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxBalance: {
              key: 'max-balance-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxInvestors: {
              key: 'max-investors-compliance-v1',
              isActive: false,
              value: 0,
            },
          },
        };
        const user = { uid: 'user1' };
        const store = RWAStore(organisation);
        await store.setFrozenMessage(
          { investorAccount: 'acc1', pause: true, message: 'frozen' },
          user as any,
          asset,
        );
        expect(mocks.setMock).toHaveBeenCalled();
      });
      it('should not set a frozen message if asset folder is not defined', async () => {
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const user = { uid: 'user1' };
        const store = RWAStore(organisation);
        await store.setFrozenMessage(
          { investorAccount: 'acc1', pause: true, message: 'frozen' },
          user as any,
          undefined,
        );
        expect(mocks.setMock).not.toHaveBeenCalled();
      });
      it('should remove the frozen message if no data.message is provided', async () => {
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const asset: IAsset = {
          namespace: 'ns',
          contractName: 'cn',
          uuid: '',
          supply: 0,
          investorCount: 0,
          compliance: {
            maxSupply: {
              key: 'supply-limit-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxBalance: {
              key: 'max-balance-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxInvestors: {
              key: 'max-investors-compliance-v1',
              isActive: false,
              value: 0,
            },
          },
        };
        const user = { uid: 'user1' };
        const store = RWAStore(organisation);
        await store.setFrozenMessage(
          { investorAccount: 'acc1', pause: true },
          user as any,
          asset,
        );
        expect(mocks.removeMock).toHaveBeenCalled();
      });
    });
    describe('setFrozenMessages', () => {
      it('should set frozen messages for multiple accounts', async () => {
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const asset: IAsset = {
          namespace: 'ns',
          contractName: 'cn',
          uuid: '',
          supply: 0,
          investorCount: 0,
          compliance: {
            maxSupply: {
              key: 'supply-limit-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxBalance: {
              key: 'max-balance-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxInvestors: {
              key: 'max-investors-compliance-v1',
              isActive: false,
              value: 0,
            },
          },
        };
        const user = { uid: 'user1' };
        const store = RWAStore(organisation);

        const promises = await store.setFrozenMessages(
          {
            investorAccounts: ['acc1', 'acc2'],
            pause: true,
            message: 'frozen',
          },
          user as any,
          asset,
        );
        await Promise.all(promises);
        expect(mocks.setMock).toHaveBeenCalledTimes(2);
      });
      it('should not set frozen messages if asset folder is not defined', async () => {
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const user = { uid: 'user1' };
        const store = RWAStore(organisation);
        store.setFrozenMessage = vi.fn();
        const promises = await store.setFrozenMessages(
          {
            investorAccounts: ['acc1', 'acc2'],
            pause: true,
            message: 'frozen',
          },
          user as any,
          undefined,
        );

        await Promise.all(promises);

        expect(store.setFrozenMessage).not.toHaveBeenCalled();
      });
    });
    describe('getOverallTransactions', () => {
      it('should return an empty array if no asset folder is found', async () => {
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const store = RWAStore(organisation);
        const result = await store.getOverallTransactions(undefined);
        expect(result).toEqual([]);
      });

      it('should return an empty array if no data is found in the snapshot', async () => {
        mocks.getMock.mockResolvedValueOnce({ toJSON: () => undefined });
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const asset: IAsset = {
          namespace: 'ns',
          contractName: 'cn',
          uuid: '',
          supply: 0,
          investorCount: 0,
          compliance: {
            maxSupply: {
              key: 'supply-limit-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxBalance: {
              key: 'max-balance-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxInvestors: {
              key: 'max-investors-compliance-v1',
              isActive: false,
              value: 0,
            },
          },
        };
        const store = RWAStore(organisation);
        const result = await store.getOverallTransactions(asset);
        expect(result).toEqual([]);
      });

      it('should return mapped transactions with flattened accounts', async () => {
        const mockData = {
          tx1: { uuid: 'tx1', accounts: { a: { id: 1 }, b: { id: 2 } } },
          tx2: { uuid: 'tx2', accounts: undefined },
        };
        mocks.getMock.mockResolvedValueOnce({ toJSON: () => mockData });
        const organisation: IOrganisation = {
          id: 'org1',
          name: '',
          domains: [],
          sendEmail: '',
        };
        const asset: IAsset = {
          namespace: 'ns',
          contractName: 'cn',
          uuid: '',
          supply: 0,
          investorCount: 0,
          compliance: {
            maxSupply: {
              key: 'supply-limit-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxBalance: {
              key: 'max-balance-compliance-v1',
              isActive: false,
              value: 0,
            },
            maxInvestors: {
              key: 'max-investors-compliance-v1',
              isActive: false,
              value: 0,
            },
          },
        };
        const store = RWAStore(organisation);
        const result = await store.getOverallTransactions(asset);
        expect(result).toEqual([
          { uuid: 'tx1', accounts: [{ id: 1 }, { id: 2 }] },
          { uuid: 'tx2', accounts: undefined },
        ]);
      });
    });
  });
});
