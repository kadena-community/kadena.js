import { useCrypto } from '@/hooks/crypto.context';
import { Box, Button, Heading } from '@kadena/react-ui';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const wallet = useCrypto();
  return (
    <main>
      <Box margin="md">
        <Heading variant="h1">Kadena Wallet</Heading>
        <Link to={wallet.loaded ? '/accounts' : 'signin'}>
          <Button>{wallet.loaded ? 'Accounts' : 'Sign-In'}</Button>
        </Link>
      </Box>
    </main>
  );
}
