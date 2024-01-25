import { kadenaGenMnemonic } from '@kadena/hd-wallet';
import { Box, Button, Heading, Input, Text } from '@kadena/react-ui';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useWallet } from '../../hooks/wallet.context';

export function CreateWallet() {
  const { register, handleSubmit } = useForm<{
    password: string;
    profile: string;
  }>();
  const wallet = useWallet();
  async function create({
    profile,
    password,
  }: {
    profile: string;
    password: string;
  }) {
    const mnemonic = kadenaGenMnemonic();
    await wallet.createWallet(profile, password, mnemonic);
    console.log('wallet created');
  }
  if (wallet.isUnlocked) {
    return <Navigate to="/backup-recovery-phrase" replace />;
  }
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Create wallet</Heading>
        <Text>Enter a password to encrypt the wallet data with that</Text>
        <form onSubmit={handleSubmit(create)}>
          <label htmlFor="profile">Profile name</label>
          <Input id="profile" type="text" {...register('profile')} />
          <label htmlFor="password">Password</label>
          <Input id="password" type="password" {...register('password')} />
          <Button type="submit">Create</Button>
        </form>
      </Box>
    </main>
  );
}
