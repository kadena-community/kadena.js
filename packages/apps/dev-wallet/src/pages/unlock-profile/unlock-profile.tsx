import { CardFooterContent } from '@/App/LayoutLandingPage/components/CardFooterContent.tsx';
import { useCardLayout } from '@/App/LayoutLandingPage/components/CardLayoutProvider.tsx';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate.tsx';
import { MonoKey } from '@kadena/kode-icons/system';
import {
  Button,
  Card,
  Stack,
  Text,
  TextField,
  Link as UiLink,
} from '@kadena/kode-ui';
import { CardContentBlock, CardFooterGroup } from '@kadena/kode-ui/patterns';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useWallet } from '../../modules/wallet/wallet.hook';
import { wrapperClass } from '../errors/styles.css.ts';
import InitialsAvatar from '../select-profile/initials.tsx';
import { passwordContainer, profileContainer } from './styles.css.ts';

export function UnlockProfile({ origin }: { origin: string }) {
  const { setContent } = useCardLayout();
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

  useEffect(() => {
    setContent({
      label: 'Unlock your profile',
      key: 'unlockprofile',
      description: 'Enter your password to unlock access',
      visual: <MonoKey width={40} height={40} />,
    });
  }, []);

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
    <form>
      <Stack flexDirection="column" className={wrapperClass}>
        <Stack
          gap="md"
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

        <div className={passwordContainer}>
          <TextField
            id="password"
            autoFocus
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
      </Stack>

      <CardFooterContent>
        <Stack width="100%">
          <UiLink
            variant="outlined"
            isCompact
            component={Link}
            href="/select-profile"
          >
            Back
          </UiLink>
        </Stack>
        <CardFooterGroup>
          <UiLink
            variant="transparent"
            component={Link}
            href="/wallet-recovery"
          >
            Recover your wallet
          </UiLink>
          <Button onClick={handleSubmit(unlock)} isDisabled={!isValid}>
            Continue
          </Button>
        </CardFooterGroup>
      </CardFooterContent>
    </form>
  );
}
