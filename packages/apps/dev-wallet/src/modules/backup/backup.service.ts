import { dbService } from '../db/db.service';
import { walletRepository } from '../wallet/wallet.repository';
import { saveFile } from './fileApi';

export async function backupDatabase(force = false) {
  const backup = await walletRepository.getBackupOptions();
  if (!backup || !backup.directoryHandle) {
    throw new Error('Auto backup is not enabled');
  }

  if (!force && backup.lastBackup + 1000 * 60 * 60 * 12 > Date.now()) {
    return;
  }

  const now = Date.now();
  const handle = backup.directoryHandle;
  await saveFile(
    handle,
    new File([await dbService.serializeTables()], `wallet-backup.json`, {
      type: 'application/json',
    }),
  );
  await walletRepository.patchBackupOptions({ lastBackup: now });
}
