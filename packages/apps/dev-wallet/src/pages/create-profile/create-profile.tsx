import { AuthCard } from '@/Components/AuthCard/AuthCard.tsx';
import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet.hook';
import { useNetwork } from '@/modules/network/network.hook';
import { IKeySource } from '@/modules/wallet/wallet.repository';
import { kadenaGenMnemonic } from '@kadena/hd-wallet';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Stepper } from '@/Components/stepper/Stepper';
import { PROFILE_COLOR_LIST } from '@/constants/color-list';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useWallet } from '../../modules/wallet/wallet.hook';
import { Password } from './components/password';
import { PersonalizeProfileCreation } from './components/personalize-profile-creation';

export function CreateProfile() {
  const { createProfile, isUnlocked, createKey, createKAccount, profileList } =
    useWallet();
  const isShortFlow = profileList.length === 0;

  const formMethods = useForm<{
    password: string;
    confirmation: string;
    profileName: string;
    accentColor: string;
  }>({
    mode: 'all',
    defaultValues: {
      password: '',
      confirmation: '',
      profileName: isShortFlow ? 'default' : '',
      accentColor: PROFILE_COLOR_LIST[0],
    },
  });

  const { activeNetwork } = useNetwork();
  const [createdKeySource, setCreatedKeySource] = useState<IKeySource>();
  const { createHDWallet } = useHDWallet();

  async function create({
    profileName,
    password,
    accentColor,
  }: {
    profileName?: string;
    password: string;
    accentColor?: string;
  }) {
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

  const steps = [
    {
      id: 'password',
      route: '/',
      title: 'Profile setup',
      elements: <Password isShortFlow={isShortFlow} />,
    },
    {
      id: 'personalize-profile',
      route: 'personalize-profile',
      elements: <PersonalizeProfileCreation />,
    },
  ];
  return (
    <>
      <AuthCard>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(create)}>
            <Stepper steps={steps} />
          </form>
        </FormProvider>
      </AuthCard>
    </>
  );
}
