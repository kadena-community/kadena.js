import { useWallet } from '@/modules/wallet/wallet.hook';
import { Box, Heading, Text } from '@kadena/react-ui';
import { Link, Navigate } from 'react-router-dom';

export function HomePage() {
  const { accounts, isUnlocked } = useWallet();
  if (!isUnlocked) {
    return <Navigate to="/select-profile" replace />;
  }
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Home Page</Heading>
        <Text variant="base">
          {accounts.length ? accounts[0].address : 'fix the issue'}
        </Text>
        <Link to="/backup-recovery-phrase">Back up recovery phrase</Link>
      </Box>
    </main>
  );
}
