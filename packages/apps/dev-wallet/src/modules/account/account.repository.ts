import { IDBService, dbService } from '@/modules/db/db.service';
import { BuiltInPredicate, ChainId } from '@kadena/client';

export interface Fungible {
  title: string;
  symbol: string;
  interface: 'fungible-v2';
  contract: string;
  chainIds: ChainId[];
  wrappedFungibleId?: string; // if it's a wrapped token
}

export interface IKeysetGuard {
  keys: string[];
  pred: BuiltInPredicate;
}

export interface IAccount {
  uuid: string;
  profileId: string;
  alias?: string;
  address: string;
  keysetGuard: IKeysetGuard;
  networkId: string;
  contracts: string[];
}

export interface AccountBalance {
  uuid: string;
  fungibleId: string;
  accountId: string;
  chains: Array<{
    chainId: string;
    balance: string;
  }>;
}

const createAccountRepository = ({
  getAll,
  getOne,
  add,
  update,
}: IDBService) => {
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
    addFungible: async (fungible: Fungible): Promise<void> => {
      return add('fungible', fungible);
    },
    getFungible: async (contract: string): Promise<Fungible> => {
      return getOne('fungible', contract);
    },
    getAllFungibles: async (): Promise<Fungible[]> => {
      return getAll('fungible');
    },
    getAccountBalances: async (
      accountId: string,
    ): Promise<AccountBalance[]> => {
      return getAll('accountBalance', accountId, 'accountId');
    },
    addAccountBalance: async (
      accountBalance: AccountBalance,
    ): Promise<void> => {
      return add('accountBalance', accountBalance);
    },
    updateAccountBalance: async (
      accountBalance: AccountBalance,
    ): Promise<void> => {
      return update('accountBalance', accountBalance);
    },
  };
};

export const chainIds = [...Array(20).keys()].map((key) => `${key}` as ChainId);

export const accountRepository = createAccountRepository(dbService);

export async function addDefaultFungibles() {
  const fungible = await accountRepository.getFungible('coin');

  if (!fungible) {
    const coin: Fungible = {
      title: 'Kadena Coin',
      symbol: 'KDA',
      interface: 'fungible-v2',
      contract: 'coin',
      chainIds,
    };
    await accountRepository.addFungible(coin);
  }
}
