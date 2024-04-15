import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet.hook';
import { Box, Button, Heading, Text, TextField } from '@kadena/react-ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useWallet } from '../../modules/wallet/wallet.hook';

export function UnlockProfile() {
  const { register, handleSubmit } = useForm<{ password: string }>();
  const { profileId } = useParams();
  const [error, setError] = useState('');
  const { isUnlocked, profileList, unlockProfile } = useWallet();
  const { unlockHDWallet } = useHDWallet();
  const profile = profileList.find((p) => p.uuid === profileId);
  async function unlock({ password }: { password: string }) {
    try {
      if (!profileId) {
        throw new Error('ProfileId is undefined');
      }
      const result = await unlockProfile(profileId, password);
      if (!result) {
        throw new Error("Password doesn't match");
      }
      // for now we just pick the first key source later we should have a way to select the key source
      const keySource = result.keySources[0];
      if (!keySource) {
        throw new Error('No key source found');
      }
      await unlockHDWallet(keySource.source, password, keySource);
    } catch (e) {
      console.log(e);
      setError("Password doesn't match");
    }
  }
  if (!profile) {
    return <Navigate to="/select-profile" replace />;
  }
  if (isUnlocked) {
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
        {error && <Text>{error}</Text>}
        <Link to="/create-profile">Create profile</Link>
      </Box>
    </main>
  );
}
