import { AuthCard } from '@/Components/AuthCard/AuthCard.tsx';
import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet.hook.tsx';
import {
  defaultAccentColor,
  LayoutContext,
} from '@/modules/layout/layout.provider.tsx';
import { useNetwork } from '@/modules/network/network.hook.ts';
import { IKeySource } from '@/modules/wallet/wallet.repository.ts';
import {
  colorOptionClass,
  listClass,
} from '@/pages/personalize-profile/personalize-profile.css.ts';
import { kadenaGenMnemonic } from '@kadena/hd-wallet';
import { Button, Heading, Stack, Text, TextField } from '@kadena/react-ui';
import cn from 'classnames';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation } from 'react-router-dom';
import { useWallet } from '../../modules/wallet/wallet.hook';

export function PersonalizeProfile() {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<{
    profileName: string;
  }>({ mode: 'all' });
  const location = useLocation();
  const { password } = location.state;
  const { setLayoutContext } = useContext(LayoutContext);
  const colorList = ['#CEA742', '#42CEA4', '#42BDCE', '#4269CE', '#B242CE'];
  const { createProfile, isUnlocked, createKey, createKAccount } = useWallet();
  const { activeNetwork } = useNetwork();
  const [createdKeySource, setCreatedKeySource] = useState<IKeySource>();
  const { createHDWallet } = useHDWallet();
  const [activeColor, setActiveColor] = useState(defaultAccentColor);

  async function create({ profileName }: { profileName: string }) {
    if (!activeNetwork) {
      return;
    }
    const mnemonic = kadenaGenMnemonic();
    const profile = await createProfile(
      profileName || 'default',
      password,
      activeColor,
    );
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

  const handleChooseColor = (color: string) => {
    setActiveColor(color);
    setLayoutContext({ accentColor: color });
  };

  return (
    <>
      <AuthCard>
        <Heading variant="h4">Personalize profile</Heading>
        <Stack marginBlockStart="sm">
          <Text>
            The color will be a tool to visually differentiate your profiles
            when in use
          </Text>
        </Stack>

        <form onSubmit={handleSubmit(create)}>
          <Stack flexDirection="column" marginBlock="md" gap="sm">
            <TextField
              id="profileName"
              type="text"
              label="Profile name"
              {...register('profileName', {
                required: { value: true, message: 'This field is required' },
              })}
              isInvalid={!isValid && !!errors.profileName}
              errorMessage={errors.profileName && errors.profileName?.message}
            />
          </Stack>
          <Stack>
            <ul className={listClass}>
              {colorList.map((color) => (
                <li
                  key={color}
                  style={{ background: color }}
                  className={cn(
                    colorOptionClass,
                    activeColor === color && 'active',
                  )}
                  onClick={() => handleChooseColor(color)}
                ></li>
              ))}
            </ul>
          </Stack>
          <Stack flexDirection="column">
            <Button type="submit" isDisabled={!isValid}>
              Continue
            </Button>
          </Stack>
        </form>
      </AuthCard>
    </>
  );
}
