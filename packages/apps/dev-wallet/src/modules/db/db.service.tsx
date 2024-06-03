import {
  addItem,
  connect,
  createStore,
  deleteDatabase,
  deleteItem,
  getAllItems,
  getOneItem,
  updateItem,
} from '@/modules/db/indexeddb';
import { execInSequence } from '@/utils/helpers';

// since we create the database in the first call we need to make sure another call does not happen
// while the database is still being created; so I use execInSequence.
const createConnectionPool = (
  cb: () => Promise<IDBDatabase>,
  length: number = 3,
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

const DB_NAME = 'dev-wallet';
const DB_VERSION = 31;

export const setupDatabase = execInSequence(async (): Promise<IDBDatabase> => {
  const result = await connect(DB_NAME, DB_VERSION);
  let db = result.db;
  if (result.needsUpgrade) {
    if (import.meta.env.DEV) {
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
    ]);
    create('network', 'uuid', [{ index: 'networkId', unique: true }]);
    create('fungible', 'contract', [{ index: 'symbol', unique: true }]);
    create('keyset', 'uuid', [{ index: 'profileId' }, { index: 'principal' }]);
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
export interface IDBService {
  getAll: <T>(
    storeName: string,
    filter?: string | string[] | undefined,
    indexName?: string | undefined,
  ) => Promise<T[]>;
  getOne: <T>(storeName: string, key: string) => Promise<T>;
  add: <T>(
    storeName: string,
    value: T,
    key?: string | undefined,
  ) => Promise<void>;
  update: <T>(
    storeName: string,
    value: T,
    key?: string | undefined,
  ) => Promise<void>;
  remove: (storeName: string, key: string) => Promise<void>;
  subscribe: (cb: Listener) => () => void;
}

export const createDbService = () => {
  const listeners: Listener[] = [];
  const subscribe: IDBService['subscribe'] = (cb) => {
    listeners.push(cb);
    return () => {
      const index = listeners.indexOf(cb);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  };
  const notify =
    (event: EventTypes) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (storeName: string, ...rest: any[]) => {
      listeners.forEach((cb) => cb(event, storeName, ...rest));
    };
  return {
    getAll: injectDb(getAllItems),
    getOne: injectDb(getOneItem),
    add: injectDb(addItem, notify('add')),
    update: injectDb(updateItem, notify('update')),
    remove: injectDb(deleteItem, notify('delete')),
    subscribe,
  };
};

export const dbService: IDBService = createDbService();
