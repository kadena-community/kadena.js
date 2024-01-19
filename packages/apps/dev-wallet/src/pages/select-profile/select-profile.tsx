import { useProfile } from '@/hooks/useProfile';
import { Box, Heading, Text } from '@kadena/react-ui';
import { Link } from 'react-router-dom';

export function SelectProfile() {
  const [profiles] = useProfile();
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
