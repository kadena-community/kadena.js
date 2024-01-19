import { Box, Button, Heading, Input, Text } from '@kadena/react-ui';
import { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useWallet } from '../../hooks/wallet.context';

export function UnlockWallet() {
  const { register, handleSubmit } = useForm<{ password: string }>();
  const { profile } = useParams();
  const [error, setError] = useState('');
  const wallet = useWallet();
  async function unlock({ password }: { password: string }) {
    try {
      await wallet.unlockWallet(profile!, password);
    } catch (e) {
      console.log(e);
      setError("Password doesn't match");
    }
  }
  if (!profile) {
    return <Navigate to="/select-profile" replace />;
  }
  if (wallet.isUnlocked) {
    return <Navigate to="/" replace />;
  }
  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Unlock your wallet</Heading>
        <Text>Profile: {profile}</Text>
        <form onSubmit={handleSubmit(unlock)}>
          <label htmlFor="password">Password</label>
          <Input id="password" type="password" {...register('password')} />
          <Button type="submit">Unlock</Button>
        </form>
        {error && <Text variant="base">{error}</Text>}
        <Link to="/create-wallet">Create wallet</Link>
      </Box>
    </main>
  );
}
