import { PasswordField } from '@/components/PasswordField/PasswordField';
import { useUser } from '@/hooks/user';
import {
  Button,
  Notification,
  NotificationHeading,
  Stack,
} from '@kadena/kode-ui';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const ResetPasswordForm: FC<{
  oobCode: string;
}> = ({ oobCode }) => {
  const { signOut } = useUser();
  const [isPending, setIsPending] = useState(false);
  const { addNotification } = useNotifications();
  const [isSend, setIsSend] = useState(false);
  const router = useRouter();
  const {
    handleSubmit,

    getValues,
    register,
    formState: { isValid, errors },
  } = useForm<{ password: string; confirmation: string }>({
    mode: 'all',
    defaultValues: {
      password: '',
      confirmation: '',
    },
  });

  const handleReset = async (data: { password: string }) => {
    setIsPending(true);
    setIsSend(false);
    const result = await fetch('/api/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        oobCode,
        password: data.password,
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
      signOut();

      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  return (
    <>
      {isSend ? (
        <>
          <Notification role="status" intent="info">
            <NotificationHeading>Password was reset</NotificationHeading>
          </Notification>
        </>
      ) : (
        <form onSubmit={handleSubmit(handleReset)}>
          <Stack flexDirection="column" gap="sm">
            <PasswordField
              value={getValues('password')}
              confirmationValue={getValues('confirmation')}
              register={register}
              isValid={isValid}
              errors={errors}
            />
            <Stack justifyContent={'flex-end'} alignItems="center" gap="sm">
              <Button isLoading={isPending} type="submit" isDisabled={!isValid}>
                Reset Password
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </>
  );
};
