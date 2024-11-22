// this function is called by db service when the database is updated from version 37 to 38
// here we update the encrypted value model to include the profile id; this will improve db structure for importing/exporting profiles

import { Fungible, IAccount } from '@/modules/account/account.repository';
import { createStore, getAllItems, updateItem } from '../indexeddb';
import { backupName } from './utils/backupName';

// also make this model more consistent with other models
export async function migrateFrom38to39(
  db: IDBDatabase,
  transaction: IDBTransaction,
) {
  const create = createStore(db);
  const getAll = getAllItems(db, transaction);
  const update = updateItem(db, transaction);
  const fungibles = await getAll<Fungible>('fungible');
  const accounts = await getAll<IAccount & { contract: string }>('account');
  const watchedAccounts = await getAll<IAccount & { contract: string }>(
    'watched-account',
  );
  const fungiblesWithId = fungibles.map((f) => ({
    ...f,
    uuid: crypto.randomUUID(),
  }));
  const accountsWithFungibleId = accounts.map(({ contract, ...account }) => ({
    ...account,
    fungibleId: fungiblesWithId.find((f) => f.contract === contract)!.uuid,
  }));

  const watchedAccountsFungibleId = watchedAccounts.map(
    ({ contract, ...account }) => ({
      ...account,
      fungibleId: fungiblesWithId.find((f) => f.contract === contract)!.uuid,
    }),
  );

  const v39fungible = `temp:fungible_v39_${Date.now()}`;

  create(v39fungible, 'uuid', [
    { index: 'symbol', unique: true },
    { index: 'contract', unique: true },
  ]);

  await Promise.all(
    fungiblesWithId.map((fungible) => update(v39fungible, fungible)),
  );
  await Promise.all(
    accountsWithFungibleId.map((account) => update('account', account)),
  );

  await Promise.all(
    watchedAccountsFungibleId.map((account) =>
      update('watched-account', account),
    ),
  );
  const fungibleBackup = backupName('fungible', 38);
  transaction.objectStore('fungible').name = fungibleBackup;
  transaction.objectStore(v39fungible).name = 'fungible';
  db.deleteObjectStore(fungibleBackup);
}
