import { AuthCard } from '@/Components/AuthCard/AuthCard';
import { MonoDashboardCustomize } from '@kadena/kode-icons/system';
import { Box, Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { Link } from 'react-router-dom';

export function BackupRecoveryPhrase() {
  useLayout({
    breadCrumbs: [
      {
        label: 'Backup',
        visual: <MonoDashboardCustomize />,
        url: '/backup-recovery-phrase',
      },
    ],
  });

  return (
    <>
      <AuthCard>
        <Box margin="md">
          <Heading variant="h5">Backup the recovery phrase</Heading>
          <Text>
            With recovery phrase you can recover your wallet; you should
            consider everyone with the phrase have access to your assets
          </Text>
          <Heading variant="h5">Choose a method</Heading>
          <Stack justifyContent={'space-between'}>
            <Link to={`/backup-recovery-phrase/write-down`}>
              <Button>Write down the phrase</Button>
            </Link>
            <Link to="/">
              <Button variant="transparent">Skip</Button>
            </Link>
          </Stack>
        </Box>
      </AuthCard>
    </>
  );
}
