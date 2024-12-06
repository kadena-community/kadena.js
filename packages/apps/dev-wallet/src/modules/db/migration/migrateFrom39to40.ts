// this function is called by db service when the database is updated from version 39 to 40
// check the change log for more details
import { IActivity } from '@/modules/activity/activity.repository';
import { addItem, createStore, getAllItems } from '../indexeddb';
import { defineSchemeFactory, ExtendedTableName } from './createDB';

const changeLog = ['Index activity by profileId'];

const { defineScheme } = defineSchemeFactory();

export async function migrateFrom39to40(
  db: IDBDatabase,
  transaction: IDBTransaction,
) {
  console.log('migrating from 39 to 40', 'change log:');
  changeLog.forEach((log, index) => console.log(index, log));
  const create = createStore(db);
  const activityTemp: ExtendedTableName = `temp:activity-v40:${Date.now()}`;
  create(
    defineScheme(activityTemp, 'uuid', [
      { index: 'profileId' },
      { index: 'profile-network', indexKeyPath: ['profileId', 'networkUUID'] },
      { index: 'keyset-network', indexKeyPath: ['keysetId', 'networkUUID'] },
    ]),
  );
  const allActivities = await getAllItems(
    db,
    transaction,
  )<IActivity>('activity');
  const add = addItem(db, transaction);
  await Promise.all(
    allActivities.map((activity) => add(activityTemp, activity)),
  );
  const backupName: ExtendedTableName = `backup:activity-v39:${Date.now()}`;
  transaction.objectStore('activity').name = backupName;
  transaction.objectStore(activityTemp).name = 'activity';
  db.deleteObjectStore(backupName);
}
