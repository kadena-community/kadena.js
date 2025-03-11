// this function is called by db service when the database is updated from version 37 to 38
// check the change log for more details

import {
  IHDBIP44,
  IHDChainweaver,
} from '@/modules/key-source/key-source.repository';
import { IKeySource, IProfile } from '@/modules/wallet/wallet.repository';
import { createStore, getAllItems } from '../indexeddb';
import { defineSchemeFactory, ExtendedTableName } from './createDB';

const changeLog = [
  'adding profileId to encryptedValue model, this will make it easier to export/import profiles also make this model more consistent with other models',
  'adding backup table',
];
export async function migrateFrom37to38(
  db: IDBDatabase,
  transaction: IDBTransaction,
) {
  console.log('change log:');
  changeLog.forEach((log, index) => console.log(index, log));
  const getAll = getAllItems(db, transaction);
  const profileList = await getAll<IProfile>('profile');
  const keySources = await getAll<IKeySource>('keySource');
  const encryptedValuesProfileIdMap = new Map<string, string>();
  profileList.forEach((profile) => {
    encryptedValuesProfileIdMap.set(profile.secretId, profile.uuid);
    if (profile.securityPhraseId) {
      encryptedValuesProfileIdMap.set(profile.securityPhraseId, profile.uuid);
    }
  });
  keySources.forEach((keySource) => {
    if (keySource.source === 'HD-chainweaver') {
      const legacyKeySource = keySource as IHDChainweaver;
      encryptedValuesProfileIdMap.set(
        legacyKeySource.rootKeyId,
        keySource.profileId,
      );
      if (legacyKeySource.secretId) {
        encryptedValuesProfileIdMap.set(
          legacyKeySource.secretId,
          keySource.profileId,
        );
      }
    }
    if (keySource.source === 'HD-BIP44') {
      encryptedValuesProfileIdMap.set(
        (keySource as IHDBIP44).secretId,
        keySource.profileId,
      );
    }
  });
  const { defineScheme } = defineSchemeFactory();
  const encryptedValueTemp: ExtendedTableName = `temp:encryptedValue-v38:${Date.now()}`;
  return new Promise<void>((resolve, reject) => {
    const create = createStore(db);
    create(defineScheme('backup', 'uuid'));
    create(defineScheme(encryptedValueTemp, 'uuid', [{ index: 'profileId' }]));
    // db.transaction(['encryptedValue', 'encryptedValue_v38'], 'readwrite');
    const oldStore = transaction.objectStore('encryptedValue');
    const newStore = transaction.objectStore(encryptedValueTemp);
    const oldCursor = oldStore.openCursor();
    oldCursor.onsuccess = (event) => {
      if (!event.target) {
        reject(new Error('No target found'));
      }
      const cursor: IDBCursorWithValue | null = (event.target as any).result;
      if (cursor) {
        const uuid = cursor.key;
        const value = cursor.value;
        const putRequest = newStore.put({
          uuid,
          value,
          profileId: encryptedValuesProfileIdMap.get(uuid.toString()),
        });
        putRequest.onsuccess = () => {
          cursor.continue();
        };
        putRequest.onerror = () => {
          reject(putRequest.error);
        };
      }
      if (!cursor) {
        resolve();
      }
    };
    oldCursor.onerror = () => {
      reject(oldCursor.error);
    };
  }).then(() => {
    // We can now delete the old store; but for now I still keep it for debugging and if something goes wrong we can rollback
    transaction.objectStore('encryptedValue').name =
      `backup:encryptedValue-v37:${Date.now()}` as ExtendedTableName;
    transaction.objectStore(encryptedValueTemp).name =
      'encryptedValue' as ExtendedTableName;
  });
}
