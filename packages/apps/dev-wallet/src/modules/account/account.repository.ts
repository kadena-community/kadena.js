import { IDBService, dbService } from '@/modules/db/db.service';
import { BuiltInPredicate, ChainId } from '@kadena/client';

export interface Fungible {
  contract: string; // unique identifier
  title: string;
  symbol: string;
  interface: 'fungible-v2';
  chainIds: ChainId[];
  wrappedFungibleId?: string; // if it's a wrapped token
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
  networkId: string;
  profileId: string;
  contract: string;
  keysetId: string;
  address: string;
  overallBalance: string;
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
    addKeyset: async (keyset: IKeySet): Promise<void> => {
      return add('keyset', keyset);
    },
    updateKeyset: async (keyset: IKeySet): Promise<void> => {
      return update('keyset', keyset);
    },
    getKeyset: async (id: string): Promise<IKeySet> => {
      return getOne('keyset', id);
    },
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
