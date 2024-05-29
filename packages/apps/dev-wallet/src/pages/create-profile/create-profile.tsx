import { AuthCard } from '@/Components/AuthCard/AuthCard.tsx';
import { PersonalizeProfile } from '@/Components/PersonalizeProfile/PersonalizeProfile.tsx';
import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet.hook';
import { useNetwork } from '@/modules/network/network.hook';
import { IKeySource } from '@/modules/wallet/wallet.repository';
import { kadenaGenMnemonic } from '@kadena/hd-wallet';
import { Button, Heading, Stack, Text, TextField } from '@kadena/react-ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useWallet } from '../../modules/wallet/wallet.hook';

export function CreateProfile() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<{
    password: string;
    confirmation: string;
  }>({ mode: 'all' });
  const { createProfile, isUnlocked, createKey, createKAccount, profileList } =
    useWallet();
  const { activeNetwork } = useNetwork();
  const [createdKeySource, setCreatedKeySource] = useState<IKeySource>();
  const { createHDWallet } = useHDWallet();
  const [showPersonalizeProfile, setShowPersonalizeProfile] =
    useState<boolean>(false);

  async function create({
    profileName,
    password,
    accentColor,
  }: {
    profileName?: string;
    password: string;
    accentColor?: string;
  }) {
    if (profileList.length) {
      setShowPersonalizeProfile(true);
    }
    console.log(password, profileName, accentColor);
    if (!activeNetwork) {
      return;
    }
    const mnemonic = kadenaGenMnemonic();
    const profile = await createProfile(profileName, password, accentColor);
    // for now we only support slip10 so we just create the keySource and the first account by default for it
    // later we should change this flow to be more flexible
    const keySource = await createHDWallet(
      profile.uuid,
      'HD-BIP44',
      password,
      mnemonic,
    );

    const key = await createKey(keySource);

    await createKAccount(profile.uuid, activeNetwork.networkId, key.publicKey);
    console.log('wallet created');
    setCreatedKeySource(keySource);
  }

  if (isUnlocked && createdKeySource) {
    return (
      <Navigate
        to={`/backup-recovery-phrase/${createdKeySource.uuid}`}
        replace
      />
    );
  }

  return (
    <>
      <AuthCard backButtonLink="/select-profile">
        {showPersonalizeProfile ? (
          <PersonalizeProfile
            create={create}
            password={getValues('password')}
          ></PersonalizeProfile>
        ) : (
          <>
            <Heading variant="h4">Choose a password</Heading>
            <Stack marginBlockStart="sm">
              <Text>
                Carefully select your password as this will be your main
                security of your wallet
              </Text>
            </Stack>
            <form onSubmit={handleSubmit(create)}>
              <Stack flexDirection="column" marginBlock="md" gap="sm">
                <TextField
                  id="password"
                  type="password"
                  label="Password"
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
            </form>
          </>
        )}
      </AuthCard>
    </>
  );
}
