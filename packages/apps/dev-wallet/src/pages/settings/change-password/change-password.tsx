import { CardContent } from '@/App/LayoutLandingPage/components/CardContent';
import { CardFooterContent } from '@/App/LayoutLandingPage/components/CardFooterContent';
import { PasswordField } from '@/Components/PasswordField/PasswordField';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { walletRepository } from '@/modules/wallet/wallet.repository';
import { changePassword } from '@/modules/wallet/wallet.service';
import { wrapperClass } from '@/pages/errors/styles.css';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { createCredential, extractPublicKeyHex } from '@/utils/webAuthn';
import { MonoFingerprint, MonoPassword } from '@kadena/kode-icons/system';
import {
  Button,
  Heading,
  Notification,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Link as UiLink,
} from '@kadena/kode-ui';
import { CardFooterGroup } from '@kadena/kode-ui/patterns';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

interface ChangePasswordForm {
  password: string;
  confirmation: string;
  authMode: 'PASSWORD' | 'WEB_AUTHN';
}

export function ChangePassword() {
  const formRef = useRef<HTMLFormElement>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState('');
  const { askForPassword, profile } = useWallet();
  const navigate = usePatchedNavigate();
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
    await changePassword(profile.uuid, currentPassword, newPassword);
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
    setError('');
    try {
      await changePassword(profile.uuid, currentPassword, password);
      await walletRepository.updateProfile({
        ...profile!,
        options: {
          authMode: 'PASSWORD',
          rememberPassword: profile.options.rememberPassword || 'session',
        },
      });
      setIsLoading(false);
      navigate('/settings');
    } catch (e) {
      setError(e as string);
      setIsLoading(false);
    }
  };

  const authMode = watch('authMode');

  console.log({ form: formRef });
  return !currentPassword ? (
    <>
      <CardContent
        label="Confirm Password"
        id="confirmpassword"
        description="Please confirm your current password to proceed with changing your
              password"
        visual={<MonoPassword width={40} height={40} />}
      />
      <CardFooterContent>
        <Stack width="100%">
          <UiLink
            variant="outlined"
            component={Link}
            type="button"
            href="/settings"
          >
            Back
          </UiLink>
        </Stack>
        <CardFooterGroup>
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
        </CardFooterGroup>
      </CardFooterContent>
    </>
  ) : (
    <form
      style={{ display: 'contents' }}
      ref={formRef}
      onSubmit={handleSubmit(onSubmitPassword)}
    >
      <>
        <CardContent
          label="Choose Authentication Mode"
          id="chooseauthmethod"
          description=""
          visual={<MonoPassword width={40} height={40} />}
        />
        <Stack
          flexDirection={'column'}
          alignItems={'flex-start'}
          justifyContent={'flex-start'}
          textAlign="left"
          gap={'lg'}
          className={wrapperClass}
        >
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
            </Stack>
          )}
          {authMode === 'PASSWORD' && (
            <Stack flexDirection="column" marginBlock="md" gap="sm">
              <Heading variant="h4">Use Password</Heading>
              <Stack marginBlockStart="sm">
                <Text>
                  Carefully select your password as this will be your main
                  security of your wallet
                </Text>
              </Stack>
              <PasswordField
                value={getValues('password')}
                confirmationValue={getValues('confirmation')}
                register={register}
                isValid={isValid}
                errors={errors}
              />

              {error && (
                <Notification role="alert" intent="negative">
                  <>{error.toString()}</>
                </Notification>
              )}
            </Stack>
          )}
        </Stack>

        <CardFooterContent>
          <Stack flex={1}>
            <UiLink
              variant="outlined"
              component={Link}
              type="button"
              href="/settings"
            >
              Back
            </UiLink>
          </Stack>

          <CardFooterGroup>
            {authMode === 'WEB_AUTHN' && (
              <Button
                onClick={() => {
                  formRef.current?.requestSubmit();
                  setWebAuthnPassword();
                }}
                isLoading={isLoading}
                endVisual={<MonoFingerprint />}
              >
                {profile?.options.authMode === 'WEB_AUTHN'
                  ? 'Switch Credentials'
                  : 'Password-less'}
              </Button>
            )}

            {authMode === 'PASSWORD' && (
              <Button
                onClick={() => {
                  formRef.current?.requestSubmit();
                }}
                isDisabled={!isValid}
                isLoading={isLoading}
              >
                Set Password
              </Button>
            )}
          </CardFooterGroup>
        </CardFooterContent>
      </>
    </form>
  );
}
