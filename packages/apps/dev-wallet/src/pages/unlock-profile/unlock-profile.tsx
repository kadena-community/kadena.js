import { AuthCard } from '@/Components/AuthCard/AuthCard';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate.tsx';
import {
  Button,
  Heading,
  Stack,
  Text,
  TextField,
  Link as UiLink,
} from '@kadena/kode-ui';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useWallet } from '../../modules/wallet/wallet.hook';
import InitialsAvatar from '../select-profile/initials.tsx';
import { passwordContainer, profileContainer } from './styles.css.ts';

export function UnlockProfile({ origin }: { origin: string }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { isValid, errors },
  } = useForm<{ password: string }>();
  const { profileId } = useParams();
  const navigate = usePatchedNavigate();
  const { profileList, unlockProfile, isUnlocked } = useWallet();
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
      if (isUnlocked) {
        navigate('/');
      } else {
        navigate(origin);
      }
    } catch (e) {
      console.log(e);
      setError('password', { type: 'manual', message: incorrectPasswordMsg });
    }
  }
  if (!profile) {
    return <Navigate to="/select-profile" replace />;
  }
  return (
    <>
      <AuthCard>
        <Stack marginBlockEnd={'lg'}>
          <UiLink
            variant="outlined"
            isCompact
            type="button"
            onPress={() => {
              throw new Error('back');
            }}
            component={Link}
            href="/"
          >
            Back
          </UiLink>
        </Stack>
        <Stack
          gap="md"
          padding="sm"
          display="inline-flex"
          alignItems="center"
          className={profileContainer}
        >
          <InitialsAvatar
            size="large"
            name={profile.name}
            accentColor={profile.accentColor}
          />
          <Text>{profile.name}</Text>
        </Stack>
        <Heading variant="h5">Unlock your profile</Heading>
        <Text as="p">Enter your password to unlock access</Text>
        <form onSubmit={handleSubmit(unlock)}>
          <div className={passwordContainer}>
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
          </div>
          <Stack flexDirection="column" gap="md">
            <Button type="submit" isDisabled={!isValid}>
              Continue
            </Button>
            <Text as="p" size="small">
              Forgot password?
              <Link to="/import-wallet">Recover your profile</Link>
            </Text>
          </Stack>
        </form>
      </AuthCard>
    </>
  );
}
