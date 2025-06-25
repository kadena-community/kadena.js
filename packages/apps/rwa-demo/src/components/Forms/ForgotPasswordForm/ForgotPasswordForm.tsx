import { useOrganisation } from '@/hooks/organisation';
import {
  Button,
  Notification,
  NotificationHeading,
  Stack,
  TextField,
} from '@kadena/kode-ui';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export const ForgotPasswordForm: FC = () => {
  const [isPending, setIsPending] = useState(false);
  const { organisation } = useOrganisation();
  const [isSend, setIsSend] = useState(false);
  const { addNotification } = useNotifications();
  const {
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm<{ email: string }>({
    mode: 'all',
    defaultValues: {
      email: '',
    },
  });

  const handleSend = async (data: { email: string }) => {
    setIsPending(true);
    setIsSend(false);
    const result = await fetch('/api/reset-password-send', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        organisationId: organisation?.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    addNotification({
      intent: result.status === 200 ? 'positive' : 'negative',
      message: result.statusText || 'Unknown error',
    });

    setIsPending(false);

    if (result.status === 200) {
      setIsSend(true);
    }
  };

  return (
    <Stack flexDirection="column" gap="sm">
      {isSend ? (
        <Notification role="status" intent="info">
          <NotificationHeading>Email Sent</NotificationHeading>
          Please check your email for further instructions
        </Notification>
      ) : (
        <form onSubmit={handleSubmit(handleSend)}>
          <Stack flexDirection="column" gap="sm">
            <Controller
              name="email"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'This field is required',
                },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              }}
              render={({ field }) => (
                <TextField
                  id="email"
                  isInvalid={!!errors.email?.message}
                  errorMessage={`${errors.email?.message}`}
                  label="Email"
                  {...field}
                />
              )}
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
