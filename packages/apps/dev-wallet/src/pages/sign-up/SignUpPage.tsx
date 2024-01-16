import { Box, Button, Heading, Input } from '@kadena/react-ui';

export function SignUpPage() {
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Sign Up</Heading>
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" />
        <Button>Create</Button>
      </Box>
    </main>
  );
}
