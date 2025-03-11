import { IDBBackup, parseBackup } from '@/modules/db/backup/backup';
import { IProfile } from '@/modules/wallet/wallet.repository';
import { validateStructure } from '@/utils/chainweaver/validateStructure';
import { browse, readContent } from '@/utils/select-file';
import { MonoRestore } from '@kadena/kode-icons/system';
import {
  Box,
  Button,
  Heading,
  Notification,
  Stack,
  Text,
  Link as UiLink,
} from '@kadena/kode-ui';
import {
  CardContentBlock,
  CardFixedContainer,
  CardFooterGroup,
} from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ILegacyBackup, LegacyImport } from './Components/LegacyImport';
import { IV3Backup, RecoveredV3 } from './Components/RecoveredV3';

export function WalletRecovery() {
  const [fileContent, setFileContent] = useState<IV3Backup | ILegacyBackup>();
  const [error, setError] = useState<string | null>(null);
  if (fileContent) {
    if (fileContent.scheme === 'v3') {
      return (
        <RecoveredV3
          loadedContent={fileContent}
          cancel={() => setFileContent(undefined)}
        />
      );
    }
    if (fileContent.scheme === 'legacy') {
      return (
        <LegacyImport
          loadedContent={fileContent}
          cancel={() => setFileContent(undefined)}
        />
      );
    }
  }
  return (
    <CardFixedContainer>
      <CardContentBlock
        title="Wallet Recovery"
        visual={<MonoRestore width={36} height={36} />}
        extendedContent={<Box width="100%" paddingBlock={{ md: 'xxxl' }} />}
        supportingContent={
          <Box width="100%" paddingBlock="lg" textAlign="left">
            You can recover your wallet using one these methods.
          </Box>
        }
      >
        <Stack flexDirection={'column'} gap={'lg'}>
          <Stack
            marginBlockEnd="md"
            flexDirection={'column'}
            textAlign="left"
            alignItems={'flex-start'}
            gap={'sm'}
          >
            <Heading variant="h5">Backup File</Heading>
            <Text>
              Select this option if you want to use the backup file from
              Chainweaver. Also use this option when you have the mnemonic{' '}
              <strong>and</strong> the backup file.
            </Text>
            <Button
              variant="outlined"
              isCompact
              onClick={async () => {
                setError(null);
                setFileContent(undefined);
                const file = await browse(false);
                if (file && file instanceof File) {
                  const content = await readContent(file);
                  try {
                    const json = parseBackup(content);
                    setFileContent(json);
                    if (json.wallet_version === '3') {
                      if (json.db_version < 46) {
                        setError(
                          'The backup file is too old, You cant recover this file - this was generated with alpha version which is not supported anymore',
                        );
                        return;
                      }
                      const backup: IDBBackup = json;
                      console.log('chainweaver v3 detected!');
                      const profiles = backup.data.profile.map(
                        (p) => p.value as unknown as IProfile,
                      );
                      setFileContent({
                        scheme: 'v3',
                        profiles,
                        data: backup,
                      });
                    } else if ('StoreFrontend_Data' in json) {
                      try {
                        validateStructure(json);
                      } catch (e: any) {
                        setError(
                          'message' in e ? e.message : JSON.stringify(e),
                        );
                        return;
                      }
                      setFileContent({
                        scheme: 'legacy',
                        profiles: undefined,
                        data: json,
                      });
                    }
                  } catch (e) {
                    setError('Invalid file format');
                  }
                }
              }}
            >
              Backup File
            </Button>
          </Stack>
          <Stack
            marginBlockEnd="md"
            flexDirection={'column'}
            textAlign="left"
            alignItems={'flex-start'}
            gap={'sm'}
          >
            <Heading variant="h5">Recovery Phrase</Heading>
            <Text>
              If you only have your mnemonic select this option, we will try
              later to discover your accounts from blockchain
            </Text>
            <UiLink
              href="/wallet-recovery/recover-from-mnemonic"
              component={Link}
              variant="outlined"
              isCompact
            >
              Recovery Phrase
            </UiLink>
          </Stack>
          {error && (
            <Stack>
              <Notification intent="negative" role="alert">
                {error}
              </Notification>
            </Stack>
          )}
        </Stack>
      </CardContentBlock>
      <CardFooterGroup separated={true}>
        <UiLink href="/" component={Link} variant="outlined">
          Back
        </UiLink>
      </CardFooterGroup>
    </CardFixedContainer>
  );
}
