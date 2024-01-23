import { useProfile } from '@/hooks/use-profile';
import { useWallet } from '@/hooks/wallet.context';
import { Box, Heading, Text } from '@kadena/react-ui';
import { Link } from 'react-router-dom';

export function SelectProfile() {
  const wallet = useWallet();
  const [profiles] = useProfile();
  if (wallet.isUnlocked) {
    wallet.lockWallet();
  }
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Select a profile</Heading>
        {profiles.map((profile) => (
          <div key={profile}>
            <Link to={`/unlock-wallet/${profile}`}>{profile}</Link>
          </div>
        ))}
        <br />
        <Link to="/create-wallet">
          <Text bold>Create wallet</Text>
        </Link>
      </Box>
    </main>
  );
}
