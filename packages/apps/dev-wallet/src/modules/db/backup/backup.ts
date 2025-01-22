import {
  Fungible,
  IKeySet,
  IOwnedAccount,
  IWatchedAccount,
} from '@/modules/account/account.repository';
import { IActivity } from '@/modules/activity/activity.repository';
import { IContact } from '@/modules/contact/contact.repository';
import { INetwork } from '@/modules/network/network.repository';
import { ITransaction } from '@/modules/transaction/transaction.repository';
import { UUID } from '@/modules/types';
import { IKeySource, IProfile } from '@/modules/wallet/wallet.repository';
import { base64UrlEncodeArr, hash } from '@kadena/cryptography-utils';
import { addItem, dbDump, getAllItems, putItem } from '../indexeddb';

function BufferToBase64UrlReplacer(_key: string, value: any) {
  if (value instanceof Uint8Array) {
    // Convert Uint8Array to Base64Url string
    return `Uint8Array:${base64UrlEncodeArr(value)}`;
  }
  if (value instanceof ArrayBuffer) {
    // Convert Uint8Array to Base64Url string
    return `ArrayBuffer:${base64UrlEncodeArr(new Uint8Array(value))}`;
  }
  return value;
}

export const serializeTables = async (db: IDBDatabase) => {
  const dumpDatabase = dbDump(db);
  const dbData = await dumpDatabase();
  const { data } = dbData;
  const checksum = hash(JSON.stringify(data, BufferToBase64UrlReplacer));
  const backup: IDBBackup = { checksum, wallet_version: '3', ...dbData };
  return JSON.stringify(backup, BufferToBase64UrlReplacer, 2);
};

type Table<T> = Array<{ key: string; value: T }>;
export interface IDBBackup {
  checksum: string;
  wallet_version: string;
  db_name: string;
  db_version: number;
  timestamp: number;
  schemes: {
    name: string;
    keyPath: string | string[];
    autoIncrement: boolean;
    indexes: {
      name: string;
      keyPath: string | string[];
      unique: boolean;
      multiEntry: boolean;
    }[];
  }[];
  data: {
    profile: Table<IProfile>;
    encryptedValue: Table<{ uuid: string; profileId: string; value: string }>;
    keySource: Table<IKeySource>;
    account: Table<IOwnedAccount>;
    'watched-account': Table<IWatchedAccount>;
    network: Table<INetwork>;
    fungible: Table<Fungible>;
    keyset: Table<IKeySet>;
    transaction: Table<ITransaction>;
    activity: Table<IActivity>;
    contact: Table<IContact>;
  };
}

const importContacts = async (
  db: IDBDatabase,
  table: Table<IContact> = [],
  transaction: IDBTransaction,
) => {
  const dbContacts = await getAllItems(db, transaction)<IContact>('contact');
  const addOne = addItem(db, transaction);
  await Promise.all(
    table.map(async ({ value }) => {
      if (
        dbContacts.find((c) => c.name === value.name || c.uuid === value.uuid)
      ) {
        console.warn('Skipping contact', value);
        return;
      }
      return addOne('contact', value);
    }),
  );
};

const removeEndSlash = (url: string) => url.replace(/\/$/, '');

const importNetworks = async (
  db: IDBDatabase,
  table: Table<INetwork>,
  transaction: IDBTransaction,
) => {
  const addOne = addItem(db, transaction);
  const updateOne = addItem(db, transaction);
  const getAll = getAllItems(db, transaction);
  const networkRemap: Record<UUID, UUID> = {};
  await Promise.all(
    table.map(async ({ value }) => {
      const existingNetworks = await getAll<INetwork>(
        'network',
        value.networkId,
        'networkId',
      );
      if (!existingNetworks.length) {
        networkRemap[value.uuid] = value.uuid;
        return addOne('network', value);
      }
      const network = existingNetworks[0];
      networkRemap[value.uuid] = network.uuid;
      const filteredHosts = value.hosts.filter(
        ({ url }) =>
          !network.hosts.find(
            ({ url: existingUrl }) =>
              removeEndSlash(existingUrl) === removeEndSlash(url),
          ),
      );
      if (filteredHosts.length) {
        return updateOne('network', {
          ...network,
          hosts: [...network.hosts, ...filteredHosts],
        });
      }
    }),
  );
  return networkRemap;
};

const importFungibles = async (
  db: IDBDatabase,
  table: Table<Fungible> = [],
  networkRemap: Record<UUID, UUID> = {},
  transaction: IDBTransaction,
) => {
  const dbFungibles = await getAllItems(db, transaction)<Fungible>('fungible');
  const addOne = addItem(db, transaction);
  await Promise.all(
    table.map(async ({ value }) => {
      value.networkUUIDs = value.networkUUIDs?.map((id) => networkRemap[id]);
      if (dbFungibles.find((f) => f.contract === value.contract)) {
        console.warn('Skipping fungible', value);
        return;
      }
      return addOne('fungible', value);
    }),
  );
};

const importProfiles = async (
  db: IDBDatabase,
  table: Table<IProfile> = [],
  transaction: IDBTransaction,
) => {
  const fistPartOfUUID = (uuid: string) => uuid.split('-')[0];
  const put = putItem(db, transaction);
  const dbProfiles = await getAllItems(db, transaction)<IProfile>('profile');
  const profiles = table.map(({ value }) => {
    const dbProfile = dbProfiles.find((p) => p.name === value.name);
    const name = dbProfile
      ? dbProfile.uuid === value.uuid
        ? value.name
        : value.name + `(${fistPartOfUUID(value.uuid)})`
      : value.name;
    return {
      ...value,
      name,
    };
  });
  await Promise.all(profiles.map(async (profile) => put('profile', profile)));
};

export const profileTables = [
  'encryptedValue',
  'keySource',
  'account',
  'keyset',
  'transaction',
  'activity',
] as const;

const importProfileRelatedTables = async ({
  backup,
  profileUUIds,
  db,
  transaction,
  networkRemap,
}: {
  backup: IDBBackup;
  profileUUIds: string[] | undefined;
  db: IDBDatabase;
  transaction: IDBTransaction;
  networkRemap: Record<UUID, UUID>;
}) => {
  const put = putItem(db, transaction);

  await profileTables.map(async (table) => {
    const data = backup.data[table];
    await Promise.all(
      data.map(({ value }) => {
        const profileId = value.profileId;
        if ('networkUUID' in value) {
          value.networkUUID = networkRemap[value.networkUUID];
        }
        if (profileId) {
          if (
            !profileUUIds ||
            !profileUUIds.length ||
            profileUUIds.includes(profileId)
          ) {
            return put(table, value);
          }
        } else {
          return put(table, value);
        }
      }),
    );
  });
};

export const importBackup =
  (db: IDBDatabase) => async (backup: IDBBackup, profileUUIds?: string[]) => {
    if (backup.db_version !== db.version) {
      // TODO: we can add a migration path here
      throw new Error(
        `Database version mismatch: expected ${db.version} but got ${backup.db_version}; WIP: we need to add a migration path here`,
      );
    }
    const tables = Object.keys(backup.data) as (keyof IDBBackup['data'])[];
    const transaction = db.transaction(tables, 'readwrite');

    await importContacts(db, backup.data.contact, transaction);
    const networkRemap = await importNetworks(
      db,
      backup.data.network,
      transaction,
    );
    await importFungibles(db, backup.data.fungible, networkRemap, transaction);
    await importProfiles(db, backup.data.profile, transaction);
    await importProfileRelatedTables({
      backup,
      profileUUIds,
      db,
      transaction,
      networkRemap,
    });

    return true;
  };
