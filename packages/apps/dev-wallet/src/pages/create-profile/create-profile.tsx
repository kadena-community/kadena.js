import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet.hook';
import { useNetwork } from '@/modules/network/network.hook';
import { IKeySource } from '@/modules/wallet/wallet.repository';
import {
  authCard,
  backBtnClass,
  iconStyle,
  inputClass,
} from '@/pages/create-profile/create-profile.css.ts';
import { kadenaGenMnemonic } from '@kadena/hd-wallet';
import { MonoArrowBackIosNew } from '@kadena/react-icons';
import { Box, Button, Heading, Stack, Text, TextField } from '@kadena/react-ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { useWallet } from '../../modules/wallet/wallet.hook';

export function CreateProfile() {
  const { register, handleSubmit } = useForm<{
    password: string;
    profileName: string;
  }>();
  const { createProfile, isUnlocked, createKey, createKAccount } = useWallet();
  const { activeNetwork } = useNetwork();
  const [createdKeySource, setCreatedKeySource] = useState<IKeySource>();
  const { createHDWallet } = useHDWallet();

  async function create({
    profileName,
    password,
  }: {
    profileName: string;
    password: string;
  }) {
    if (!activeNetwork) {
      return;
    }
    const mnemonic = kadenaGenMnemonic();
    const profile = await createProfile(profileName, password);
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
      <Box className={authCard}>
        <Link to="/select-profile" className={backBtnClass}>
          <Stack alignItems="center" gap="xs" paddingBlockEnd="md">
            <MonoArrowBackIosNew className={iconStyle} /> Back
          </Stack>
        </Link>

        <Heading variant="h4">Create wallet</Heading>
        <Text>
          Carefully select your password as this will be your main security of
          your wallet
        </Text>

        <form onSubmit={handleSubmit(create)}>
          <Stack flexDirection="column" marginBlock="md" gap="sm">
            <label htmlFor="profileName">Profile name</label>
            <TextField
              id="profileName"
              type="text"
              {...register('profileName')}
              className={inputClass}
            />
            <label htmlFor="password">Password</label>
            <TextField
              id="password"
              type="password"
              {...register('password')}
            />
          </Stack>
          <Stack flexDirection="column">
            <Button type="submit">Continue</Button>
          </Stack>
        </form>
      </Box>
    </>
  );
}
