import { config } from '@/config';
import {
  addItem,
  connect,
  deleteDatabase,
  deleteItem,
  getAllItems,
  getOneItem,
  updateItem,
} from '@/modules/db/indexeddb';
import { execInSequence } from '@/utils/helpers';

import { IDBBackup, importBackup, serializeTables } from './backup/backup';
import { createTables } from './migration/createDB';
import { migrateFrom37to38 } from './migration/migrateFrom37to38';

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

const { DB_NAME, DB_VERSION } = config.DB;

export const setupDatabase = execInSequence(async (): Promise<IDBDatabase> => {
  const result = await connect(DB_NAME, DB_VERSION);
  let db = result.db;
  if (result.needsUpgrade) {
    const oldVersion = result.oldVersion;
    if (oldVersion === 0) {
      console.log('creating new database');
      createTables(db);
      return db;
    }
    if (oldVersion < 37) {
      const confirmed = confirm(
        'You’re using an outdated database version that doesn’t support migration. To continue using the app, all data must be wiped. Do you want to proceed?',
      );
      if (!confirmed) {
        throw new Error('OUTDATED_DATABASE: database needs upgrade');
      }

      console.log(
        'Attempting to delete database because it is too old to be migrated',
      );
      db.close();
      console.log('deleting database');
      await deleteDatabase(DB_NAME);
      console.log('creating new database');
      const { db: newDb } = await connect(DB_NAME, DB_VERSION);
      db = newDb;

      createTables(db);
      return db;
    }

    for (
      let fromVersion = oldVersion;
      fromVersion < DB_VERSION;
      fromVersion++
    ) {
      // we need to add a migration path for each version
      if (fromVersion === 37) {
        console.log('migrating from 37 to 38');
        await migrateFrom37to38(db, result.versionTransaction);
        continue;
      }
      throw new Error(
        `There is no migration path for version ${fromVersion} to ${fromVersion + 1}`,
      );
    }
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

type EventTypes = 'add' | 'update' | 'delete' | 'import';
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
  importBackup: (
    backup: IDBBackup,
    profileUUIds?: string[],
  ) => Promise<boolean>;
}

const dbChannel = new BroadcastChannel('db-channel');
const broadcast = (event: EventTypes, storeName: string, data: any[]) => {
  dbChannel.postMessage({ type: event, storeName, data });
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
    (storeName: string | any, ...rest: any[]) => {
      listeners.forEach((cb) => cb(event, storeName, ...rest));
      broadcast(event, storeName, rest);
    };
  const getAll = injectDb(getAllItems);
  return {
    getAll,
    getOne: injectDb(getOneItem),
    add: injectDb(addItem, notify('add')),
    update: injectDb(updateItem, notify('update')),
    remove: injectDb(deleteItem, notify('delete')),
    subscribe,
    serializeTables: injectDb((db) => () => serializeTables(db)),
    importBackup: injectDb(importBackup, notify('import')),
  };
};

export const dbService: IDBService = createDbService();
