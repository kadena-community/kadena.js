import { AuthCard } from '@/Components/AuthCard/AuthCard.tsx';
import { BackupMnemonic } from '@/Components/BackupMnemonic/BackupMnemonic';
import { config } from '@/config';
import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet';
import {
  PublicKeyCredentialCreate,
  createCredential,
  extractPublicKeyHex,
} from '@/utils/webAuthn';
import { kadenaGenMnemonic } from '@kadena/hd-wallet';
import { Button, Heading, Stack, Text, TextField } from '@kadena/kode-ui';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useWallet } from '../../modules/wallet/wallet.hook';
import { noStyleLinkClass } from '../home/style.css';

const rotate = (max: number, start: number = 0) => {
  let index = start;
  return () => {
    index = (index + 1) % max;
    return index;
  };
};

export function CreateProfile() {
  const {
    createProfile,
    createKey,
    createKAccount,
    profileList,
    unlockProfile,
    activeNetwork,
  } = useWallet();
  const [step, setStep] = useState<
    'profile' | 'set-password' | 'backup-mnemonic' | 'confirm'
  >('profile');
  const { createHDWallet } = useHDWallet();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const isShortFlow = profileList.length === 0;
  const formRef = useRef<HTMLFormElement>(null);
  const rotateColor = useRef(
    rotate(config.colorList.length, profileList.length),
  );

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid, errors },
  } = useForm<{
    password: string;
    confirmation: string;
    profileName: string;
    accentColor: string;
  }>({
    mode: 'all',
    defaultValues: {
      password: '',
      confirmation: '',
      profileName: isShortFlow
        ? 'default'
        : `profile-${profileList.length + 1}`,
      accentColor: config.colorList[rotateColor.current()],
    },
  });

  const [webAuthnCredential, setWebAuthnCredential] =
    useState<PublicKeyCredentialCreate>();

  async function create({
    profileName,
    password,
    accentColor,
  }: {
    profileName?: string;
    password: string;
    accentColor: string;
  }) {
    let pass = password;
    if (!activeNetwork) {
      return;
    }
    if (webAuthnCredential && password === 'WEB_AUTHN_PROTECTED') {
      const pk = webAuthnCredential.response.getPublicKey();
      if (!pk) {
        throw new Error('Public key not found');
      }
      pass = extractPublicKeyHex(pk);
    }
    const mnemonic = kadenaGenMnemonic();
    const profile = await createProfile(
      profileName,
      pass,
      accentColor,
      webAuthnCredential
        ? {
            authMode: 'WEB_AUTHN',
            webAuthnCredential: webAuthnCredential.rawId,
            rememberPassword: 'session',
          }
        : {
            authMode: 'PASSWORD',
            rememberPassword: 'session',
          },
      mnemonic,
    );
    // for now we only support slip10 so we just create the keySource and the first account by default for it
    // later we should change this flow to be more flexible
    const keySource = await createHDWallet(profile.uuid, 'HD-BIP44', pass);

    const key = await createKey(keySource);

    await createKAccount(profile.uuid, activeNetwork.uuid, key.publicKey);

    setMnemonic(mnemonic);
    setProfileId(profile.uuid);
    setPassword(pass);
    setStep('backup-mnemonic');

    // TODO: navigate to the backup recovery phrase page
  }

  async function createWebAuthnCredential() {
    const result = await createCredential();
    if (result && result.credential) {
      // const pk = result.credential.response.getPublicKey();
      // setPublicKey(pk ? hex(new Uint8Array(extractPublicKeyBytes(pk))) : '');
      setWebAuthnCredential(result.credential);
      setValue('password', 'WEB_AUTHN_PROTECTED');
      setValue('confirmation', 'WEB_AUTHN_PROTECTED');
      setTimeout(() => {
        formRef.current?.requestSubmit();
      }, 200);
    } else {
      console.error('Error creating credential');
    }
  }

  async function onLockTheWallet() {
    if (!profileId) {
      throw new Error('Profile id is not set');
    }
    await unlockProfile(profileId, password);
  }

  return (
    <>
      <AuthCard>
        <form onSubmit={handleSubmit(create)} ref={formRef}>
          {step === 'profile' && (
            <Stack flexDirection={'column'} gap={'lg'}>
              <Stack>
                <Link to="/" className={noStyleLinkClass}>
                  <Button
                    variant="outlined"
                    isCompact
                    type="button"
                    onPress={() => {
                      throw new Error('back');
                    }}
                  >
                    Back
                  </Button>
                </Link>
              </Stack>
              <Stack flexDirection={'column'}>
                <Heading variant="h4">Create Profile</Heading>
                <Stack marginBlock="md" gap="sm" alignItems={'flex-end'}>
                  <TextField
                    id="profileName"
                    type="text"
                    label="Profile name"
                    defaultValue={getValues('profileName')}
                    key="profileName"
                    {...register('profileName', {
                      required: {
                        value: true,
                        message: 'This field is required',
                      },
                    })}
                    isInvalid={!isValid && !!errors.profileName}
                    errorMessage={
                      errors.profileName && errors.profileName?.message
                    }
                  />
                </Stack>
              </Stack>
              <Stack flexDirection={'column'} gap={'lg'}>
                <Text size="smallest">
                  Your system supports{' '}
                  <Text bold size="smallest">
                    WebAuthn
                  </Text>{' '}
                  so you can create a more secure and more convenient
                  password-less profile!
                </Text>
              </Stack>
              <Stack flexDirection="row" gap={'sm'}>
                <Button
                  type="button"
                  variant="transparent"
                  onClick={() => setStep('set-password')}
                >
                  Prefer password
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    createWebAuthnCredential();
                  }}
                >
                  Password-less
                </Button>
              </Stack>
            </Stack>
          )}
          {step === 'set-password' && (
            <Stack flexDirection={'column'} gap={'lg'}>
              <Stack>
                <Button
                  variant="outlined"
                  isCompact
                  type="button"
                  onPress={() => {
                    setStep('profile');
                  }}
                >
                  Back
                </Button>
              </Stack>
              <Heading variant="h4">Choose a password</Heading>
              <Stack marginBlockStart="sm">
                <Text>
                  Carefully select your password as this will be your main
                  security of your wallet
                </Text>
              </Stack>
              <Stack flexDirection="column" marginBlock="md" gap="sm">
                <TextField
                  id="password"
                  type="password"
                  label="Password"
                  defaultValue={getValues('password')}
                  // react-hook-form uses uncontrolled elements;
                  // and because we add and remove the fields we need to add key to prevent confusion for react
                  key="password"
                  {...register('password', {
                    required: {
                      value: true,
                      message: 'This field is required',
                    },
                    minLength: { value: 6, message: 'Minimum 6 symbols' },
                  })}
                  isInvalid={!isValid && !!errors.password}
                  errorMessage={errors.password?.message}
                />
                <TextField
                  id="confirmation"
                  type="password"
                  label="Confirm password"
                  defaultValue={getValues('confirmation')}
                  key="confirmation"
                  {...register('confirmation', {
                    validate: (value) => {
                      return (
                        getValues('password') === value ||
                        'Passwords do not match'
                      );
                    },
                  })}
                  isInvalid={!isValid && !!errors.confirmation}
                  errorMessage={errors.confirmation?.message}
                />
              </Stack>
              <Stack flexDirection="column">
                <Button type="submit" isDisabled={!isValid}>
                  Continue
                </Button>
              </Stack>
            </Stack>
          )}
          {step === 'backup-mnemonic' && (
            <BackupMnemonic
              mnemonic={mnemonic}
              onSkip={() => onLockTheWallet()}
              onDecrypt={() => Promise.resolve()}
              onConfirm={() => onLockTheWallet()}
            />
          )}
        </form>
      </AuthCard>
    </>
  );
}
