import { CardContent } from '@/App/LayoutLandingPage/components/CardContent';
import { CardFooterContent } from '@/App/LayoutLandingPage/components/CardFooterContent';
import { ICardContentProps } from '@/App/LayoutLandingPage/components/CardLayoutProvider';
import { BackupMnemonic } from '@/Components/BackupMnemonic/BackupMnemonic';
import { PasswordField } from '@/Components/PasswordField/PasswordField';
import { config } from '@/config';
import { createKAccount } from '@/modules/account/account.service';
import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet';
import {
  PublicKeyCredentialCreate,
  createCredential,
  extractPublicKeyHex,
} from '@/utils/webAuthn';
import { kadenaGenMnemonic } from '@kadena/hd-wallet';
import {
  MonoArrowForward,
  MonoContacts,
  MonoFingerprint,
  MonoPalette,
  MonoPassword,
} from '@kadena/kode-icons/system';
import {
  Button,
  CompactStepper,
  Heading,
  ICompactStepperItemProps,
  Notification,
  NotificationHeading,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import {
  CardFooterGroup,
  FocussedLayoutHeaderContent,
} from '@kadena/kode-ui/patterns';
import React, {
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useWallet } from '../../modules/wallet/wallet.hook';
import { wrapperClass } from '../errors/styles.css';
import { noStyleLinkClass } from '../home/style.css';
import { ChooseColor } from '../select-profile/ChooseColor';
import { Label } from '../transaction/components/helpers';

const rotate = (max: number, start: number = 0) => {
  let index = start;
  return () => {
    index = (index + 1) % max;
    console.log('index', index);
    return index;
  };
};

type IStepKeys =
  | 'authMethod'
  | 'set-password'
  | 'backup-mnemonic'
  | 'confirm'
  | 'profile';
const steps: ICardContentProps[] = [
  {
    label: 'Auth method',
    id: 'authMethod',
    description: 'Select your prefered authentication method',
    visual: <MonoContacts width={40} height={40} />,
  },
  {
    label: 'Choose password',
    id: 'set-password',
    description:
      'Carefully select your password as this will be your main security of your wallet',
    visual: <MonoPassword width={40} height={40} />,
  },
  {
    label: 'Personalize Profile',
    id: 'profile',
    description:
      'The color will be a tool to visually differentiate your profiles when in use',
    visual: <MonoPalette width={40} height={40} />,
  },
  {
    label: 'Write your recovery phrase down',
    id: 'backup-mnemonic',
    description:
      'Make sure no one is watching you; consider some malware might take screenshot of your screen',
    visual: <MonoPassword width={40} height={40} />,
  },
] as const;

const VisualIcon: FC<{
  accentColor: string;
  visual?: ReactElement;
}> = ({ accentColor, visual }) => {
  if (!visual) return null;
  return React.cloneElement(visual, {
    ...visual.props,
    style: { color: accentColor },
  });
};

export function CreateProfile() {
  const {
    createProfile,
    createKey,
    profileList,
    unlockProfile,
    activeNetwork,
  } = useWallet();
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined,
  );
  const [step, setStep] = useState<IStepKeys>('authMethod');
  const [previousStep, setPreviousStep] = useState<IStepKeys>('authMethod');
  const { createHDWallet } = useHDWallet();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const isShortFlow = profileList.length === 0;
  const formRef = useRef<HTMLFormElement>(null);
  const rotateColor = useRef(
    rotate(config.colorList.length, profileList.length),
  );

  const defaultColor = useMemo(
    () => config.colorList[rotateColor.current()],
    [],
  );

  const handleSetStep = (key: IStepKeys) => {
    const prevStep = step;
    setStep(key);
    setPreviousStep(prevStep);
  };

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    watch,
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
      profileName: isShortFlow
        ? 'default'
        : `profile-${profileList.length + 1}`,
      accentColor: defaultColor,
    },
  });

  useEffect(() => {
    console.log('profileList', profileList);
    setValue(
      'profileName',
      profileList.length === 0
        ? 'default'
        : `profile-${profileList.length + 1}`,
    );
    rotateColor.current = rotate(config.colorList.length, profileList.length);
    setValue('accentColor', config.colorList[rotateColor.current()]);
  }, [profileList, setValue]);

  const [webAuthnCredential, setWebAuthnCredential] =
    useState<PublicKeyCredentialCreate>();

  async function create({
    profileName,
    password,
    accentColor,
  }: {
    profileName?: string;
    password: string;
    accentColor: string;
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
            rememberPassword: 'session',
          }
        : {
            authMode: 'PASSWORD',
            rememberPassword: 'session',
          },
      mnemonic,
    );

    setPasswordError(undefined);
    if (typeof profile === 'string') {
      setPasswordError(profile);
      return;
    }

    // for now we only support slip10 so we just create the keySource and the first account by default for it
    // later we should change this flow to be more flexible
    const keySource = await createHDWallet(profile.uuid, 'HD-BIP44', pass);

    const key = await createKey(keySource);

    await createKAccount({
      profileId: profile.uuid,
      networkUUID: activeNetwork.uuid,
      publicKey: key.publicKey,
      contract: 'coin',
      alias: 'Account 1',
    });

    setMnemonic(mnemonic);
    setProfileId(profile.uuid);
    setPassword(pass);
    handleSetStep('backup-mnemonic');

    // TODO: navigate to the backup recovery phrase page
  }

  async function createWebAuthnCredential() {
    const result = await createCredential();
    if (result && result.credential) {
      // const pk = result.credential.response.getPublicKey();
      // setPublicKey(pk ? hex(new Uint8Array(extractPublicKeyBytes(pk))) : '');
      setWebAuthnCredential(result.credential);
      setValue('password', 'WEB_AUTHN_PROTECTED');
      setValue('confirmation', 'WEB_AUTHN_PROTECTED');

      handleSetStep('profile');
    } else {
      console.error('Error creating credential');
    }
  }

  async function onLockTheWallet() {
    if (!profileId) {
      throw new Error('Profile id is not set');
    }
    await unlockProfile(profileId, password);
  }

  const accentColor = watch('accentColor');

  const getStepIdx = (key: IStepKeys): number => {
    return steps.findIndex((step) => step.id === key) ?? 0;
  };

  return (
    <>
      <CardContent
        {...steps[getStepIdx(step)]}
        visual={
          <VisualIcon
            accentColor={step === 'profile' ? accentColor : ''}
            visual={steps[getStepIdx(step)].visual}
          />
        }
        refreshDependencies={[accentColor]}
      />
      <FocussedLayoutHeaderContent>
        <CompactStepper
          stepIdx={getStepIdx(step)}
          steps={steps as ICompactStepperItemProps[]}
        />
      </FocussedLayoutHeaderContent>

      <form ref={formRef} onSubmit={handleSubmit(create)}>
        {step === 'authMethod' && (
          <>
            <Stack flexDirection={'column'} gap={'lg'} className={wrapperClass}>
              <Stack flexDirection={'column'}>
                <Heading as="h5">How would you like to login</Heading>
                <Text size="smallest">
                  Your system supports{' '}
                  <Text bold size="smallest">
                    WebAuthn
                  </Text>{' '}
                  so you can create a more secure and more convenient
                  password-less profile!
                </Text>
              </Stack>

              <Stack flexDirection={'column'}>
                <Heading as="h6">Classic method</Heading>
                <Text size="smallest">Prefer using a password instead.</Text>
              </Stack>
            </Stack>

            <CardFooterContent>
              <Stack width="100%">
                <Link to="/select-profile" className={noStyleLinkClass}>
                  <Button
                    variant="outlined"
                    type="button"
                    onPress={() => {
                      throw new Error('back');
                    }}
                  >
                    Back
                  </Button>
                </Link>
              </Stack>
              <CardFooterGroup>
                <Button
                  type="button"
                  variant="transparent"
                  onClick={() => handleSetStep('set-password')}
                >
                  Prefer password
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    createWebAuthnCredential();
                  }}
                  endVisual={<MonoFingerprint />}
                >
                  Password-less
                </Button>
              </CardFooterGroup>
            </CardFooterContent>
          </>
        )}
        {step === 'set-password' && (
          <>
            <Stack flexDirection={'column'} gap={'lg'} className={wrapperClass}>
              <PasswordField
                value={getValues('password')}
                confirmationValue={getValues('confirmation')}
                isValid={isValid}
                errors={errors}
                register={register}
              />
            </Stack>

            <CardFooterContent>
              <Stack width="100%">
                <Button
                  variant="outlined"
                  type="button"
                  onPress={() => {
                    handleSetStep('authMethod');
                  }}
                >
                  Back
                </Button>
              </Stack>
              <CardFooterGroup>
                <Button
                  onClick={() => {
                    setPasswordError(undefined);
                    handleSetStep('profile');
                  }}
                  isDisabled={!isValid}
                  endVisual={<MonoArrowForward />}
                >
                  Next
                </Button>
              </CardFooterGroup>
            </CardFooterContent>
          </>
        )}
        {step === 'backup-mnemonic' && (
          <BackupMnemonic
            mnemonic={mnemonic}
            onSkip={() => onLockTheWallet()}
            onDecrypt={() => Promise.resolve()}
            onConfirm={() => onLockTheWallet()}
          />
        )}
        {step === 'profile' && (
          <>
            <Stack flexDirection={'column'} gap={'lg'} className={wrapperClass}>
              <Stack flexDirection="column" gap="lg">
                <Controller
                  name="profileName"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'This field is required',
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Stack flexDirection={'column'} gap={'md'} marginBlock="md">
                      <Label bold>Name</Label>
                      <Stack gap="sm" flexDirection={'row'}>
                        <TextField
                          id="profileName"
                          type="text"
                          autoFocus
                          defaultValue={field.value}
                          value={field.value}
                          onChange={field.onChange}
                          key="profileName"
                          isInvalid={!isValid && !!error}
                          errorMessage={error && error.message}
                        />
                      </Stack>
                      <Stack flexDirection="column">
                        <Label bold>Color</Label>

                        <Stack gap="xs" flexWrap="wrap">
                          {config.colorList.map((color) => (
                            <ChooseColor
                              isActive={color === accentColor}
                              accentColor={color}
                              onClick={() => {
                                setValue('accentColor', color);
                              }}
                            />
                          ))}
                        </Stack>
                      </Stack>
                    </Stack>
                  )}
                />
              </Stack>

              {passwordError && (
                <Notification
                  type="inlineStacked"
                  role="alert"
                  intent="negative"
                >
                  <NotificationHeading>
                    Password backend error
                  </NotificationHeading>

                  {passwordError}
                </Notification>
              )}
            </Stack>

            <CardFooterContent>
              <Stack width="100%">
                <Button
                  variant="outlined"
                  type="button"
                  onPress={() => {
                    handleSetStep(previousStep);
                  }}
                >
                  Back
                </Button>
              </Stack>
              <CardFooterGroup>
                <Button
                  onClick={() => {
                    formRef.current?.requestSubmit();
                  }}
                  isDisabled={!isValid || !!passwordError}
                  endVisual={<MonoArrowForward />}
                >
                  Next
                </Button>
              </CardFooterGroup>
            </CardFooterContent>
          </>
        )}
      </form>
    </>
  );
}
