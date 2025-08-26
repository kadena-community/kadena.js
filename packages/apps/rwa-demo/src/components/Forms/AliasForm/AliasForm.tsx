import { AccountNameField } from '@/components/Fields/AccountNameField';
import { useUser } from '@/hooks/user';
import { Button, Notification, Stack, TextField } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';

export const AliasForm: FC<{ accountName: string; onDone: () => void }> = ({
  accountName,
  onDone,
}) => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { userStore, findAliasByAddress } = useUser();

  const {
    handleSubmit,
    control,
    reset,
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

  useEffect(() => {
    const displayName = findAliasByAddress(accountName);
    reset({
      alias: displayName,
      accountName: accountName,
    });
  }, [accountName, reset]);

  const onSubmit = async (data: { accountName: string; alias: string }) => {
    setIsPending(true);

    onDone();
    await userStore.addAccountAlias(data.accountName, data.alias);

    setIsSuccess(true);
    flushSync(() => {
      setIsPending(false);
    });
  };

  return (
    <Stack flexDirection="column" gap="sm" width="100%">
      {isSuccess ? (
        <Notification role="status">
          Alias has been set successfully.
        </Notification>
      ) : (
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
      )}
    </Stack>
  );
};
