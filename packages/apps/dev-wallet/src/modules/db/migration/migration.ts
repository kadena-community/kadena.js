import { config } from '@/config';
import { connect, deleteDatabase } from '../indexeddb';
import { createTables } from './createDB';
import { migrateFrom37to38 } from './migrateFrom37to38';
import { migrateFrom38to39 } from './migrateFrom38to39';
import { migrateFrom39to40 } from './migrateFrom39to40';
import { migrateFrom40to41 } from './migrateFrom40to41';
import { migrateFrom41to42 } from './migrateFrom41to42';
import { migrateFrom42to43 } from './migrateFrom42to43';
import { migrateFrom43to44 } from './migrateFrom43to44';
import { migrateFrom44to45 } from './migrateFrom44to45';

const { DB_NAME, DB_VERSION } = config.DB;

const migrationMap = {
  37: migrateFrom37to38,
  38: migrateFrom38to39,
  39: migrateFrom39to40,
  40: migrateFrom40to41,
  41: migrateFrom41to42,
  42: migrateFrom42to43,
  43: migrateFrom43to44,
  44: migrateFrom44to45,
};

export async function migration(result: {
  db: IDBDatabase;
  oldVersion: number;
  versionTransaction: IDBTransaction;
}) {
  let { db } = result;
  const oldVersion = result.oldVersion;
  if (oldVersion === 0) {
    console.log('creating new database');
    createTables(db);
  } else if (oldVersion < 37) {
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
  } else {
    for (
      let fromVersion = oldVersion;
      fromVersion < DB_VERSION;
      fromVersion++
    ) {
      const migrationPath =
        migrationMap[fromVersion as keyof typeof migrationMap];
      // we need to add a migration path for each version
      if (migrationPath) {
        console.log(`migrating from ${fromVersion} to ${fromVersion + 1}`);
        await migrationPath(db, result.versionTransaction);
        continue;
      }
      throw new Error(
        `There is no migration path for version ${fromVersion} to ${fromVersion + 1}`,
      );
    }
  }
  return db;
}
