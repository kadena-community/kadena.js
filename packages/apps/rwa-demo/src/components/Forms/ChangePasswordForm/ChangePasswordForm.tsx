import { PasswordField } from '@/components/PasswordField/PasswordField';
import { useUser } from '@/hooks/user';
import {
  Button,
  Notification,
  NotificationHeading,
  Stack,
  TextField,
} from '@kadena/kode-ui';
import { useNotifications } from '@kadena/kode-ui/patterns';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import type { FC } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export const ChangePasswordForm: FC = () => {
  const [isPending, setIsPending] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const { addNotification } = useNotifications();
  const { user } = useUser();

  const {
    handleSubmit,
    control,
    getValues,
    register,
    formState: { isValid, errors },
  } = useForm<{
    currentPassword: string;
    password: string;
    confirmation: string;
  }>({
    mode: 'all',
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmation: '',
    },
  });

  const handleReset = async (data: {
    currentPassword: string;
    password: string;
    confirmation: string;
  }) => {
    setIsPending(true);
    setIsSend(false);

    if (!user) return;

    const credential = await EmailAuthProvider.credential(
      user.email!,
      data.currentPassword,
    );

    reauthenticateWithCredential(user, credential)
      .then(() => updatePassword(user, data.password))
      .then(() => {
        console.log('Password updated!');
        setIsSend(true);
      })
      .catch((err) => {
        setIsPending(false);
        addNotification({
          intent: 'negative',
          message: err.message || 'Unknown error',
        });
      });
  };

  if (user?.providerData[0].providerId !== 'password') {
    return (
      <Stack flexDirection="column" gap="sm">
        <Notification role="status" intent="info">
          <NotificationHeading>Change Password</NotificationHeading>
          You can only change your password if you signed up with email and
          password. Your provider is {user?.providerData[0].providerId}
        </Notification>
      </Stack>
    );
  }

  return (
    <Stack flexDirection="column" gap="sm">
      {isSend ? (
        <Notification role="status" intent="info">
          <NotificationHeading>Password Changed</NotificationHeading>
          Your password has been successfully changed.
        </Notification>
      ) : (
        <form onSubmit={handleSubmit(handleReset)}>
          <Stack flexDirection="column" gap="sm" width="100%">
            <Stack marginBlockEnd="md">
              <Controller
                name="currentPassword"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'This field is required',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    type="password"
                    id="currentPassword"
                    isInvalid={!!errors.currentPassword?.message}
                    errorMessage={`${errors.currentPassword?.message}`}
                    label="Current Password"
                    {...field}
                  />
                )}
              />
            </Stack>
            <PasswordField
              value={getValues('password')}
              confirmationValue={getValues('confirmation')}
              register={register}
              isValid={isValid}
              errors={errors}
            />
            <Stack justifyContent={'flex-end'} alignItems="center" gap="sm">
              <Button isLoading={isPending} type="submit" isDisabled={!isValid}>
                Send Reset Email
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </Stack>
  );
};
