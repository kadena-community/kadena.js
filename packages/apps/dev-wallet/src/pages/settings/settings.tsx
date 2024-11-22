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
import { ProfileNameColorForm } from './components/ProfileNameColorForm';

function downloadJSON(content: string, filename: string) {
  // Create a Blob with the JSON string
  const blob = new Blob([content], { type: 'application/json' });

  // Create a link element
  const link = document.createElement('a');

  // Set the link's href to a URL representing the Blob
  link.href = URL.createObjectURL(blob);

  // Set the download attribute with the desired filename
  link.download = filename;

  // Append the link to the body temporarily and trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up: remove the link element and revoke the Blob URL
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

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
          console.log('tables', tables);
          downloadJSON(tables, 'chainweaver-db-backup.json');
        }}
        variant="outlined"
        startVisual={<MonoDownload />}
      >
        Download Entire Database
      </Button>
      <UiLink
        href="/settings/change-network"
        component={Link}
        variant="outlined"
        startVisual={<MonoSettingsBackupRestore />}
        isDisabled
      >
        Set automatic backup
      </UiLink>
    </Stack>
  );
}
