import { Button, Stack, TextField } from '@kadena/kode-ui';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PasswordField } from '../PasswordField/PasswordField';

interface IProps {
  setStep: (step: 'done') => void;
}

export const SetPasswordForm: FC<IProps> = ({ setStep }) => {
  const [isPending, setIsPending] = useState(false);
  const { addNotification } = useNotifications();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
    control,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmation: '',
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsPending(true);
    const result = await fetch('/api/set-password', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (result.status !== 200) {
      addNotification({
        intent: 'negative',
        label: 'Failed to set password',
        message: result.statusText || 'Unknown error',
      });

      return;
    }

    setIsPending(false);
    setStep('done');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack flexDirection="column" marginBlock="md" gap="sm">
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
        <PasswordField
          value={getValues('password')}
          confirmationValue={getValues('confirmation')}
          register={register}
          isValid={isValid}
          errors={errors}
        />
      </Stack>

      <Stack justifyContent={'flex-end'} gap="sm">
        <Button
          isLoading={isPending}
          isDisabled={!isValid}
          type="submit"
          onPress={() => {}}
        >
          Set password
        </Button>
      </Stack>
    </form>
  );
};
