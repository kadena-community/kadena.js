// this function is called by db service when the database is updated from version 39 to 40
// check the change log for more details
import { IAccount } from '@/modules/account/account.repository';
import { addItem, getAllItems } from '../indexeddb';

const changeLog = ['merge watched-account into account'];

export async function migrateFrom45to46(
  db: IDBDatabase,
  transaction: IDBTransaction,
) {
  console.log('change log:');
  changeLog.forEach((log, index) => console.log(index, log));
  const allWatchedAccounts = await getAllItems(
    db,
    transaction,
  )<IAccount>('watched-account');
  const add = addItem(db, transaction);
  await Promise.all(
    allWatchedAccounts.map((account) => add('account', account)),
  );
  db.deleteObjectStore('watched-account');
}
