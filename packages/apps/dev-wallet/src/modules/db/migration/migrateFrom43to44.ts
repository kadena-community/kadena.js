// this function is called by db service when the database is updated from version 39 to 40
// check the change log for more details
import { IAccount } from '@/modules/account/account.repository';
import { addItem, createStore, getAllItems } from '../indexeddb';
import { defineSchemeFactory, ExtendedTableName } from './createDB';

const changeLog = [
  'replace keysetId with guard.principal in unique-account index',
];

const { defineScheme } = defineSchemeFactory();

export async function migrateFrom43to44(
  db: IDBDatabase,
  transaction: IDBTransaction,
) {
  console.log('change log:');
  changeLog.forEach((log, index) => console.log(index, log));
  const create = createStore(db);
  const accountTemp: ExtendedTableName = `temp:account-v43:${Date.now()}`;
  create(
    defineScheme(accountTemp, 'uuid', [
      { index: 'address' },
      { index: 'keysetId' },
      { index: 'profileId' },
      { index: 'profile-network', indexKeyPath: ['profileId', 'networkUUID'] },
      {
        index: 'unique-account',
        indexKeyPath: [
          'profileId',
          'guard.principal',
          'contract',
          'networkUUID',
        ],
        unique: true,
      },
    ]),
  );
  const allAccounts = await getAllItems(db, transaction)<IAccount>('account');
  const add = addItem(db, transaction);
  await Promise.all(allAccounts.map((account) => add(accountTemp, account)));
  const backupName: ExtendedTableName = `backup:account-v42:${Date.now()}`;
  transaction.objectStore('account').name = backupName;
  transaction.objectStore(accountTemp).name = 'account';
  db.deleteObjectStore(backupName);
}
