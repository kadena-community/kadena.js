import { injectDb } from '@/modules/db/db.service';
import {
  addItem,
  getAllItems,
  getOneItem,
  updateItem,
} from '@/modules/db/indexeddb';
import { BuiltInPredicate } from '@kadena/client';

export interface IKeySetGuard {
  keys: string[];
  pred: BuiltInPredicate;
}

export interface IAccount {
  uuid: string;
  profileId: string;
  alias?: string;
  address: string;
  guard: IKeySetGuard; // this could be extended to support other guards
}

export interface Token {
  uuid: string;
  name: string;
  contract: string;
}

export interface TokenBalance {
  uuid: string;
  accountId: string;
  tokenId: string;
  networkId: string;
  chains: Array<{
    chainId: string;
    balance: string;
  }>;
}

const createAccountRepository = () => {
  const getAll = injectDb(getAllItems);
  const getOne = injectDb(getOneItem);
  const add = injectDb(addItem);
  const update = injectDb(updateItem);

  return {
    addAccount: async (account: IAccount): Promise<void> => {
      return add('account', account);
    },
    updateAccount: async (account: IAccount): Promise<void> => {
      return update('account', account);
    },
    getAccount: async (id: string): Promise<IAccount> => {
      return getOne('account', id);
    },
    getAccountsByProfileId(profileId: string): Promise<IAccount[]> {
      return getAll('account', profileId, 'profileId');
    },
  };
};

export const accountRepository = createAccountRepository();
