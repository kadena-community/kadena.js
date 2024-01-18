import { Box, Heading } from '@kadena/react-ui';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Home page</Heading>
        <Link to="/create-wallet">Create wallet</Link>
      </Box>
    </main>
  );
}
