import { ListItem } from '@/Components/ListItem/ListItem';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { IProfile, walletRepository } from '@/modules/wallet/wallet.repository';
import InitialsAvatar from '@/pages/select-profile/initials';
import { Label } from '@/pages/transaction/components/helpers';
import { ExportFromChainweaver } from '@/utils/chainweaver/chainweaver';
import { MonoConstruction } from '@kadena/kode-icons/system';
import {
  Box,
  Button,
  Heading,
  Notification,
  Stack,
  Text,
  TextField,
  Link as UiLink,
} from '@kadena/kode-ui';
import {
  CardContentBlock,
  CardFixedContainer,
  CardFooterGroup,
} from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createProfileFromChainweaverData } from '../import-chainweaver-export/createProfileFromChainweaverData';
import { createSelectionOptions } from '../import-chainweaver-export/createSelectionOptions';

export interface ILegacyBackup {
  scheme: 'legacy';
  profiles: undefined;
  data: ExportFromChainweaver;
}

async function importLegacyData(
  data: ExportFromChainweaver,
  password: string,
  profileName: string,
) {
  const items = createSelectionOptions(data);
  const itemsToImport = {
    accounts: items.accounts
      .filter((account) => account.selected)
      .map((account) => account.value),
    keyPairs: items.keyPairs
      .filter((keyPair) => keyPair.selected)
      .map((keyPair) => keyPair.value),
    tokens: items.tokens
      .filter((token) => token.selected)
      .map((token) => token.value),
    networks: items.networks
      .filter((network) => network.selected)
      .map((network) => network.value),
    rootKey: items.rootKey
      .filter((rootKey) => rootKey.selected)
      .reduce((_, rootKey) => rootKey.value.rootkey, ''),
  };
  const profileId = await createProfileFromChainweaverData(
    itemsToImport,
    password,
    profileName,
  );
  if (profileId) return walletRepository.getProfile(profileId);
  if (!profileId) throw new Error('Failed to create profile');
  return walletRepository.getProfile(profileId);
}

export function LegacyImport({
  loadedContent,
  cancel,
}: {
  loadedContent: ILegacyBackup;
  cancel: () => void;
}) {
  console.log(loadedContent);
  const { profileList } = useWallet();
  const [password, setPassword] = useState<string>('');
  const [mnemonic, setMnemonic] = useState<string>('');
  const [profile, setProfile] = useState<IProfile>();
  const [step, setStep] = useState<'input-data' | 'import' | 'success'>(
    'input-data',
  );
  const [error, setError] = useState<string | undefined>();
  return (
    <>
      {step === 'input-data' && (
        <CardFixedContainer>
          <CardContentBlock
            title="Chainweaver Legacy (v1/v2) Import"
            visual={<MonoConstruction width={36} height={36} />}
            extendedContent={<Box width="100%" paddingBlock={{ md: 'xxxl' }} />}
            supportingContent={
              <Box width="100%" paddingBlock="lg" textAlign="left">
                In order to import your Chainweaver v1/v2 backup, you need to
                enter the password.
              </Box>
            }
          >
            <Stack flexDirection={'column'} textAlign="left" gap={'sm'}>
              <Stack flexDirection={'column'} gap={'lg'}>
                <TextField
                  label="Password"
                  type="password"
                  placeholder="Enter the your old chainweaver password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Stack flexDirection={'column'} gap={'sm'}>
                  <Label bold size="small">
                    Recovery Phrase (optional)
                  </Label>
                  <Text size="small">
                    Then we can validate the rootKey and let you use your
                    mnemonic to create BIP44 keys.
                  </Text>
                  <TextField
                    type="text"
                    placeholder="e.g hobby corn regret phone thought seek ..."
                    value={mnemonic}
                    onChange={(e) => setMnemonic(e.target.value)}
                  />
                </Stack>
              </Stack>
            </Stack>
          </CardContentBlock>
          <CardFooterGroup separated={true}>
            <Button variant="outlined" onClick={cancel}>
              Back
            </Button>
            <CardFooterGroup>
              <Button
                variant="primary"
                onClick={async () => {
                  setStep('import');
                  try {
                    const createdProfile = await importLegacyData(
                      loadedContent.data,
                      password,
                      `profile-${profileList.length + 1} (Imported)`,
                    );
                    setProfile(createdProfile);
                    setStep('success');
                  } catch (e: any) {
                    console.error(e);
                    setError('message' in e ? e.message : JSON.stringify(e));
                  }
                }}
              >
                Import
              </Button>
            </CardFooterGroup>
          </CardFooterGroup>
        </CardFixedContainer>
      )}
      {step === 'import' && (
        <CardFixedContainer>
          <CardContentBlock
            title="Chainweaver Legacy (v1/v2) Import"
            visual={<MonoConstruction width={36} height={36} />}
            extendedContent={<Box width="100%" paddingBlock={{ md: 'xxxl' }} />}
            supportingContent={
              <Box width="100%" paddingBlock="lg" textAlign="left">
                importing Chainweaver v2 backup.
              </Box>
            }
          >
            {!error && (
              <Stack flexDirection={'column'} textAlign="left" gap={'sm'}>
                Please wait while we import your data.
              </Stack>
            )}
            {error && (
              <Notification intent="negative" role="alert">
                {error}
              </Notification>
            )}
          </CardContentBlock>
          <CardFooterGroup separated={true}>
            <Button variant="outlined" isDisabled={!error} onClick={cancel}>
              Back
            </Button>
            <CardFooterGroup>
              <Button variant="primary" isLoading={!error}>
                Import
              </Button>
            </CardFooterGroup>
          </CardFooterGroup>
        </CardFixedContainer>
      )}
      {step === 'success' && profile && (
        <CardFixedContainer>
          <CardContentBlock
            title="Chainweaver Legacy (v1/v2) Import"
            visual={<MonoConstruction width={36} height={36} />}
            extendedContent={<Box width="100%" paddingBlock={{ md: 'xxxl' }} />}
            supportingContent={
              <Box width="100%" paddingBlock="lg" textAlign="left">
                importing Chainweaver v2 backup.
              </Box>
            }
          >
            <Stack flexDirection={'column'} textAlign="left" gap={'md'}>
              <Notification intent="positive" role="status">
                All done! Your data has been imported.
              </Notification>
              <Heading variant="h5">Profile</Heading>
              <ListItem>
                <Stack gap={'md'}>
                  <InitialsAvatar
                    name={profile.name}
                    accentColor={profile.accentColor}
                    size="small"
                  />
                  <Text>{profile.name}</Text>
                </Stack>
              </ListItem>
              <Text>
                You can change the profile name and password later in the
                setting page.
              </Text>
            </Stack>
          </CardContentBlock>
          <CardFooterGroup>
            <UiLink
              component={Link}
              variant="primary"
              href={`/unlock-profile/${profile.uuid}`}
            >
              Login
            </UiLink>
          </CardFooterGroup>
        </CardFixedContainer>
      )}
    </>
  );
}
