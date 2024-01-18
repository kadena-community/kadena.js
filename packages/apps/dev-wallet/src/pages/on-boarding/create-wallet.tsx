import { kadenaGenMnemonic } from '@kadena/hd-wallet';
import { Box, Button, Heading, Input, Text } from '@kadena/react-ui';
import { useForm } from 'react-hook-form';
import { useWallet } from '../../service/wallet.context';

export function CreateWallet() {
  const { register, handleSubmit } = useForm<{ password: string }>();
  const wallet = useWallet();

  function create({ password }: { password: string }) {
    const mnemonic = kadenaGenMnemonic();
    wallet.createWallet(password, mnemonic);
  }
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Create wallet</Heading>
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
