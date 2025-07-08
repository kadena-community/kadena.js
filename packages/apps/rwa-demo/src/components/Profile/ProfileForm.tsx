import { useUser } from '@/hooks/user';
import { Button, Stack, TextField } from '@kadena/kode-ui';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export const ProfileForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { userStore, userData, user } = useUser();

  const { addNotification } = useNotifications();

  const onSubmit = async (data: { displayName: string }) => {
    setIsLoading(true);
    if (!userStore || !userData || !user) {
      addNotification({
        intent: 'negative',
        label: 'usertoken not set',
      });
      return;
    }
    await userStore.changeProfile(user.uid, {
      ...userData.data,
      displayName: data.displayName,
    });

    setIsLoading(false);
  };

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid, errors },
  } = useForm<{ displayName: string }>({
    mode: 'all',
    defaultValues: {
      displayName: userData?.data?.displayName ?? '',
    },
  });

  useEffect(() => {
    reset({
      displayName: userData?.data?.displayName ?? '',
    });
  }, [userData?.data?.displayName]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
      <Stack flexDirection="column" marginBlock="md" gap="sm" width="100%">
        <Controller
          name="displayName"
          control={control}
          rules={{
            required: {
              value: true,
              message: 'This field is required',
            },
            minLength: {
              value: 3,
              message: 'The min length is 3 characters',
            },
            maxLength: {
              value: 25,
              message: 'The max length is 40 characters',
            },
          }}
          render={({ field }) => (
            <TextField
              id="displayName"
              maxLength={25}
              defaultValue={field.value}
              isInvalid={!!errors.displayName?.message}
              errorMessage={`${errors.displayName?.message}`}
              label="Display name"
              {...field}
            />
          )}
        />

        <Stack width="100%" justifyContent="flex-end">
          <Button
            isLoading={isLoading}
            type="submit"
            isDisabled={!isValid || isLoading}
            onClick={() => {}}
          >
            Edit profile
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
