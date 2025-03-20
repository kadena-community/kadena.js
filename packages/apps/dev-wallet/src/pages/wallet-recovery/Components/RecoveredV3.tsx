import { CardContent } from '@/App/LayoutLandingPage/components/CardContent';
import { CardFooterContent } from '@/App/LayoutLandingPage/components/CardFooterContent';
import { ButtonItem } from '@/Components/ButtonItem/ButtonItem';
import { ConfirmDeletion } from '@/Components/ConfirmDeletion/ConfirmDeletion';
import { usePrompt } from '@/Components/PromptProvider/Prompt';
import { IDBBackup } from '@/modules/db/backup/backup';
import { dbService } from '@/modules/db/db.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { IProfile } from '@/modules/wallet/wallet.repository';
import InitialsAvatar from '@/pages/select-profile/initials';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { MonoConstruction, MonoDoDisturb } from '@kadena/kode-icons/system';
import {
  Button,
  Checkbox,
  Heading,
  Notification,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { CardFooterGroup } from '@kadena/kode-ui/patterns';
import { useState } from 'react';

export interface IV3Backup {
  scheme: 'v3';
  profiles: IProfile[];
  data: IDBBackup;
}
export function RecoveredV3({
  loadedContent,
  cancel,
}: {
  loadedContent: IV3Backup;
  cancel: () => void;
}) {
  const [error, setError] = useState<string | undefined>();
  const navigate = usePatchedNavigate();
  const prompt = usePrompt();
  const { profileList: walletProfiles } = useWallet();
  const [bypassAvailableCheck, setBypassAvailableCheck] = useState(false);
  const profiles = loadedContent.profiles.map((profile) => ({
    ...profile,
    alreadyExists: bypassAvailableCheck
      ? false
      : Boolean(walletProfiles.find((p) => p.uuid === profile.uuid)),
  }));
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>(
    profiles
      .filter((profile) =>
        bypassAvailableCheck
          ? true
          : !walletProfiles.find((p) => p.uuid === profile.uuid),
      )
      .map((profile) => profile.uuid),
  );
  return (
    <>
      <CardContent
        label="Chainweaver 3 Recovery"
        id="chainweaverrecovery"
        visual={<MonoConstruction width={36} height={36} />}
        description="This file contains {profiles.length} profiles. Select the profiles you want to import."
      />
      <Stack flexDirection={'column'} textAlign="left" gap={'sm'}>
        <Heading variant="h5">Detected Profiles</Heading>
        <Stack flexDirection={'column'}>
          {profiles.map((profile) => {
            const selected = selectedProfiles.includes(profile.uuid);

            const toggleSelect = () => {
              if (selected) {
                setSelectedProfiles(
                  selectedProfiles.filter((uuid) => uuid !== profile.uuid),
                );
              } else {
                setSelectedProfiles([...selectedProfiles, profile.uuid]);
              }
            };
            return (
              <ButtonItem
                onClick={toggleSelect}
                selected={selected}
                disabled={profile.alreadyExists}
              >
                <Stack alignItems={'center'} gap={'sm'}>
                  <Checkbox
                    isSelected={selectedProfiles.includes(profile.uuid)}
                    onChange={toggleSelect}
                  >
                    {''}
                  </Checkbox>
                  <Stack
                    key={profile.uuid}
                    alignItems={'center'}
                    gap={'sm'}
                    width="100%"
                  >
                    <InitialsAvatar
                      name={profile.name}
                      accentColor={profile.accentColor}
                      size="small"
                    />
                    <Text>{profile.name}</Text>
                    {profile.alreadyExists && (
                      <Stack flex={1} justifyContent={'flex-end'}>
                        <Text>
                          <MonoDoDisturb />
                        </Text>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </ButtonItem>
            );
          })}
        </Stack>
        {!bypassAvailableCheck &&
          profiles.find((profile) => profile.alreadyExists) && (
            <Notification intent="info" role="status">
              All profiles that are already available will be skipped to avoid
              missing funds.
              <Stack>
                <Button
                  variant="negative"
                  isCompact
                  onPress={async () => {
                    await prompt((resolve, reject) => (
                      <ConfirmDeletion
                        title="Bypass profile check"
                        description="The profile you select will be deleted and reimported again, So any update after the backup file will be gone! are you sure?"
                        onDelete={resolve}
                        onCancel={reject}
                        deleteText="Bypass"
                      />
                    ));
                    setBypassAvailableCheck(true);
                  }}
                >
                  Bypass this check
                </Button>
              </Stack>
            </Notification>
          )}
        {error && (
          <Notification intent="negative" role="alert">
            {error}
          </Notification>
        )}
      </Stack>

      <CardFooterContent>
        <Stack width="100%">
          <Button variant="outlined" onClick={cancel}>
            Back
          </Button>
        </Stack>
        <CardFooterGroup>
          <Button
            variant="primary"
            isDisabled={selectedProfiles.length < 1}
            onClick={async () => {
              try {
                await dbService.importBackup(
                  loadedContent.data,
                  selectedProfiles,
                );
              } catch (e: any) {
                setError('message' in e ? e.message : JSON.stringify(e));
              }
              navigate('/');
            }}
          >
            import
          </Button>
        </CardFooterGroup>
      </CardFooterContent>
    </>
  );
}
