import { AuthCard } from '@/Components/AuthCard/AuthCard';
import { displayContentsClass } from '@/Components/Sidebar/style.css';
import { config } from '@/config';
import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet';
import { useWallet } from '@/modules/wallet/wallet.hook';
import {
  createCredential,
  extractPublicKeyHex,
  PublicKeyCredentialCreate,
} from '@/utils/webAuthn';
import {
  Box,
  Button,
  Checkbox,
  Heading,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { noStyleLinkClass } from '../../home/style.css';

type Inputs = {
  mnemonic: string;
  profileName: string;
  password: string;
  confirmation: string;
  fromChainweaver: boolean;
  accentColor: string;
};

export function RecoverFromMnemonic({
  setOrigin,
}: {
  setOrigin: (pathname: string) => void;
}) {
  const [step, setStep] = useState<'import' | 'set-password'>('import');
  const { profileList } = useWallet();
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { isValid, errors },
  } = useForm<Inputs>({
    defaultValues: {
      mnemonic: '',
      profileName:
        profileList.length === 0
          ? 'default'
          : `profile-${profileList.length + 1}`,
      accentColor:
        config.colorList[profileList.length % config.colorList.length],
      password: '',
      fromChainweaver: false,
    },
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [webAuthnCredential, setWebAuthnCredential] =
    useState<PublicKeyCredentialCreate>();
  const { createHDWallet } = useHDWallet();
  const [error, setError] = useState('');
  const { createProfile, unlockProfile, activeNetwork } = useWallet();

  async function importWallet({
    mnemonic,
    profileName,
    password,
    confirmation,
    accentColor,
    fromChainweaver,
  }: Inputs) {
    const is12Words = mnemonic.trim().split(' ').length === 12;
    if (!is12Words) {
      setError('enter 12 words');
      return;
    }
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
    } else if (pass !== confirmation) {
      setError('passwords do not match');
      return;
    }
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
    const keySource = await createHDWallet(
      profile.uuid,
      fromChainweaver ? 'HD-chainweaver' : 'HD-BIP44',
      pass,
    );

    setOrigin(`/account-discovery/${keySource.uuid}`);

    await unlockProfile(profile.uuid, pass);

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
  return (
    <AuthCard>
      <Stack gap={'lg'} flexDirection={'column'}>
        <Stack>
          <Link to="/wallet-recovery" className={noStyleLinkClass}>
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
        <form
          onSubmit={handleSubmit(importWallet)}
          className={displayContentsClass}
          ref={formRef}
        >
          {step === 'import' && (
            <Stack gap={'lg'} flexDirection={'column'}>
              <Heading variant="h5">Import mnemonic</Heading>
              <Stack flexDirection="column" gap={'lg'}>
                <Stack flexDirection={'column'} gap={'sm'}>
                  <Text color="emphasize">
                    Enter the 12 word recovery phrase
                  </Text>
                  <TextField
                    type="text"
                    id="phrase"
                    {...register('mnemonic')}
                  />
                  <Box>
                    <Controller
                      name="fromChainweaver"
                      control={control}
                      render={({ field }) => {
                        return (
                          <Checkbox
                            isSelected={field.value}
                            onChange={field.onChange}
                          >
                            Generated by Chainweaver v1/v2
                          </Checkbox>
                        );
                      }}
                    ></Controller>
                  </Box>
                </Stack>

                <TextField
                  label="Profile name"
                  id="name"
                  type="text"
                  defaultValue={getValues('profileName')}
                  {...register('profileName')}
                />
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
                    setStep('import');
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
        </form>
        {error && <Text>{error}</Text>}
      </Stack>
    </AuthCard>
  );
}
