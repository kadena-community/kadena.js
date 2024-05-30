import { AuthCard } from '@/Components/AuthCard/AuthCard.tsx';
import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet.hook';
import { useNetwork } from '@/modules/network/network.hook';
import { IKeySource } from '@/modules/wallet/wallet.repository';
import { kadenaGenMnemonic } from '@kadena/hd-wallet';
import { MonoCheck } from '@kadena/react-icons/system';
import { Button, Heading, Stack, Text, TextField } from '@kadena/react-ui';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useWallet } from '../../modules/wallet/wallet.hook';
import { colorOptionClass, listClass } from './styles.css';

const colorList = ['#42CEA4', '#42BDCE', '#4269CE', '#B242CE', '#CEA742'];

export function CreateProfile() {
  const { createProfile, isUnlocked, createKey, createKAccount, profileList } =
    useWallet();
  const isShortFlow = profileList.length === 0;

  const {
    control,
    register,
    handleSubmit,
    getValues,
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
      profileName: isShortFlow ? 'default' : '',
      accentColor: colorList[0],
    },
  });

  const navigate = useNavigate();
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

  return (
    <>
      <AuthCard>
        <form onSubmit={handleSubmit(create)}>
          <Routes>
            <Route
              path="/"
              element={
                <>
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
                    {isShortFlow && (
                      <Button type="submit" isDisabled={!isValid}>
                        Continue
                      </Button>
                    )}
                    {!isShortFlow && (
                      <Button
                        type="button"
                        onClick={() => navigate('personalize-profile')}
                        isDisabled={Boolean(
                          errors.confirmation?.message ||
                            errors.password?.message ||
                            !getValues('password') ||
                            !getValues('confirmation'),
                        )}
                      >
                        Continue
                      </Button>
                    )}
                  </Stack>
                </>
              }
            />

            {!isShortFlow && (
              <Route
                path="personalize-profile"
                element={
                  <>
                    <Heading variant="h4">Personalize profile</Heading>
                    <Stack marginBlockStart="sm">
                      <Text>
                        The color will be a tool to visually differentiate your
                        profiles when in use
                      </Text>
                    </Stack>
                    <Stack flexDirection="column" marginBlock="md" gap="sm">
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
                    <Stack>
                      <Controller
                        control={control}
                        defaultValue={getValues('accentColor')}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                          <ul className={listClass}>
                            {colorList.map((color) => (
                              <li
                                key={color}
                                style={{ background: color }}
                                className={colorOptionClass}
                                onClick={() => onChange(color)}
                              >
                                {value === color && <MonoCheck />}
                              </li>
                            ))}
                          </ul>
                        )}
                        name="accentColor"
                      />
                    </Stack>
                    <Stack flexDirection="column">
                      <Button type="submit" isDisabled={!isValid}>
                        Continue
                      </Button>
                    </Stack>
                  </>
                }
              />
            )}
          </Routes>
        </form>
      </AuthCard>
    </>
  );
}
