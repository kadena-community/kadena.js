import { useUser } from '@/hooks/user';
import { Button, Stack, TextField } from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
  useNotifications,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export const Profile: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, userToken, userStore } = useUser();

  const { addNotification } = useNotifications();

  const onSubmit = async (data: { displayName: string }) => {
    setIsLoading(true);
    if (!userToken || !userStore) {
      addNotification({
        intent: 'negative',
        label: 'usertoken not set',
      });
      return;
    }
    const result = await userStore.changeProfile({
      displayName: data.displayName,
      token: userToken,
    });

    if (result.status !== 200) {
      addNotification({
        intent: 'negative',
        label: 'profile not changed',
        message: result.statusText,
      });
    }

    setIsLoading(false);
  };

  const {
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm<{ displayName: string }>({
    mode: 'all',
    defaultValues: {
      displayName: user?.displayName ?? '',
    },
  });

  return (
    <SectionCard stack="vertical">
      <SectionCardContentBlock>
        <SectionCardHeader title="Profile" />
        <SectionCardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="displayName"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'This field is required',
                },
                maxLength: {
                  value: 40,
                  message: 'The max length is 40 characters',
                },
              }}
              render={({ field }) => (
                <TextField
                  id="displayName"
                  defaultValue={field.value}
                  isInvalid={!!errors.displayName?.message}
                  errorMessage={`${errors.displayName?.message}`}
                  label="displayName"
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
                Edit name
              </Button>
            </Stack>
          </form>
        </SectionCardBody>
      </SectionCardContentBlock>
    </SectionCard>
  );
};
