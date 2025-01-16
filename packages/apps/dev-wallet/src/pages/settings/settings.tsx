import { ConfirmDeletion } from '@/Components/ConfirmDeletion/ConfirmDeletion';
import { usePrompt } from '@/Components/PromptProvider/Prompt';
import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { dbService } from '@/modules/db/db.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { deleteProfile } from '@/modules/wallet/wallet.service';
import { getErrorMessage } from '@/utils/getErrorMessage';
import {
  MonoDangerous,
  MonoDataset,
  MonoDownload,
  MonoListAlt,
  MonoPassword,
  MonoPerson,
  MonoRemoveRedEye,
  MonoSecurity,
  MonoSelectAll,
  MonoSettings,
  MonoSettingsBackupRestore,
  MonoWifiTethering,
} from '@kadena/kode-icons/system';
import {
  Button,
  Heading,
  Notification,
  Stack,
  Text,
  Link as UiLink,
} from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem, useLayout } from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isFileSystemAccessSupported } from '../../modules/backup/fileApi';
import { linkClass } from '../home/style.css';
import { ProfileNameColorForm } from './components/ProfileNameColorForm';
import { downloadAsFile } from './utils/download-file';

export function Settings() {
  const { isRightAsideExpanded, setIsRightAsideExpanded } = useLayout();
  const { keySources, profile, lockProfile } = useWallet();
  const prompt = usePrompt();
  const [error, setError] = useState<string | undefined>();

  async function downloadBackup() {
    const tables = await dbService.serializeTables();
    downloadAsFile(tables, 'chainweaver-db-backup.json', 'application/json');
  }
  return (
    <Stack flexDirection={'column'} gap={'md'} alignItems={'flex-start'}>
      <SideBarBreadcrumbs icon={<MonoSettings />} isGlobal>
        <SideBarBreadcrumbsItem href="/settings">
          Settings
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
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
        href="/networks"
        component={Link}
        variant="outlined"
        startVisual={<MonoWifiTethering />}
      >
        Networks
      </UiLink>
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
        href="/settings/keep-password-policy"
        component={Link}
        variant="outlined"
        startVisual={<MonoSecurity />}
      >
        Keep Password Policy
      </UiLink>
      <UiLink
        href="/settings/export-data"
        component={Link}
        variant="outlined"
        startVisual={<MonoDataset />}
      >
        Export Data
      </UiLink>
      <UiLink
        href="/settings/import-data"
        component={Link}
        variant="outlined"
        startVisual={<MonoListAlt />}
      >
        Import Data
      </UiLink>
      <Button
        onClick={downloadBackup}
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
      <UiLink
        href={`/account-discovery`}
        component={Link}
        variant="outlined"
        startVisual={<MonoSelectAll />}
        isDisabled={!keySources.length}
      >
        Start Account Discovery
      </UiLink>
      <Button
        variant="negative"
        startVisual={<MonoDangerous />}
        onClick={async () => {
          if (!profile) return;
          const answer = await prompt((resolve, reject) => (
            <ConfirmDeletion
              title={`Delete ${profile.name} Profile`}
              description={
                <Stack gap={'md'} flexDirection={'column'}>
                  <Text>
                    You are about to Delete{' '}
                    <Text bold color="emphasize">
                      {profile?.name}
                    </Text>{' '}
                    profile! This will delete everything including recovery
                    phrase. Make sure you have a backup of your data (
                    <button className={linkClass} onClick={downloadBackup}>
                      <Text color="inherit" bold>
                        backup now
                      </Text>
                    </button>
                    ).
                  </Text>
                  <Text bold color="emphasize">
                    Are you sure about this action?
                  </Text>
                </Stack>
              }
              onDelete={() => resolve(true)}
              onCancel={reject}
              deleteText={`Delete ${profile?.name} Profile`}
            />
          ));
          if (answer) {
            deleteProfile(profile.uuid)
              .then(() => {
                lockProfile();
              })
              .catch((e) => {
                setError(getErrorMessage(e, 'Failed to delete profile'));
              });
          }
        }}
      >
        Delete Profile
      </Button>
      {error && (
        <Notification intent="negative" role="alert">
          {error}
        </Notification>
      )}
    </Stack>
  );
}
