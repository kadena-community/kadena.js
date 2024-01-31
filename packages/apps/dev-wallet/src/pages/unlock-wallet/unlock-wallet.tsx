import { Box, Button, Heading, Text, TextField } from '@kadena/react-ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useWallet } from '../../wallet/wallet.hook';

export function UnlockWallet() {
  const { register, handleSubmit } = useForm<{ password: string }>();
  const { profileId } = useParams();
  const [error, setError] = useState('');
  const wallet = useWallet();
  const profile = wallet.profileList.find((p) => p.uuid === profileId);
  async function unlock({ password }: { password: string }) {
    try {
      await wallet.unlockWallet(profile!.uuid, password);
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
        <Text>Profile: {profile.name}</Text>
        <form onSubmit={handleSubmit(unlock)}>
          <label htmlFor="password">Password</label>
          <TextField id="password" type="password" {...register('password')} />
          <Button type="submit">Unlock</Button>
        </form>
        {error && <Text variant="base">{error}</Text>}
        <Link to="/create-wallet">Create wallet</Link>
      </Box>
    </main>
  );
}
