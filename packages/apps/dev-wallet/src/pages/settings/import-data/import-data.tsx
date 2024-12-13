import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { UUID } from '@/modules/types';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { browse, readContent } from '@/utils/select-file';
import { MonoSettings } from '@kadena/kode-icons/system';
import { Button, Heading, Notification, Stack, Text } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { ImportAccounts } from './Components/import-accounts';
import { ImportWatchedAccounts } from './Components/import-watched-accounts';

const csvToTable = (csv: string) => {
  const lines = csv.split('\n');
  const header = lines[0].split('\t');
  const table = header[0];
  const data = lines.slice(1).map((line) => line.split('\t').slice(1));
  return { table, header: header.slice(1), data };
};

export function ImportData() {
  const { profile, activeNetwork } = useWallet();
  const [fileContent, setFileContent] = useState<{
    table: string;
    header: string[];
    data: string[][];
  }>();
  const [selectedType, setSelectedType] = useState<
    'account' | 'watched-account' | 'contact'
  >();

  const profileId = profile?.uuid as UUID;
  const networkId = activeNetwork?.uuid as UUID;
  const [error, setError] = useState<string>();

  if (!profileId || !networkId) {
    return (
      <Notification intent="negative" role="alert">
        Profile or network not found
      </Notification>
    );
  }

  async function loadFile() {
    const file = await browse(false, ['text/csv']);
    if (!file || !(file instanceof File)) {
      alert('please select one file');
      return;
    }
    const contentString = await readContent(file);
    const content = csvToTable(contentString);
    if (!['account', 'watched-account', 'contact'].includes(content.table)) {
      setError(
        'Invalid file format; you can only import account, watched-account, or contact',
      );
      return;
    }
    setFileContent(content);
    setSelectedType(content.table as 'account' | 'watched-account' | 'contact');
  }

  return (
    <Stack flexDirection={'column'} gap={'md'} alignItems={'flex-start'}>
      <SideBarBreadcrumbs icon={<MonoSettings />} isGlobal>
        <SideBarBreadcrumbsItem href="/settings">
          Settings
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href="/settings/export-data">
          Import Data
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
      <Heading variant="h3">Import Data</Heading>
      {!selectedType && (
        <>
          <Text>
            The file format should be the same as exported files but you can
            leave the{' '}
            <Text bold color="emphasize">
              guard
            </Text>{' '}
            and{' '}
            <Text bold color="emphasize">
              chains
            </Text>{' '}
            columns empty if you don't have the information, we will verify the
            account with the blockchain
          </Text>
          <Text>You can import data into the following tables</Text>
          <ul>
            <li>
              <Text>account</Text>
            </li>
            <li>
              <Text>watched-account</Text>
            </li>
            <li>
              <Text>contact</Text>
            </li>
          </ul>
          <Stack
            flexDirection={'column'}
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
            gap={'sm'}
          >
            <Button
              variant="outlined"
              isCompact
              onClick={() => {
                loadFile();
              }}
            >
              Import Data
            </Button>
          </Stack>
        </>
      )}
      {error && (
        <Notification intent="negative" role="alert">
          {error}
        </Notification>
      )}
      {selectedType === 'account' && fileContent && (
        <ImportAccounts content={fileContent} />
      )}
      {selectedType === 'watched-account' && fileContent && (
        <ImportWatchedAccounts content={fileContent} />
      )}
      {selectedType === 'contact' && fileContent && (
        <Text>Not implemented yet!</Text>
      )}
    </Stack>
  );
}
