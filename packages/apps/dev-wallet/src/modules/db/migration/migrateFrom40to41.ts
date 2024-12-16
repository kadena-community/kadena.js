// this function is called by db service when the database is updated from version 39 to 40
// check the change log for more details
import {
  IAccount,
  IKeySet,
  IWatchedAccount,
} from '@/modules/account/account.repository';
import { getAllItems, putItem } from '../indexeddb';

const changeLog = ['add guard to the accounts'];

export async function migrateFrom40to41(
  db: IDBDatabase,
  transaction: IDBTransaction,
) {
  console.log('change log:');
  changeLog.forEach((log, index) => console.log(index, log));
  const update = putItem(db, transaction);
  const allAccounts = await getAllItems(db, transaction)<IAccount>('account');
  const allWatchedAccounts = await getAllItems(
    db,
    transaction,
  )<IWatchedAccount>('watched-account');
  const allKeysets = await getAllItems(db, transaction)<IKeySet>('keyset');

  await Promise.all(
    allAccounts.map(async (account) => {
      const keyset = allKeysets.find(
        (keyset) => keyset.uuid === account.keysetId,
      );
      // ignore accounts without keyset; this should not happen
      if (!keyset) return Promise.resolve();

      return update<IAccount>('account', {
        ...account,
        guard: {
          principal: keyset.principal,
          pred: keyset.guard.pred,
          keys: keyset.guard.keys,
        },
      });
    }),
  );

  await Promise.all(
    allWatchedAccounts.map(async (account) => {
      return update<IWatchedAccount>('watched-account', {
        ...account,
        guard: {
          principal: account.address,
          ...(account as any).keyset?.guard,
        },
      });
    }),
  );
}
