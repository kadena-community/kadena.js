import { Box, Heading, Text } from '@kadena/react-ui';
import { Link } from 'react-router-dom';

export function BackupRecoveryPhrase() {
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Backup the recovery phrase</Heading>
        <Text>
          With recovery phrase you can recover your wallet; you should consider
          everyone with the phrase have access to your assets
        </Text>
        <Heading variant="h5">Choose a method</Heading>
        <Link to="/backup-recovery-phrase/write-it-down">
          Write down the phrase
        </Link>
        <Link to="/backup-recovery-phrase/export-encrypted">
          Export encrypted phrase
        </Link>
        <Link to="/home">Skip</Link>
      </Box>
    </main>
  );
}
