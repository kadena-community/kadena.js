import { backupDatabase } from '@/modules/backup/backup.service';
import { useSubscribe } from '@/modules/db/useSubscribe';
import { IBackup, walletRepository } from '@/modules/wallet/wallet.repository';
import { Button, Heading, Notification, Stack, Text } from '@kadena/kode-ui';
import {
  getDirectoryHandle,
  isFileSystemAccessSupported,
} from '../../../modules/backup/fileApi';

export function AutoBackup() {
  const backupOptions = useSubscribe<IBackup>('backup', 'backup-id');
  if (!isFileSystemAccessSupported()) {
    return (
      <Stack gap="lg" flexDirection={'column'}>
        <Heading variant="h4">Auto Backup</Heading>
        <Text>
          Your browser does not support the File System Access API. This feature
          is not available. You can use the manual backup feature instead.
        </Text>
      </Stack>
    );
  }

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

  return (
    <Stack gap="lg" flexDirection={'column'}>
      <Heading variant="h4">Auto Backup</Heading>
      {backupOptions?.directoryHandle && (
        <Notification intent="positive" role="status">
          Enabled
        </Notification>
      )}
      <Text>
        This feature allows you to automatically backup your wallet data to your
        computer. You can enable or disable this feature at any time.
      </Text>
      <Stack>
        {backupOptions && backupOptions.directoryHandle ? (
          <Button variant="warning" onClick={disableAutoBackup}>
            Disable Auto Backup
          </Button>
        ) : (
          <Button variant="primary" onClick={enableAutoBackup}>
            Enable Auto Backup
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
