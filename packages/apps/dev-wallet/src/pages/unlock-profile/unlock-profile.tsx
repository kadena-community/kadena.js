import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet.hook';
import { Box, Button, Heading, Text, TextField } from '@kadena/react-ui';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useWallet } from '../../modules/wallet/wallet.hook';

export function UnlockProfile() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { isValid, errors }
  } = useForm<{ password: string }>();
  const { profileId } = useParams();
  const { isUnlocked, profileList, unlockProfile } = useWallet();
  const { unlockHDWallet } = useHDWallet();
  const profile = profileList.find((p) => p.uuid === profileId);
  const incorrectPasswordMsg = 'Password is incorrect';

  async function unlock({ password }: { password: string }) {
    try {
      if (!profileId) {
        throw new Error('ProfileId is undefined');
      }
      const result = await unlockProfile(profileId, password);
      if (!result) {
        throw new Error(incorrectPasswordMsg);
      }
      // for now we just pick the first key source later we should have a way to select the key source
      const keySource = result.keySources[0];
      if (!keySource) {
        throw new Error('No key source found');
      }
      await unlockHDWallet(keySource.source, password, keySource);
    } catch (e) {
      console.log(e);
      setError('password', { type: 'manual', message: incorrectPasswordMsg });
    }
  }
  if (!profile) {
    return <Navigate to="/select-profile" replace />;
  }
  if (isUnlocked) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <Box margin="md">
        <Text>Profile: {profile.name}</Text>
        <Heading variant="h5">Unlock your profile</Heading>
        <Text>Enter your password to unlock access</Text>
        <form onSubmit={handleSubmit(unlock)}>
          <TextField
            id="password"
            type="password"
            placeholder="Password"
            aria-label="Password"
            isRequired
            {...register('password', {
              required: { value: true, message: 'This field is required' },
            })}
            isInvalid={!isValid && !!errors.password}
            errorMessage={errors.password?.message}
          />
          <Button type="submit" isDisabled={!isValid} >Continue</Button>
        </form>
        <Text as="p">Forgot password? <Link to="/import-wallet">Recover your profile</Link></Text>
      </Box>
    </>
  );
}
