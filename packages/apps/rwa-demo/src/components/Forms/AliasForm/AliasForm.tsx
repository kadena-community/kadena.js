import { AccountNameField } from '@/components/Fields/AccountNameField';
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

export const AliasForm: FC<{ accountName: string }> = ({ accountName }) => {
  const [isPending, setIsPending] = useState(false);

  const { user } = useUser();

  const {
    handleSubmit,
    control,

    formState: { isValid, errors },
  } = useForm<{
    alias: string;
    accountName: string;
  }>({
    mode: 'all',
    defaultValues: {
      alias: '',
      accountName: accountName,
    },
  });

  const onSubmit = async (data: { alias: string }) => {
    setIsPending(true);
  };

  return (
    <Stack flexDirection="column" gap="sm" width="100%">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack flexDirection="column" gap="md" width="100%">
          <AccountNameField control={control} accountName={accountName} />
          <Controller
            name="alias"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'This field is required',
              },
            }}
            render={({ field }) => (
              <TextField
                id="alias"
                isInvalid={!!errors.alias?.message}
                errorMessage={`${errors.alias?.message}`}
                label="Alias"
                {...field}
              />
            )}
          />

          <Stack justifyContent={'flex-end'} alignItems="center" gap="sm">
            <Button isLoading={isPending} type="submit" isDisabled={!isValid}>
              Set alias
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};
