import { useWallet } from '@/modules/wallet/wallet.hook';
import { Box, Heading, Text } from '@kadena/react-ui';
import { Link } from 'react-router-dom';

export function SelectProfile() {
  const { isUnlocked, profileList, lockWallet } = useWallet();
  if (isUnlocked) {
    lockWallet();
  }
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Select a profile</Heading>
        {profileList.map((profile) => (
          <div key={profile.uuid}>
            <Link to={`/unlock-wallet/${profile.uuid}`}>{profile.name}</Link>
          </div>
        ))}
        <br />
        <Link to="/create-wallet">
          <Text bold>Create wallet</Text>
        </Link>
        <br />
        <Link to="/networks">
          <Text bold>Networks</Text>
        </Link>
        <br />
        <Link to="/import-wallet">
          <Text bold>Import/Recover wallet</Text>
        </Link>
      </Box>
    </main>
  );
}
