import {
  IDBBackup,
  importBackup,
  serializeTables,
} from './modules/db/backup/backup';
import { connect } from './modules/db/indexeddb';

// these are here for debugging and testing purposes
const connectToDB = async (db = 'dev-wallet', version = 46) => {
  const result = await connect(db, version);
  if (result.needsUpgrade) {
    console.error('Database needs upgrade; Use UI for that');
    result.versionTransaction.abort();
    return null;
  }
  return result.db;
};
const DevWallet = {
  serializeTables: async () => {
    const db = await connectToDB();
    if (db) {
      return serializeTables(db);
    }
  },
  importBackup: async (backup: IDBBackup, profileUUIds?: string[]) => {
    const db = await connectToDB();
    if (db) {
      return importBackup(db)(backup, profileUUIds);
    }
  },
};

(window as any).DevWallet = DevWallet;
