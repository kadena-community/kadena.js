import { connect, createStore, deleteDatabase } from '@/modules/db/indexeddb';
import { execInSequence } from '@/utils/helpers';

// since we create the database in the first call we need to make sure another call does not happen
// while the database is still being created; so I use execInSequence.
const connectionPool = (cb: () => Promise<IDBDatabase>, length: number) => {
  const pool: IDBDatabase[] = [];
  let turn = 0;

  const getConnection = async () => {
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
  };
  return getConnection;
};

const createConnection = async (): Promise<IDBDatabase> => {
  const DB_NAME = 'dev-wallet';
  const DB_VERSION = 20;
  const result = await connect(DB_NAME, DB_VERSION);
  let { db } = result;
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
    create('network', 'uuid', [{ index: 'networkId', unique: true }]);
    create('encryptedValue');
    // TODO: move account to separate repository if needed
    create('account', 'uuid', [{ index: 'address' }, { index: 'profileId' }]);
  }
  return db;
};

export const createDatabaseConnection = connectionPool(
  execInSequence(createConnection),
  3,
);
