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
    chainId: ChainId;
    balance: string;
  }>;
  keyset?: IKeySet;
}

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
  return {
    addKeyset: async (keyset: IKeySet): Promise<void> => {
      return add('keyset', keyset);
    },
    updateKeyset: async (keyset: IKeySet): Promise<void> => {
      return update('keyset', keyset);
    },
    getKeyset,
    addAccount: async (account: IAccount): Promise<void> => {
      return add('account', deleteKey(account, 'keyset' as const));
    },
    updateAccount: async (account: IAccount): Promise<void> => {
      return update('account', deleteKey(account, 'keyset'));
    },
    getAccount: async (id: string) => {
      const account: IAccount = await getOne('account', id);
      return {
        ...account,
        keyset: await getKeyset(account.keysetId),
      };
    },
    async getAccountsByProfileId(profileId: string) {
      const accounts: IAccount[] = await getAll(
        'account',
        profileId,
        'profileId',
      );
      return Promise.all(
        accounts.map(async (account) => ({
          ...account,
          keyset: await getKeyset(account.keysetId),
        })),
      );
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
