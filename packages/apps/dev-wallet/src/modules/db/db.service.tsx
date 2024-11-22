import { config } from '@/config';
import {
  addItem,
  connect,
  createStore,
  dbDump,
  deleteDatabase,
  deleteItem,
  getAllItems,
  getOneItem,
  updateItem,
} from '@/modules/db/indexeddb';
import { execInSequence } from '@/utils/helpers';
import { base64UrlEncodeArr, hash } from '@kadena/cryptography-utils';
import {
  Fungible,
  IAccount,
  IKeySet,
  IWatchedAccount,
} from '../account/account.repository';
import { IActivity } from '../activity/activity.repository';
import { IContact } from '../contact/contact.repository';
import { IHDChainweaver } from '../key-source/key-source.repository';
import { INetwork } from '../network/network.repository';
import { ITransaction } from '../transaction/transaction.repository';
import { IKeySource, IProfile } from '../wallet/wallet.repository';

// since we create the database in the first call we need to make sure another call does not happen
// while the database is still being created; so I use execInSequence.
const createConnectionPool = (
  cb: () => Promise<IDBDatabase>,
  length: number = 1,
) => {
  const pool: IDBDatabase[] = [];
  let turn = 0;

  const createDatabaseConnection = execInSequence(async () => {
    if (pool.length < length) {
      const connection = await cb();
      pool.push(connection);
      const removeFromPool = () => pool.splice(pool.indexOf(connection), 1);
      connection.onclose = removeFromPool;
      const originalClose = connection.close.bind(connection);
      connection.close = () => {
        removeFromPool();
        originalClose();
      };
      return connection;
    }
    const connection = pool[turn];
    turn = turn === length - 1 ? 0 : turn + 1;
    return connection;
  });

  const closeDatabaseConnections = () => {
    console.log(`closing ${pool.length} database connections`);
    pool.forEach((connection) => connection.close());
    pool.length = 0;
  };
  return {
    createDatabaseConnection,
    closeDatabaseConnections,
  };
};

const { DB_NAME, DB_VERSION, DB_WIPE_ON_VERSION_CHANGE } = config.DB;

export const setupDatabase = execInSequence(async (): Promise<IDBDatabase> => {
  const result = await connect(DB_NAME, DB_VERSION);
  let db = result.db;
  if (result.needsUpgrade) {
    if (import.meta.env.DEV || DB_WIPE_ON_VERSION_CHANGE) {
      console.log(
        'in development we delete the database if schema is changed for now since we are still in early stage of development',
      );
      db.close();
      console.log('deleting database');
      await deleteDatabase(DB_NAME);
      console.log('creating new database');
      const { db: newDb } = await connect(DB_NAME, DB_VERSION);
      db = newDb;
    }
    // NOTE: If you change the schema, you need to update the upgrade method
    // below to migrate the data. the current version just creates the database
    const create = createStore(db);
    create('profile', 'uuid', [{ index: 'name', unique: true }]);
    create('encryptedValue');
    create('keySource', 'uuid', [{ index: 'profileId' }]);
    create('account', 'uuid', [
      { index: 'address' },
      { index: 'keysetId' },
      { index: 'profileId' },
      { index: 'profile-network', indexKeyPath: ['profileId', 'networkUUID'] },
      {
        index: 'unique-account',
        indexKeyPath: ['keysetId', 'contract', 'networkUUID'],
        unique: true,
      },
    ]);
    create('watched-account', 'uuid', [
      { index: 'address' },
      { index: 'profileId' },
      { index: 'profile-network', indexKeyPath: ['profileId', 'networkUUID'] },
      {
        index: 'unique-account',
        indexKeyPath: ['profileId', 'contract', 'address', 'networkUUID'],
        unique: true,
      },
    ]);
    create('network', 'uuid', [{ index: 'networkId', unique: true }]);
    create('fungible', 'contract', [{ index: 'symbol', unique: true }]);
    create('keyset', 'uuid', [
      { index: 'profileId' },
      { index: 'principal' },
      {
        index: 'unique-keyset',
        indexKeyPath: ['profileId', 'principal'],
        unique: true,
      },
    ]);
    create('transaction', 'uuid', [
      { index: 'hash' },
      { index: 'profileId' },
      { index: 'groupId' },
      { index: 'network', indexKeyPath: ['profileId', 'networkUUID'] },
      {
        index: 'unique-tx',
        indexKeyPath: ['profileId', 'networkUUID', 'hash'],
        unique: true,
      },
      {
        index: 'network-status',
        indexKeyPath: ['profileId', 'networkUUID', 'status'],
      },
    ]);
    create('activity', 'uuid', [
      { index: 'profile-network', indexKeyPath: ['profileId', 'networkUUID'] },
      { index: 'keyset-network', indexKeyPath: ['keysetId', 'networkUUID'] },
    ]);
    create('contact', 'uuid', [{ index: 'name', unique: true }]);
  }

  return db;
});

const createConnection = async () => {
  const result = await connect(DB_NAME, DB_VERSION);
  const db = result.db;
  if (result.needsUpgrade) {
    throw new Error('database needs upgrade; call setupDatabase instead');
  }
  return db;
};

export const { createDatabaseConnection, closeDatabaseConnections } =
  createConnectionPool(createConnection);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const injectDb = <R extends (...args: any[]) => Promise<any>>(
  fn: (db: IDBDatabase) => R,
  onCall: (...args: Parameters<R>) => void = () => {},
) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (async (...args: any): Promise<any> => {
    return createDatabaseConnection().then(async (db) => {
      const result = await fn(db)(...args);
      onCall(...args);
      return result;
    });
  }) as R;

type EventTypes = 'add' | 'update' | 'delete';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listener = (type: EventTypes, storeName: string, ...data: any[]) => void;

export interface ISubscribe {
  /**
   * Subscribe to changes in a store
   */
  (cb: Listener): () => void;
  /**
   * Subscribe to changes in a store
   */
  (storeName: string, uuid: string, cb: (data: any) => void): () => void;
}
export interface IDBService {
  getAll: <T>(
    storeName: string,
    filter?: string | string[] | IDBKeyRange | undefined,
    indexName?: string | undefined,
  ) => Promise<T[]>;
  getOne: <T>(storeName: string, key: string) => Promise<T>;
  add: <T>(
    storeName: string,
    value: T,
    key?: string | undefined,
    options?: { noCreationTime: boolean },
  ) => Promise<void>;
  update: <T>(
    storeName: string,
    value: T,
    key?: string | undefined,
  ) => Promise<void>;
  remove: (storeName: string, key: string) => Promise<void>;
  subscribe: ISubscribe;
  serializeTables: () => Promise<string>;
}

const dbChannel = new BroadcastChannel('db-channel');
const broadcast = (event: EventTypes, storeName: string, data: any[]) => {
  dbChannel.postMessage({ type: event, storeName, data });
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
    encryptedValue: Table<string>;
    keySource: Table<IKeySource>;
    account: Table<IAccount>;
    'watched-account': Table<IWatchedAccount>;
    network: Table<INetwork>;
    fungible: Table<Fungible>;
    keyset: Table<IKeySet>;
    transaction: Table<ITransaction>;
    activity: Table<IActivity>;
    contact: Table<IContact>;
  };
}

const filterData = (data: IDBBackup['data'], profileUUIds?: string[]) => {
  if (!profileUUIds) {
    return data;
  }
  const filteredData: IDBBackup['data'] = {
    profile: [],
    encryptedValue: [],
    keySource: [],
    account: [],
    'watched-account': [],
    network: [],
    fungible: [],
    keyset: [],
    transaction: [],
    activity: [],
    contact: [],
  };
  const globalTables = ['contact', 'fungible', 'network'] as const;
  const withProfileId = [
    'keySource',
    'account',
    'watched-account',
    'keyset',
    'transaction',
    'activity',
  ] as const;
  const onlyInsert: {
    [K in (typeof globalTables)[number]]: Table<
      IDBBackup['data'][K][0]['value']
    >;
  } = Object.assign(
    {},
    ...globalTables.map((table) => ({ [table]: data[table] })),
  );
  const updateData: {
    [K in (typeof withProfileId)[number]]: Table<
      IDBBackup['data'][K][0]['value']
    >;
  } = Object.assign(
    {},
    ...withProfileId.map((table) => ({
      [table]: data[table].filter(({ value: { profileId } }) =>
        profileUUIds.includes(profileId),
      ),
    })),
  );
  const findEncryptedValue = (key?: string) => {
    return key
      ? data.encryptedValue.find(({ key: k }) => k === key)?.value
      : undefined;
  };
  const encryptedValues = profileUUIds.map((uuid) => {
    const profile = data.profile.find(({ key }) => key === uuid);
    if (!profile) {
      return [];
    }
    const legacyKeySources: IHDChainweaver[] = data.keySource
      .map(({ value }) =>
        value.source === 'HD-chainweaver' &&
        profileUUIds.includes(value.profileId)
          ? value
          : undefined,
      )
      .filter((v) => v) as IHDChainweaver[];
    return [
      findEncryptedValue(profile.value.secretId),
      findEncryptedValue(profile.value.securityPhraseId),
      ...legacyKeySources
        .map((ks) => [
          findEncryptedValue(ks.secretId),
          findEncryptedValue(ks.rootKeyId),
          ...ks.keys.map(({ secretId }) => findEncryptedValue(secretId)),
        ])
        .flat(Infinity),
    ];
  });
  return {
    onlyInsert,
    updateData,
  };
};

export const importBackup =
  (db: IDBDatabase) => (backup: IDBBackup, profileUUIds?: string[]) => {
    const transaction = db.transaction(Object.keys(backup.data), 'readwrite');
    const tables = Object.keys(backup.data) as Array<keyof IDBBackup['data']>;
    tables.forEach((table) => {
      const store = transaction.objectStore(table);
      const data = backup.data[table];
      data.forEach(({ key, value }) => {
        if (profileUUIds && table === 'profile') {
          if (!profileUUIds.includes(key)) {
            return;
          }
        }
        store.put(value, key);
      });
    });
    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  };

export const createDbService = () => {
  const listeners: Listener[] = [];
  const subscribe: ISubscribe = (
    first: string | Listener,
    second?: string,
    third?: (data: any) => void,
  ) => {
    let cb: Listener;
    if (typeof first === 'string' && second && third) {
      cb = (event, storeName, data) => {
        if (storeName === first && event) {
          if (event === 'delete' && data === second) {
            third(undefined);
          } else if (data.uuid === second) {
            third(data);
          }
        }
      };
    } else if (typeof first === 'function') {
      cb = first;
    } else {
      throw new Error('Invalid arguments');
    }
    listeners.push(cb);
    return () => {
      const index = listeners.indexOf(cb);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  };

  dbChannel.onmessage = (event) => {
    const {
      type,
      storeName,
      data,
    }: { type: EventTypes; storeName: string; data: any[] } = event.data;
    listeners.forEach((cb) => cb(type, storeName, ...data));
  };

  const notify =
    (event: EventTypes) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (storeName: string, ...rest: any[]) => {
      listeners.forEach((cb) => cb(event, storeName, ...rest));
      broadcast(event, storeName, rest);
    };
  const getAll = injectDb(getAllItems);
  const dumpDatabase = injectDb(dbDump);
  return {
    getAll,
    getOne: injectDb(getOneItem),
    add: injectDb(addItem, notify('add')),
    update: injectDb(updateItem, notify('update')),
    remove: injectDb(deleteItem, notify('delete')),
    subscribe,
    serializeTables: async () => {
      const dbData = await dumpDatabase();
      const { data } = dbData;
      const checksum = hash(JSON.stringify(data, BufferToBase64UrlReplacer));
      const backup: IDBBackup = { checksum, wallet_version: '3', ...dbData };
      return JSON.stringify(backup, BufferToBase64UrlReplacer, 2);
    },
  };
};

// eslint-disable-next-line react-refresh/only-export-components
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

export const dbService: IDBService = createDbService();
