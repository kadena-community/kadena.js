// check the change log for more details
import { IContact } from '@/modules/contact/contact.repository';
import { BuiltInPredicate } from '@kadena/client';
import { getAllItems, putItem } from '../indexeddb';

const changeLog = [
  'add guard to the contacts; this was missed in the 40 to 41 migration',
];

export async function migrateFrom42to43(
  db: IDBDatabase,
  transaction: IDBTransaction,
) {
  console.log('change log:');
  changeLog.forEach((log, index) => console.log(index, log));
  const update = putItem(db, transaction);
  const allContacts = await getAllItems(db, transaction)<IContact>('contact');
  await Promise.all(
    allContacts.map(async (contact) => {
      const account: IContact['account'] & {
        keyset?: { pred: BuiltInPredicate; keys: string[] };
      } = contact.account;
      if (!account || !account.keyset) return Promise.resolve();
      return update<IContact>('contact', {
        ...contact,
        account: {
          ...account,
          guard: {
            principal: account.address,
            pred: account.keyset.pred,
            keys: account.keyset.keys,
          },
        },
      });
    }),
  );
}
