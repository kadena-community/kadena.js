import { AuthCard } from '@/Components/AuthCard/AuthCard';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { walletRepository } from '@/modules/wallet/wallet.repository';
import { changePassword } from '@/modules/wallet/wallet.service';
import { useTheCorrectNavigate } from '@/utils/useTheCorrectNavigate';
import { createCredential, extractPublicKeyHex } from '@/utils/webAuthn';
import {
  Button,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
  TextField,
  Link as UiLink,
} from '@kadena/kode-ui';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

interface ChangePasswordForm {
  password: string;
  confirmation: string;
  authMode: 'PASSWORD' | 'WEB_AUTHN';
}

export function ChangePassword() {
  const [currenPassword, setCurrentPassword] = useState('');
  const { askForPassword, profile } = useWallet();
  const navigate = useTheCorrectNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
    control,
    watch,
  } = useForm<ChangePasswordForm>({
    mode: 'all',
    defaultValues: {
      authMode: 'WEB_AUTHN',
      password: '',
      confirmation: '',
    },
  });

  const setWebAuthnPassword = async () => {
    if (!profile) return;
    if (authMode !== 'WEB_AUTHN') return;
    const result = await createCredential();
    if (!result || !result.credential) return;
    setIsLoading(true);
    const webAuthnCredential = result.credential;
    const pk = webAuthnCredential.response.getPublicKey();
    if (!pk) {
      throw new Error('Public key not found');
    }
    const newPassword = extractPublicKeyHex(pk);
    await changePassword(profile.uuid, currenPassword, newPassword);
    await walletRepository.updateProfile({
      ...profile!,
      options: {
        authMode: 'WEB_AUTHN',
        webAuthnCredential: webAuthnCredential.rawId,
        rememberPassword: profile.options.rememberPassword || 'session',
      },
    });
    setIsLoading(false);
    navigate('/settings');
  };

  const onSubmitPassword = async ({
    password,
    confirmation,
    authMode,
  }: ChangePasswordForm) => {
    if (!profile) return;
    if (authMode !== 'PASSWORD') return;
    if (password !== confirmation) return;
    setIsLoading(true);
    await changePassword(profile.uuid, currenPassword, password);
    await walletRepository.updateProfile({
      ...profile!,
      options: {
        authMode: 'PASSWORD',
        rememberPassword: profile.options.rememberPassword || 'session',
      },
    });
    setIsLoading(false);
    navigate('/settings');
  };

  const authMode = watch('authMode');

  return (
    <AuthCard>
      <Stack flexDirection={'column'} gap={'lg'}>
        <Stack>
          <UiLink
            variant="outlined"
            component={Link}
            isCompact
            type="button"
            href="/settings"
          >
            Back
          </UiLink>
        </Stack>
        {!currenPassword ? (
          <Stack
            flexDirection={'column'}
            alignItems={'flex-start'}
            textAlign="left"
          >
            <Heading variant="h4">Confirm Password</Heading>
            <Text>
              Please confirm your current password to proceed with changing your
              password
            </Text>
            <Stack marginBlockStart="sm">
              <Button
                onPress={async () => {
                  const pass = await askForPassword(true, {
                    storePassword: false,
                  });
                  if (pass) {
                    setCurrentPassword(pass);
                  }
                }}
              >
                Confirm
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Stack
            flexDirection={'column'}
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            textAlign="left"
            gap={'lg'}
          >
            <Heading variant="h4">Choose Authentication Mode</Heading>
            <Controller
              control={control}
              name="authMode"
              render={({ field }) => (
                <RadioGroup
                  direction="column"
                  defaultValue={field.value}
                  onChange={(val) => field.onChange(val)}
                >
                  <Radio value="WEB_AUTHN">Web-Authn</Radio>
                  <Radio value="PASSWORD">Password</Radio>
                </RadioGroup>
              )}
            ></Controller>
            {authMode === 'WEB_AUTHN' && (
              <Stack
                flexDirection={'column'}
                justifyContent={'flex-start'}
                gap={'sm'}
              >
                <Heading variant="h4">Use Web-Authn</Heading>
                <Text>
                  You can use web-authn for tacking care of your profile
                  authentication
                </Text>

                <Button
                  type="submit"
                  onClick={() => setWebAuthnPassword()}
                  isLoading={isLoading}
                >
                  {profile?.options.authMode === 'WEB_AUTHN'
                    ? 'Switch Credentials'
                    : 'Password-less'}
                </Button>
              </Stack>
            )}
            {authMode === 'PASSWORD' && (
              <form
                style={{ display: 'contents' }}
                onSubmit={handleSubmit(onSubmitPassword)}
              >
                <Stack flexDirection="column" marginBlock="md" gap="sm">
                  <Heading variant="h4">Use Password</Heading>
                  <Stack marginBlockStart="sm">
                    <Text>
                      Carefully select your password as this will be your main
                      security of your wallet
                    </Text>
                  </Stack>
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
                  <Stack flexDirection="column">
                    <Button
                      type="submit"
                      isDisabled={!isValid}
                      isLoading={isLoading}
                    >
                      Set Password
                    </Button>
                  </Stack>
                </Stack>
              </form>
            )}
          </Stack>
        )}
      </Stack>
    </AuthCard>
  );
}
