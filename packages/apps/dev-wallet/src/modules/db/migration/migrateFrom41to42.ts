// check the change log for more details
import { IAccount } from '@/modules/account/account.repository';
import { addItem, createStore, getAllItems } from '../indexeddb';
import { defineSchemeFactory, ExtendedTableName } from './createDB';

const changeLog = ['removing unique-alias index from account model'];

const { defineScheme } = defineSchemeFactory();

export async function migrateFrom41to42(
  db: IDBDatabase,
  transaction: IDBTransaction,
) {
  console.log('migrating from 41 to 42', 'change log:');
  changeLog.forEach((log, index) => console.log(index, log));
  const create = createStore(db);
  const accountTemp: ExtendedTableName = `temp:account-v42:${Date.now()}`;
  create(
    defineScheme(accountTemp, 'uuid', [
      { index: 'address' },
      { index: 'keysetId' },
      { index: 'profileId' },
      { index: 'profile-network', indexKeyPath: ['profileId', 'networkUUID'] },
      {
        index: 'unique-account',
        indexKeyPath: ['keysetId', 'contract', 'networkUUID'],
        unique: true,
      },
    ]),
  );
  const allAccounts = await getAllItems(db, transaction)<IAccount>('account');
  const add = addItem(db, transaction);
  await Promise.all(allAccounts.map((account) => add(accountTemp, account)));
  const backupName: ExtendedTableName = `backup:account-v41:${Date.now()}`;
  transaction.objectStore('account').name = backupName;
  transaction.objectStore(accountTemp).name = 'account';
  db.deleteObjectStore(backupName);
}
