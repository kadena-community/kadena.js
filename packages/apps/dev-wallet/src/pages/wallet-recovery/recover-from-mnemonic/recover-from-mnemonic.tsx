import { useGlobalState } from '@/App/providers/globalState';
import { displayContentsClass } from '@/Components/Sidebar/style.css';
import { config } from '@/config';
import { createKAccount } from '@/modules/account/account.service';
import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import {
  createCredential,
  extractPublicKeyHex,
  PublicKeyCredentialCreate,
} from '@/utils/webAuthn';
import {
  MonoRadioButtonChecked,
  MonoRadioButtonUnchecked,
} from '@kadena/kode-icons/system';
import {
  Button,
  Card,
  Heading,
  Stack,
  Text,
  TextField,
  Link as UiLink,
} from '@kadena/kode-ui';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { getFirstBip44Key, getFirstLegacyKey } from './utils';

type Inputs = {
  mnemonic: string;
  profileName: string;
  password: string;
  confirmation: string;
  fromChainweaver: boolean;
  accentColor: string;
  method: 'HD-BIP44' | 'HD-chainweaver';
};

export function RecoverFromMnemonic() {
  const { setOrigin } = useGlobalState();
  const [step, setStep] = useState<'import' | 'set-password' | 'select-method'>(
    'import',
  );
  const [bip44key, setBip44Key] = useState<string | null>(null);
  const [legacyKey, setLegacyKey] = useState<string | null>(null);
  const { profileList } = useWallet();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    control,
    formState: { isValid, errors, isSubmitting },
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

  useEffect(() => {
    const name = getValues('profileName');
    console.log('profileList', profileList, name);
    if (
      (!name || name === 'default') &&
      profileList &&
      profileList.length > 0
    ) {
      setValue('profileName', `profile-${profileList.length + 1}`);
    }
  }, [profileList, getValues, setValue]);

  const formRef = useRef<HTMLFormElement>(null);
  const [webAuthnCredential, setWebAuthnCredential] =
    useState<PublicKeyCredentialCreate>();
  const { createHDWallet } = useHDWallet();
  const [error, setError] = useState('');
  const { createProfile, unlockProfile, activeNetwork, createKey } =
    useWallet();
  const [importing, setImporting] = useState(false);

  async function importWallet({
    mnemonic,
    profileName,
    password,
    confirmation,
    accentColor,
    method,
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

    const keySource = await createHDWallet(profile.uuid, method, pass);
    const key = await createKey(keySource);
    await createKAccount({
      profileId: profile.uuid,
      networkUUID: activeNetwork.uuid,
      publicKey: key.publicKey,
      contract: 'coin',
      alias: 'Account 1',
    });

    setOrigin(`/account-discovery`);
    await unlockProfile(profile.uuid, pass, true);
  }

  async function createFirstKeys() {
    const mnemonic = getValues('mnemonic');
    await Promise.all([
      getFirstBip44Key(mnemonic).then(setBip44Key),
      getFirstLegacyKey(mnemonic).then(setLegacyKey),
    ]);
  }

  async function createWebAuthnCredential() {
    const result = await createCredential();
    if (result && result.credential) {
      // const pk = result.credential.response.getPublicKey();
      // setPublicKey(pk ? hex(new Uint8Array(extractPublicKeyBytes(pk))) : '');
      setWebAuthnCredential(result.credential);
      setValue('password', 'WEB_AUTHN_PROTECTED');
      setValue('confirmation', 'WEB_AUTHN_PROTECTED');
      await createFirstKeys();
      setStep('select-method');
    } else {
      console.error('Error creating credential');
    }
  }
  const profileName = watch('profileName');
  const method = watch('method');
  return (
    <Card>
      <Stack gap={'lg'} flexDirection={'column'} textAlign="left">
        <Stack></Stack>
        <form
          onSubmit={handleSubmit(async (data) => {
            setImporting(true);
            await importWallet(data);
            setImporting(false);
          })}
          className={displayContentsClass}
          ref={formRef}
        >
          {step === 'import' && (
            <Stack gap={'lg'} flexDirection={'column'}>
              <Stack>
                <UiLink
                  component={Link}
                  href="/wallet-recovery"
                  variant="outlined"
                  isCompact
                >
                  Back
                </UiLink>
              </Stack>
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
                </Stack>

                <TextField
                  label="Profile name"
                  id="name"
                  type="text"
                  defaultValue={profileName}
                  value={profileName}
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
                <Button
                  isDisabled={!isValid}
                  isLoading={importing}
                  loadingLabel="Importing"
                  onClick={async () => {
                    await createFirstKeys();
                    setStep('select-method');
                  }}
                >
                  Continue
                </Button>
              </Stack>
            </Stack>
          )}
          {step === 'select-method' && (
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
              <Heading variant="h4">Key Derivation</Heading>
              <Heading variant="h5">Which one is your account?</Heading>
              <Stack flexDirection={'column'} gap={'xs'}>
                <Controller
                  control={control}
                  name="method"
                  render={({ field }) => (
                    <Button
                      onClick={() => field.onChange('HD-chainweaver')}
                      variant={
                        field.value === 'HD-chainweaver' ? 'info' : 'outlined'
                      }
                    >
                      <Stack
                        gap={'sm'}
                        flexDirection={'column'}
                        justifyContent={'center'}
                        alignItems={'flex-start'}
                        textAlign="left"
                        paddingInline={'xs'}
                      >
                        <Stack gap={'sm'} alignItems={'center'}>
                          {field.value === 'HD-chainweaver' ? (
                            <MonoRadioButtonChecked color="inherit" />
                          ) : (
                            <MonoRadioButtonUnchecked color="inherit" />
                          )}
                          <Text color="inherit">
                            Chainweaver Legacy (v1/v2)
                          </Text>
                        </Stack>

                        <Text color="inherit" variant="code">
                          k:{shorten(legacyKey!, 14)}
                        </Text>
                      </Stack>
                    </Button>
                  )}
                />
                <Controller
                  control={control}
                  name="method"
                  render={({ field }) => (
                    <Button
                      onClick={() => field.onChange('HD-BIP44')}
                      variant={field.value === 'HD-BIP44' ? 'info' : 'outlined'}
                    >
                      <Stack
                        gap={'sm'}
                        flexDirection={'column'}
                        justifyContent={'center'}
                        alignItems={'flex-start'}
                        textAlign="left"
                        paddingInline={'xs'}
                      >
                        <Stack gap={'sm'} alignItems={'center'}>
                          {field.value === 'HD-BIP44' ? (
                            <MonoRadioButtonChecked color="inherit" />
                          ) : (
                            <MonoRadioButtonUnchecked color="inherit" />
                          )}
                          <Text color="inherit">
                            Chainweaver V3 and bip44 wallets
                          </Text>
                        </Stack>

                        <Text variant="code" color="inherit">
                          k:{shorten(bip44key!, 14)}
                        </Text>
                      </Stack>
                    </Button>
                  )}
                />
              </Stack>
              <Button
                type="submit"
                isLoading={isSubmitting}
                isDisabled={!method}
              >
                Confirm
              </Button>
            </Stack>
          )}
        </form>
        {error && <Text>{error}</Text>}
      </Stack>
    </Card>
  );
}
