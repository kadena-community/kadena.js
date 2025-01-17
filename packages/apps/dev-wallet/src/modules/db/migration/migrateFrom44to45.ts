// check the change log for more details
import { INetwork } from '@/modules/network/network.repository';
import { getAllItems, putItem } from '../indexeddb';

const changeLog = ['Enable mainnet by default'];

export async function migrateFrom44to45(
  db: IDBDatabase,
  transaction: IDBTransaction,
) {
  console.log('change log:');
  changeLog.forEach((log, index) => console.log(index, log));
  const allNetworks = await getAllItems(db, transaction)<INetwork>('network');
  const update = putItem(db, transaction);
  const mainnet = allNetworks.find(
    (network) => network.networkId === 'mainnet01',
  );
  if (mainnet?.disabled) {
    await update<INetwork>('network', {
      ...mainnet,
      disabled: false,
    });
  }
}
