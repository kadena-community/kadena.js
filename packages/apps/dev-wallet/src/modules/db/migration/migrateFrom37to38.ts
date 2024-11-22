// this function is called by db service when the database is updated from version 37 to 38
// here we update the encrypted value model to include the profile id; this will improve db structure for importing/exporting profiles

import {
  IHDBIP44,
  IHDChainweaver,
} from '@/modules/key-source/key-source.repository';
import { IKeySource, IProfile } from '@/modules/wallet/wallet.repository';
import { createStore, getAllItems } from '../indexeddb';
import { backupName } from './utils/backupName';

// also make this model more consistent with other models
export async function migrateFrom37to38(
  db: IDBDatabase,
  transaction: IDBTransaction,
) {
  const getAll = getAllItems(db, transaction);
  const profileList = await getAll<IProfile>('profile');
  const keySources = await getAll<IKeySource>('keySource');
  const encryptedValuesProfileIdMap = new Map<string, string>();
  profileList.forEach((profile) => {
    encryptedValuesProfileIdMap.set(profile.secretId, profile.uuid);
    encryptedValuesProfileIdMap.set(profile.securityPhraseId, profile.uuid);
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
  const v38db = `temp:encryptedValue_v38_${Date.now()}`;
  return new Promise<void>((resolve, reject) => {
    const create = createStore(db);
    create(v38db, 'uuid', [{ index: 'profileId' }]);
    // db.transaction(['encryptedValue', 'encryptedValue_v38'], 'readwrite');
    const oldStore = transaction.objectStore('encryptedValue');
    const newStore = transaction.objectStore(v38db);
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
    transaction.objectStore('encryptedValue').name = backupName(
      'encryptedValue',
      37,
    );

    transaction.objectStore(v38db).name = 'encryptedValue';
  });
}
