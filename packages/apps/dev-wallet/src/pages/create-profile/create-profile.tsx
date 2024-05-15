import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet.hook';
import { useNetwork } from '@/modules/network/network.hook';
import { IKeySource } from '@/modules/wallet/wallet.repository';
import {
  authCard,
  backBtnClass,
  buttonClass,
  iconStyle,
  inputClass,
} from '@/pages/create-profile/create-profile.css.ts';
import { kadenaGenMnemonic } from '@kadena/hd-wallet';
import { MonoArrowBackIosNew } from '@kadena/react-icons';
import { Box, Button, Heading, Stack, Text, TextField } from '@kadena/react-ui';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { useWallet } from '../../modules/wallet/wallet.hook';

export function CreateProfile() {
  const { register, handleSubmit } = useForm<{
    password: string;
    profileName: string;
    confirmation: string;
  }>();
  const { createProfile, isUnlocked, createKey, createKAccount } = useWallet();
  const { activeNetwork } = useNetwork();
  const [createdKeySource, setCreatedKeySource] = useState<IKeySource>();
  const { createHDWallet } = useHDWallet();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmationRef = useRef<HTMLInputElement>(null);
  const validate = (value: string) => {
    if (
      value.length < 16 ||
      passwordRef.current?.value !== passwordConfirmationRef.current?.value
    ) {
      setIsSubmitDisabled(true);
      return;
    }

    setIsSubmitDisabled(false);
  };

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
              minLength={16}
              onValueChange={validate}
              {...register('password')}
              className={inputClass}
              isRequired
              ref={passwordRef}
            />
            <TextField
              id="confirmation"
              type="password"
              label="Confirmation password"
              minLength={16}
              {...register('confirmation')}
              onValueChange={validate}
              className={inputClass}
              isRequired
              ref={passwordConfirmationRef}
            />
          </Stack>
          <Stack flexDirection="column">
            <Button
              type="submit"
              className={buttonClass}
              isDisabled={isSubmitDisabled}
            >
              Continue
            </Button>
          </Stack>
        </form>
      </Box>
    </>
  );
}
