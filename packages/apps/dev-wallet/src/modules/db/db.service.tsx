import { config } from '@/config';
import {
  addItem,
  connect,
  deleteItem,
  getAllItems,
  getOneItem,
  updateItem,
} from '@/modules/db/indexeddb';
import { execInSequence } from '@/utils/helpers';

import { IDBBackup, importBackup, serializeTables } from './backup/backup';
import { broadcast, dbChannel, EventTypes } from './db-channel';
import { migration } from './migration/migration';

const { DB_NAME, DB_VERSION } = config.DB;

export const setupDatabase = execInSequence(async (): Promise<IDBDatabase> => {
  const result = await connect(DB_NAME, DB_VERSION);
  let db = result.db;
  if (result.needsUpgrade) {
    broadcast('migration-started');
    db = await migration(result);
    broadcast('migration-finished');
  }

  return db;
});

export const createDatabaseConnection = async () => {
  const result = await connect(DB_NAME, DB_VERSION);
  const db = result.db;
  if (result.needsUpgrade) {
    throw new Error('database needs upgrade; call setupDatabase instead');
  }
  return db;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const injectDb = <R extends (...args: any[]) => Promise<any>>(
  fn: (db: IDBDatabase) => R,
  onCall: (...args: Parameters<R>) => void = () => {},
) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (async (...args: any): Promise<any> => {
    return createDatabaseConnection().then(async (db) => {
      const result = await fn(db)(...args);
      onCall(...args);
      db.close();
      return result;
    });
  }) as R;

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
  injectDbWithNotify: <R extends (...args: any[]) => Promise<any>>(
    fn: (db: IDBDatabase) => R,
    notifyEvent: EventTypes,
  ) => R;
}

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

  subscribe((event) => {
    if (event === 'migration-started') {
      console.log('migration event received');
    }
    if (event === 'migration-finished') {
      window.location.reload();
    }
  });

  dbChannel.onmessage = (event) => {
    const {
      type,
      storeName,
      data,
    }: { type: EventTypes; storeName: string; data: any[] } = event.data;
    listeners.forEach((cb) =>
      cb(type, storeName, ...(Array.isArray(data) ? data : [data])),
    );
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
    injectDbWithNotify: <R extends (...args: any[]) => Promise<any>>(
      fn: (db: IDBDatabase) => R,
      notifyEvent: EventTypes,
    ) => injectDb(fn, notify(notifyEvent) as any),
  };
};

export const dbService: IDBService = createDbService();
