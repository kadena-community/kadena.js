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
      <UiLink
        href="/settings/change-network"
        component={Link}
        variant="outlined"
        startVisual={<MonoDownload />}
        isDisabled
      >
        Download Backup File
      </UiLink>
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
