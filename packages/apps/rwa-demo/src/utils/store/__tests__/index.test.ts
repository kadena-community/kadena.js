import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { describe, expect, it, vi } from 'vitest';
import {
  GetAccountsLocalStorageKey,
  getAccountVal,
  getAssetFolder,
  RWAStore,
} from '..';

describe('RWAstore', () => {
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
      it('should add a transaction for an asset', async () => {});
      it('should not add a transaction if asset folder is not defined', async () => {});
    });

    describe('removeTransaction', () => {
      it('should remove a transaction for an asset', async () => {});
      it('should not remove a transaction if asset folder is not defined', async () => {});
    });

    describe('getOverallTransactions', () => {
      it('should return overall transactions for an asset', async () => {});
      it('should return an empty array if no transactions exist', async () => {});
    });

    describe('listenToTransactions', () => {
      it('should listen to transactions for an asset', () => {});
      it('should call the callback with the correct transactions', () => {});
    });

    describe('getAccounts', () => {
      it('should return accounts for an asset', async () => {});
      it('should return an empty array if no user is given', async () => {});
    });

    describe('getAccount', () => {
      it('should return an account for an asset', async () => {});
      it('should return undefined if no account is found', async () => {});
    });

    describe('setAccount', () => {
      it('should set an account for an asset', async () => {});
      it('should not set an account if the account already existed', async () => {});
    });

    describe('setAllAccounts', () => {
      it('should set all accounts for an asset', async () => {});
    });

    describe('listenToAccount', () => {
      it('should listen to a specific account for an asset', () => {});
      it('should call the callback with the correct account data', () => {});
    });

    describe('listenToAccounts', () => {
      it('should listen to all accounts for an asset', () => {});
      it('should call the callback with the correct accounts data', () => {});
    });

    describe('getFrozenMessage', () => {
      it('should return the frozen message for an account', async () => {});
      it('should return undefined if no frozen message exists', async () => {});
    });

    describe('setFrozenMessage', () => {
      it('should set a frozen message for an account', async () => {});
      it('should not set a frozen message if asset folder is not defined', async () => {});
    });

    describe('setFrozenMessages', () => {
      it('should set frozen messages for multiple accounts', async () => {});
      it('should not set frozen messages if asset folder is not defined', async () => {});
    });
  });
});
