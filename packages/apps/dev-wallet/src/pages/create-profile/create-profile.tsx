import { AuthCard } from '@/Components/AuthCard/AuthCard.tsx';
import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet';
import { LayoutContext } from '@/modules/layout/layout.provider';
import { useNetwork } from '@/modules/network/network.hook';
import {
  PublicKeyCredentialCreate,
  createCredential,
  extractPublicKeyHex,
} from '@/utils/webAuthn';
import { kadenaGenMnemonic } from '@kadena/hd-wallet';
import { MonoCheck } from '@kadena/react-icons/system';
import { Button, Heading, Stack, Text, TextField } from '@kadena/react-ui';
import { useContext, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useWallet } from '../../modules/wallet/wallet.hook';
import { colorOptionClass, listClass } from './styles.css';

const colorList = ['#42CEA4', '#42BDCE', '#4269CE', '#B242CE', '#CEA742'];

export function CreateProfile() {
  const {
    createProfile,
    createKey,
    createKAccount,
    profileList,
    unlockProfile,
  } = useWallet();
  const { createHDWallet } = useHDWallet();
  const isShortFlow = profileList.length === 0;
  const formRef = useRef<HTMLFormElement>(null);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
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
  const { setLayoutContext } = useContext(LayoutContext);
  const [webAuthnCredential, setWebAuthnCredential] =
    useState<PublicKeyCredentialCreate>();

  async function create({
    profileName,
    password,
    accentColor,
  }: {
    profileName?: string;
    password: string;
    accentColor?: string;
  }) {
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
    }
    const mnemonic = kadenaGenMnemonic();
    const profile = await createProfile(
      profileName,
      pass,
      accentColor,
      webAuthnCredential
        ? {
            authMode: 'WEB_AUTHN',
            webAuthnCredential: webAuthnCredential.rawId,
          }
        : {
            authMode: 'PASSWORD',
          },
    );
    // for now we only support slip10 so we just create the keySource and the first account by default for it
    // later we should change this flow to be more flexible
    const keySource = await createHDWallet(
      profile.uuid,
      'HD-BIP44',
      pass,
      mnemonic,
    );

    const key = await createKey(keySource);

    await createKAccount(profile.uuid, activeNetwork.networkId, key.publicKey);
    // everything is created, now we can unlock the profile
    await unlockProfile(profile.uuid, pass);
  }

  async function createWebAuthnCredential() {
    const result = await createCredential();
    if (result && result.credential) {
      // const pk = result.credential.response.getPublicKey();
      // setPublicKey(pk ? hex(new Uint8Array(extractPublicKeyBytes(pk))) : '');
      setWebAuthnCredential(result.credential);
      setValue('password', 'WEB_AUTHN_PROTECTED');
      setValue('confirmation', 'WEB_AUTHN_PROTECTED');
      if (!isShortFlow) {
        navigate('personalize-profile');
      } else {
        setTimeout(() => {
          formRef.current?.requestSubmit();
        }, 200);
      }
    } else {
      console.error('Error creating credential');
    }
  }

  return (
    <>
      <AuthCard>
        <form onSubmit={handleSubmit(create)} ref={formRef}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Heading variant="h4">How would you like to login</Heading>
                  <Stack
                    marginBlockStart="sm"
                    flexDirection={'column'}
                    gap={'lg'}
                  >
                    <Text>
                      Your system supports <Text bold>WebAuthn</Text> so you can
                      create a more secure and more convenient password-less
                      profile!
                    </Text>
                  </Stack>
                  <Stack flexDirection="row" gap={'sm'} marginBlockStart={'lg'}>
                    <Button
                      type="button"
                      variant="transparent"
                      onClick={() => navigate('set-password')}
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
                </>
              }
            ></Route>
            {!webAuthnCredential && (
              <Route
                path="/set-password"
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
            )}

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
                                onClick={() => {
                                  setLayoutContext({ accentColor: color });
                                  onChange(color);
                                }}
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
