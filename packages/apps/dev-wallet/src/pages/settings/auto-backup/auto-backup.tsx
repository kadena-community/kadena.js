import { backupDatabase } from '@/modules/backup/backup.service';
import { useSubscribe } from '@/modules/db/useSubscribe';
import { IBackup, walletRepository } from '@/modules/wallet/wallet.repository';
import { successClass } from '@/pages/transaction/components/style.css';
import {
  MonoSettingsBackupRestore,
  MonoToggleOff,
  MonoToggleOn,
} from '@kadena/kode-icons/system';
import { Button } from '@kadena/kode-ui';
import {
  getDirectoryHandle,
  isFileSystemAccessSupported,
} from '../../../modules/backup/fileApi';

export function AutoBackup() {
  const backupOptions = useSubscribe<IBackup>('backup', 'backup-id');

  async function enableAutoBackup() {
    const handle = await getDirectoryHandle();
    await walletRepository.patchBackupOptions({
      directoryHandle: handle,
    });
    await backupDatabase(true);
  }

  function disableAutoBackup() {
    if (!backupOptions) return;
    walletRepository.updateBackupOptions({
      ...backupOptions,
      directoryHandle: undefined,
    });
  }

  const isEnabled = backupOptions && backupOptions.directoryHandle;

  return (
    <Button
      variant="outlined"
      isDisabled={!isFileSystemAccessSupported()}
      onClick={isEnabled ? disableAutoBackup : enableAutoBackup}
      startVisual={<MonoSettingsBackupRestore />}
      endVisual={
        isEnabled ? (
          <MonoToggleOn className={successClass} fontSize={40} />
        ) : (
          <MonoToggleOff fontSize={40} />
        )
      }
    >
      Automatic Backup
    </Button>
  );
}
