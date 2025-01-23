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
  Button,
  Card,
  Heading,
  Select,
  SelectItem,
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
  keyDerivation: 'HD-BIP44' | 'HD-chainweaver' | 'auto-detect';
};

export function RecoverFromMnemonic() {
  const { setOrigin } = useGlobalState();
  const [step, setStep] = useState<'import' | 'set-password'>('import');
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
      keyDerivation: 'auto-detect',
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
    keyDerivation: method,
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
    if (method === 'auto-detect') {
      await createHDWallet(profile.uuid, 'HD-chainweaver', pass);
      await createHDWallet(profile.uuid, 'HD-BIP44', pass);
    } else {
      const keySource = await createHDWallet(profile.uuid, method, pass);
      const key = await createKey(keySource);
      await createKAccount({
        profileId: profile.uuid,
        networkUUID: activeNetwork.uuid,
        publicKey: key.publicKey,
        contract: 'coin',
        alias: 'Account 1',
      });
    }

    setOrigin(`/account-discovery`);
    await unlockProfile(profile.uuid, pass, true);
  }

  async function createFirstKeys() {
    const mnemonic = getValues('mnemonic');
    if (!mnemonic || mnemonic.trim().split(' ').length < 12) {
      return;
    }
    await Promise.all([
      getFirstBip44Key(mnemonic).then(setBip44Key),
      getFirstLegacyKey(mnemonic).then(setLegacyKey),
    ]);
  }

  async function createWebAuthnCredential() {
    const result = await createCredential();
    if (result && result.credential) {
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
  const profileName = watch('profileName');
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
                  <Controller
                    control={control}
                    name="mnemonic"
                    rules={{
                      validate: (value) =>
                        value.trim().split(' ').length === 12,
                    }}
                    render={({ field }) => (
                      <TextField
                        type="text"
                        label="Enter the 12 word recovery phrase"
                        id="phrase"
                        value={field.value}
                        placeholder="e.g word1 word2 word3..."
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                        onBlur={() => {
                          createFirstKeys();
                        }}
                      />
                    )}
                  />
                </Stack>

                <Stack flexDirection={'column'} gap={'sm'}>
                  <Controller
                    control={control}
                    name="keyDerivation"
                    render={({ field }) => (
                      <Select
                        label="Key derivation method"
                        defaultSelectedKey={'auto-detect'}
                        onSelectionChange={(value) => field.onChange(value)}
                      >
                        <SelectItem
                          key={'auto-detect'}
                          textValue={'auto-detect'}
                        >
                          Auto Detect (Takes longer)
                        </SelectItem>
                        <SelectItem
                          key={'HD-chainweaver'}
                          textValue={'HD-chainweaver'}
                        >
                          {`Legacy (chainweaver v1/v2)${legacyKey ? ` - account 1 "k:${shorten(legacyKey, 6)}"` : ''}`}
                        </SelectItem>
                        <SelectItem key={'HD-BIP44'} textValue={'HD-BIP44'}>
                          {`BIP44 (chainweaver v3)${bip44key ? ` -  account 1 k:${shorten(bip44key, 6)}` : ''}`}
                        </SelectItem>
                      </Select>
                    )}
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
                  isDisabled={!isValid}
                  variant="transparent"
                  onClick={() => setStep('set-password')}
                >
                  Prefer password
                </Button>
                <Button
                  variant="primary"
                  isDisabled={!isValid}
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
                  type="submit"
                >
                  Continue
                </Button>
              </Stack>
            </Stack>
          )}
        </form>
        {error && <Text>{error}</Text>}
      </Stack>
    </Card>
  );
}
