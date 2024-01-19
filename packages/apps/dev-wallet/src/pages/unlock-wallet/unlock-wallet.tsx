import { Box, Button, Heading, Input } from '@kadena/react-ui';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { useWallet } from '../../hooks/wallet.context';

export function UnlockWallet() {
  const { register, handleSubmit } = useForm<{ password: string }>();
  const wallet = useWallet();
  async function unlock({ password }: { password: string }) {
    await wallet.unlockWallet(password);
    console.log('wallet unlocked');
  }
  if (wallet.isUnlocked) {
    return <Navigate to="/" replace />;
  }
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Unlock your wallet</Heading>
        <form onSubmit={handleSubmit(unlock)}>
          <label htmlFor="password">Password</label>
          <Input id="password" type="password" {...register('password')} />
          <Button type="submit">Unlock</Button>
        </form>
        <Link to="/create-wallet">Create wallet</Link>
      </Box>
    </main>
  );
}
