// this function is called by db service when the database is updated from version 38 to 39
// check the change log for more details
import { IAccount } from '@/modules/account/account.repository';
import { addItem, createStore, getAllItems } from '../indexeddb';
import { defineSchemeFactory, ExtendedTableName } from './createDB';

const changeLog = [
  'Adding unique-alias index to account model; this will restrict duplicate alias for a account on a network',
];

const { defineScheme } = defineSchemeFactory();

export async function migrateFrom38to39(
  db: IDBDatabase,
  transaction: IDBTransaction,
) {
  console.log('migrating from 38 to 39', 'change log:');
  changeLog.forEach((log, index) => console.log(index, log));
  const create = createStore(db);
  const accountTemp: ExtendedTableName = `temp:account-v39:${Date.now()}`;
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
      {
        index: 'unique-alias',
        indexKeyPath: ['profileId', 'networkUUID', 'contract', 'alias'],
        unique: true,
      },
    ]),
  );
  const allAccounts = await getAllItems(db, transaction)<IAccount>('account');
  const fixedAccounts = allAccounts.map(
    (account) =>
      ({
        ...account,
        ...getUniqueAlias(account, allAccounts),
      }) as IAccount,
  );
  const add = addItem(db, transaction);
  await Promise.all(fixedAccounts.map((account) => add(accountTemp, account)));
  transaction.objectStore('account').name = 'backup:account_v38';
  transaction.objectStore(accountTemp).name = 'account';
  db.deleteObjectStore('backup:account_v38');
}

function getUniqueAlias(account: IAccount, list: IAccount[]) {
  if (!account.alias) return { alias: undefined } as { alias?: string };
  const fistPartOfUUID = (uuid: string) => uuid.split('-')[0];
  return {
    alias:
      list.find(
        (ac) =>
          ac.profileId === account.profileId &&
          ac.networkUUID === account.networkUUID &&
          ac.contract === account.contract &&
          ac.alias === account.alias,
      )?.uuid !== account.uuid
        ? `${account.alias}_${fistPartOfUUID(account.uuid)}`
        : account.alias,
  };
}
