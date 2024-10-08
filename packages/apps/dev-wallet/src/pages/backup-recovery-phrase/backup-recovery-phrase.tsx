import { AuthCard } from '@/Components/AuthCard/AuthCard';
import { Box, Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { Link } from 'react-router-dom';

export function BackupRecoveryPhrase() {
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
