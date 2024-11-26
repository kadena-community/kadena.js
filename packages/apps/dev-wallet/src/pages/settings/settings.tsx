import { dbService } from '@/modules/db/db.service';
import {
  MonoDownload,
  MonoPassword,
  MonoPerson,
  MonoRemoveRedEye,
  MonoSettingsBackupRestore,
} from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Link as UiLink } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { Link } from 'react-router-dom';
import { isFileSystemAccessSupported } from '../../modules/backup/fileApi';
import { ProfileNameColorForm } from './components/ProfileNameColorForm';
import { downloadAsFile } from './utils/download-file';

export function Settings() {
  const { isRightAsideExpanded, setIsRightAsideExpanded } = useLayout();
  return (
    <Stack flexDirection={'column'} gap={'md'} alignItems={'flex-start'}>
      <Heading variant="h3">Settings</Heading>
      <ProfileNameColorForm isOpen={isRightAsideExpanded} />
      <Button
        startVisual={<MonoPerson />}
        variant="outlined"
        onClick={() => {
          setIsRightAsideExpanded(!isRightAsideExpanded);
        }}
      >
        Change Name or Color
      </Button>
      <UiLink
        href="/settings/reveal-phrase"
        component={Link}
        variant="outlined"
        startVisual={<MonoRemoveRedEye />}
      >
        Reveal Recovery Phrase
      </UiLink>
      <UiLink
        href="/settings/change-password"
        component={Link}
        variant="outlined"
        startVisual={<MonoPassword />}
      >
        Change Password
      </UiLink>
      <Button
        onClick={async () => {
          const tables = await dbService.serializeTables();
          downloadAsFile(
            tables,
            'chainweaver-db-backup.json',
            'application/json',
          );
        }}
        variant="outlined"
        startVisual={<MonoDownload />}
      >
        Download Entire Database
      </Button>
      <UiLink
        href="/settings/auto-backup"
        component={Link}
        variant="outlined"
        startVisual={<MonoSettingsBackupRestore />}
        isDisabled={!isFileSystemAccessSupported()}
      >
        Set automatic backup
      </UiLink>
    </Stack>
  );
}
