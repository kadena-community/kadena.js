import {
  IDBBackup,
  importBackup,
  parseBackup,
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
      const backup = await serializeTables(db);
      db.close();
      return backup;
    }
  },
  importBackup: async (backup: string, profileUUIds?: string[]) => {
    const json = parseBackup(backup);
    if (!json || json.wallet_version !== '3') {
      throw new Error('Invalid chainweaver v3 backup');
    }
    const db = await connectToDB();
    if (db) {
      const result = await importBackup(db)(json as IDBBackup, profileUUIds);
      db.close();
      return result;
    }
  },
};

(window as any).DevWallet = DevWallet;
