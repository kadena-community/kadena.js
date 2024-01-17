import {
  kadenaEncrypt,
  kadenaGenMnemonic,
  kadenaMnemonicToSeed,
} from '@kadena/hd-wallet';
import { Box, Button, Heading, Input, Text } from '@kadena/react-ui';
import { useForm } from 'react-hook-form';

export function Password() {
  const { register, handleSubmit } = useForm<{ password: string }>();

  function create({ password }: { password: string }) {
    const mnemonic = kadenaGenMnemonic();
    const encrypted = kadenaEncrypt(password, mnemonic);
    localStorage.setItem('encrypted', encrypted);
    const seedBuffer = kadenaMnemonicToSeed('', mnemonic);
  }
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">On boarding</Heading>
        <Text>Enter a password to encrypt the wallet data with that</Text>
        <form onSubmit={handleSubmit(create)}>
          <label htmlFor="password">Password</label>
          <Input id="password" type="password" {...register('password')} />
          <Button type="submit">Create</Button>
        </form>
      </Box>
    </main>
  );
}
