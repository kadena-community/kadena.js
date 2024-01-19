import { useWallet } from '@/hooks/wallet.context';
import { Box, Heading } from '@kadena/react-ui';
import { Navigate } from 'react-router-dom';

export function HomePage() {
  const wallet = useWallet();
  if (!wallet.isUnlocked) {
    return <Navigate to="/unlock-wallet" replace />;
  }
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Home Page</Heading>
      </Box>
    </main>
  );
}
