import { useWallet } from '@/hooks/wallet.hook';
import { Box, Heading, Text } from '@kadena/react-ui';
import { Link } from 'react-router-dom';

export function SelectProfile() {
  const wallet = useWallet();
  if (wallet.isUnlocked) {
    wallet.lockWallet();
  }
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Select a profile</Heading>
        {wallet.profileList.map((profile) => (
          <div key={profile.uuid}>
            <Link to={`/unlock-wallet/${profile.uuid}`}>{profile.name}</Link>
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
