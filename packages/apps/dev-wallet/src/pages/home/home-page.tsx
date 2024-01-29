import { useWallet } from '@/wallet/wallet.hook';
import { Box, Heading, Text } from '@kadena/react-ui';
import { Link, Navigate } from 'react-router-dom';

export function HomePage() {
  const wallet = useWallet();
  if (!wallet.isUnlocked) {
    return <Navigate to="/select-profile" replace />;
  }
  console.log(wallet.accounts);
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Home Page</Heading>
        <Text variant="base">
          {wallet.accounts.length
            ? wallet.accounts[0].address
            : 'fix the issue'}
        </Text>
        <Link to="/backup-recovery-phrase">Back up recovery phrase</Link>
      </Box>
    </main>
  );
}
