import { IDBService, dbService } from '@/modules/db/db.service';
import { execInSequence } from '@/utils/helpers';
import { BuiltInPredicate, ChainId } from '@kadena/client';
import { UUID } from '../types';
import { Guard, KeysetGuard, KeysetRefGuard } from './guards';

export type IGuard = Guard & {
  principal: string;
};

export type IKeysetGuard = KeysetGuard & {
  principal: string;
};

export type IKeysetRefGuard = KeysetRefGuard & {
  principal: string;
};

export interface Fungible {
  contract: string; // unique identifier
  title: string;
  symbol: string;
  interface: 'fungible-v2';
  networkUUIDs?: UUID[];
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
  address: string;
  overallBalance: string;
  chains: Array<{
    chainId: ChainId;
    balance: string;
  }>;
  guard: IKeysetGuard;
  keysetId?: string;
  alias?: string;
  syncTime?: number;
}

export type IWatchedAccount = Omit<IAccount, 'guard' | 'keysetId'> & {
  guard: IGuard;
  watched: true;
};

const createAccountRepository = ({
  getAll,
  getOne,
  add,
  update,
  remove,
}: IDBService) => {
  const getKeyset = async (id: string): Promise<IKeySet> => {
    return getOne('keyset', id);
  };
  const actions = {
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
      return add('account', account);
    },

    updateAccount: async (account: IAccount): Promise<void> => {
      return update('account', account);
    },
    deleteAccount: async (uuid: string): Promise<void> => {
      return remove('account', uuid);
    },
    getAccount: async (id: string): Promise<IAccount> => {
      return getOne('account', id);
    },
    getAccountsByAddress: async (address: string) => {
      const account: Array<IAccount> = await getAll(
        'account',
        address,
        'address',
      );
      return account;
    },
    getAccountByKeyset: async (keysetId: string) => {
      const accounts: IAccount[] = await getAll(
        'account',
        keysetId,
        'keysetId',
      );
      return accounts;
    },
    async getAccountsByProfileId(
      profileId: string,
      networkUUID?: UUID,
    ): Promise<IAccount[]> {
      if (networkUUID) {
        return getAll(
          'account',
          IDBKeyRange.only([profileId, networkUUID]),
          'profile-network',
        );
      }
      return getAll('account', profileId, 'profileId');
    },
    addFungible: async (fungible: Fungible): Promise<void> => {
      return add('fungible', fungible);
    },
    updateFungible: async (fungible: Fungible): Promise<void> => {
      return update('fungible', fungible);
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

    patchAccount: async (
      uuid: string,
      patch: Partial<IAccount>,
    ): Promise<IAccount> => {
      const account = await actions.getAccount(uuid);
      const updatedAccount = { ...account, ...patch };
      await actions.updateAccount(updatedAccount);
      return updatedAccount;
    },
    patchWatchedAccount: async (
      uuid: string,
      patch: Partial<IWatchedAccount>,
    ): Promise<IWatchedAccount> => {
      const account = (await getOne(
        'watched-account',
        uuid,
      )) as IWatchedAccount;
      const updatedAccount = { ...account, ...patch };
      await actions.updateWatchedAccount(updatedAccount);
      return updatedAccount;
    },
    async getWatchedAccountsByProfileId(
      profileId: string,
      networkUUID?: UUID,
    ): Promise<IWatchedAccount[]> {
      if (networkUUID) {
        return getAll(
          'watched-account',
          IDBKeyRange.only([profileId, networkUUID]),
          'profile-network',
        );
      }
      return getAll('watched-account', profileId, 'profileId');
    },
  };
  return actions;
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
    };
    await accountRepository.addFungible(coin);
  }
});

export const isWatchedAccount = (
  account: IWatchedAccount | IAccount | undefined,
): account is IWatchedAccount => {
  return Boolean(account && 'watched' in account && account.watched);
};
