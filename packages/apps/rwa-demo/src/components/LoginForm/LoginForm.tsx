import { useUser } from '@/hooks/user';
import { Button, Divider, Stack, TextField } from '@kadena/kode-ui';
import { token } from '@kadena/kode-ui/styles';
import { useRouter } from 'next/navigation';

import type { FC } from 'react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

export const LoginForm: FC = () => {
  const { signInByGoogle, signInByEmail, userToken } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (userToken) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/');
    }
  }, [userToken]);

  const {
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm<{ email: string; password: string }>({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Stack flexDirection="column" gap="sm">
      <form onSubmit={handleSubmit(signInByEmail)}>
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
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Simple email regex
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
          <Controller
            name="password"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'This field is required',
              },
            }}
            render={({ field }) => (
              <TextField
                id="password"
                type="password"
                isInvalid={!!errors.email?.message}
                errorMessage={`${errors.email?.message}`}
                label="Password"
                {...field}
              />
            )}
          />
          <Stack justifyContent={'flex-end'} gap="sm">
            <Button isDisabled={!isValid} type="submit">
              Sign in
            </Button>
          </Stack>
        </Stack>
      </form>
      <Divider label="or" bgColor={token('color.background.layer.default')} />
      <Button onPress={signInByGoogle}>sign in with google account</Button>
    </Stack>
  );
};
