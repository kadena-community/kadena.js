import { AuthCard } from '@/Components/AuthCard/AuthCard.tsx';
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
    formState: { errors },
  } = useForm<{
    password: string;
    profileName: string;
    confirmation: string;
  }>();
  const { createProfile, isUnlocked, createKey, createKAccount } = useWallet();
  const { activeNetwork } = useNetwork();
  const [createdKeySource, setCreatedKeySource] = useState<IKeySource>();
  const { createHDWallet } = useHDWallet();

  async function create({
    profileName,
    password,
  }: {
    profileName?: string;
    password: string;
  }) {
    if (!activeNetwork) {
      return;
    }
    const mnemonic = kadenaGenMnemonic();
    const profile = await createProfile(profileName || 'default', password);
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
      <AuthCard>
        <Heading variant="h4">Choose a password</Heading>
        <Text>
          Carefully select your password as this will be your main security of
          your wallet
        </Text>

        <form onSubmit={handleSubmit(create)}>
          <Stack flexDirection="column" marginBlock="md" gap="sm">
            {/* TODO: Use for several accounts */}
            {/*<TextField*/}
            {/*  id="profileName"*/}
            {/*  type="text"*/}
            {/*  label="Profile name"*/}
            {/*  {...register('profileName')}*/}
            {/*  className={inputClass}*/}
            {/*/>*/}
            <TextField
              id="password"
              type="password"
              label="Password"
              {...register('password')}
            />
            <TextField
              id="confirmation"
              type="password"
              label="Confirm password"
              {...register('confirmation', {
                validate: (value) => {
                  return (
                    getValues('password') === value || 'Passwords do not match'
                  );
                },
              })}
            />
            <Text>{errors.confirmation && errors.confirmation.message}</Text>
          </Stack>
          <Stack flexDirection="column">
            <Button type="submit">Continue</Button>
          </Stack>
        </form>
      </AuthCard>
    </>
  );
}
