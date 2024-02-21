import { useWallet } from '@/modules/wallet/wallet.hook';
import { Box, Heading } from '@kadena/react-ui';
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
        <Heading variant="h6">Accounts</Heading>
        {accounts.length ? (
          <ul>
            {' '}
            {accounts.map(({ address, overallBalance }) => (
              <li>
                <Box>
                  {address ?? 'No Address ;(!'} : {overallBalance}
                </Box>
              </li>
            ))}
          </ul>
        ) : null}
        <Link to="/backup-recovery-phrase">Back up recovery phrase</Link>
      </Box>
    </main>
  );
}
