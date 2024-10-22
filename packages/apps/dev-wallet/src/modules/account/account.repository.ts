import { IDBService, dbService } from '@/modules/db/db.service';
import { execInSequence } from '@/utils/helpers';
import { BuiltInPredicate, ChainId } from '@kadena/client';
import { UUID } from '../types';

export interface Fungible {
  contract: string; // unique identifier
  title: string;
  symbol: string;
  interface: 'fungible-v2';
  chainIds: ChainId[];
}

export interface IKeySet {
  uuid: string; // principal of the keyset
  principal: string; // principal of the keyset
  profileId: string;
  alias?: string;
  guard: {
    keys: string[];
    pred: BuiltInPredicate;
  };
}

export interface IAccount {
  uuid: string;
  networkUUID: UUID;
  profileId: string;
  contract: string;
  keysetId: string;
  address: string;
  overallBalance: string;
  chains: Array<{
    chainId: ChainId;
    balance: string;
  }>;
  keyset?: IKeySet;
  alias?: string;
}

export type IWatchedAccount = Omit<IAccount, 'keysetId' | 'keyset'> & {
  keyset: {
    guard: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
  watched: true;
};

const deleteKey = <Key extends string, T extends Partial<Record<Key, unknown>>>(
  obj: T,
  key: Key,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: toBeDeleted, ...rest } = obj;
  return rest;
};

const createAccountRepository = ({
  getAll,
  getOne,
  add,
  update,
}: IDBService) => {
  const getKeyset = async (id: string): Promise<IKeySet> => {
    return getOne('keyset', id);
  };

  const appendKeyset = async (account: IAccount) => ({
    ...account,
    keyset: await getKeyset(account.keysetId),
  });
  return {
    async getKeysetByPrincipal(
      principal: string,
      profileId: string,
    ): Promise<IKeySet> {
      const list: IKeySet[] = await getAll(
        'keyset',
        IDBKeyRange.only([profileId, principal]),
        'unique-keyset',
      );
      return list[0];
    },
    addKeyset: async (keyset: IKeySet): Promise<void> => {
      return add('keyset', keyset);
    },
    updateKeyset: async (keyset: IKeySet): Promise<void> => {
      return update('keyset', keyset);
    },
    getKeyset,
    async getKeysetsByProfileId(profileId: string) {
      const keysets: IKeySet[] = await getAll('keyset', profileId, 'profileId');
      return keysets;
    },
    addAccount: async (account: IAccount): Promise<void> => {
      return add('account', deleteKey(account, 'keyset' as const));
    },

    updateAccount: async (account: IAccount): Promise<void> => {
      return update('account', deleteKey(account, 'keyset'));
    },
    getAccount: async (id: string) => {
      const account: IAccount = await getOne('account', id);
      return appendKeyset(account as IAccount);
    },
    getAccountByAddress: async (address: string) => {
      const account: Array<IAccount> = await getAll(
        'account',
        address,
        'address',
      );
      return Promise.all(account.map(appendKeyset));
    },
    getAccountByKeyset: async (keysetId: string) => {
      const accounts: IAccount[] = await getAll(
        'account',
        keysetId,
        'keysetId',
      );
      return accounts;
    },
    async getAccountsByProfileId(profileId: string, networkUUID: UUID) {
      const accounts: Array<IAccount> = await getAll(
        'account',
        IDBKeyRange.only([profileId, networkUUID]),
        'profile-network',
      );
      return Promise.all(accounts.map(appendKeyset));
    },
    addFungible: async (fungible: Fungible): Promise<void> => {
      return add('fungible', fungible);
    },
    getFungible: async (contract: string): Promise<Fungible> => {
      return getOne('fungible', contract);
    },
    getAllFungibles: async (): Promise<Fungible[]> => {
      return ((await getAll('fungible')) as Fungible[]).reverse();
    },
    addWatchedAccount: async (account: IWatchedAccount): Promise<void> => {
      return add('watched-account', account);
    },
    updateWatchedAccount: async (account: IWatchedAccount): Promise<void> => {
      return update('watched-account', account);
    },
    async getWatchedAccountsByProfileId(profileId: string, networkUUID: UUID) {
      const accounts: Array<IWatchedAccount> = await getAll(
        'watched-account',
        IDBKeyRange.only([profileId, networkUUID]),
        'profile-network',
      );
      return accounts;
    },
  };
};

export const chainIds = [...Array(20).keys()].map((key) => `${key}` as ChainId);

export const accountRepository = createAccountRepository(dbService);

export const addDefaultFungibles = execInSequence(async () => {
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
});

export const isWatchedAccount = (
  account: IWatchedAccount | IAccount | undefined,
): account is IWatchedAccount => {
  return Boolean(account && 'watched' in account && account.watched);
};
