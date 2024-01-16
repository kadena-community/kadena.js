import { kadenaEncrypt, kadenaGenMnemonic } from '@kadena/hd-wallet';
import { Box, Button, Heading, Input, Text } from '@kadena/react-ui';

export function Password() {
  function create() {
    const mnemonic = kadenaGenMnemonic();
    console.log('create', mnemonic);
    const encrypted = kadenaEncrypt('password', mnemonic);
  }
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">On boarding</Heading>
        <Text>Enter a password to encrypt the wallet data with that</Text>
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" />
        <Button onClick={create}>Create</Button>
      </Box>
    </main>
  );
}
