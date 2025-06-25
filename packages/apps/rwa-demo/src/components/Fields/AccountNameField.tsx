import { useAsset } from '@/hooks/asset';
import { useNetwork } from '@/hooks/networks';
import type { IAddAgentProps } from '@/services/addAgent';
import { Stack, TextField } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { Control, FieldErrors, UseFormSetError } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { DiscoveredAccount } from '../DiscoveredAccount/DiscoveredAccount';

interface IProps {
  exemptAccounts?: string[];
  error?: FieldErrors['accountName'];
  accountName?: string;
  control: Control<any, any>;
  value?: string;
  setError?: UseFormSetError<IAddAgentProps>;
}

export const AccountNameField: FC<IProps> = ({
  exemptAccounts,
  error,
  accountName,
  control,
  value,
  setError,
}) => {
  const [discoveredAccount, setDiscoveredAccounts] = useState<
    string | undefined
  >(undefined);
  const { activeNetwork } = useNetwork();
  const { asset } = useAsset();

  const debounced = useDebouncedCallback(async (value, network) => {
    setDiscoveredAccounts(value);
  }, 300);

  useEffect(() => {
    setDiscoveredAccounts(undefined);
    if ((!value && !accountName) || !activeNetwork) return;
    const checkValue = value ? value : accountName ?? '';
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    debounced(checkValue, activeNetwork);
  }, [value, accountName, activeNetwork]);

  return (
    <Stack flexDirection="column" gap="xs" width="100%">
      <Controller
        name="accountName"
        control={control}
        rules={{
          required: true,
          maxLength: {
            value: 66,
            message: 'length needs to be 66 characters',
          },
          minLength: {
            value: 66,
            message: 'length needs to be 66 characters',
          },
          pattern: {
            value: /^[a-z]:[a-zA-Z0-9_.]+$/,
            message: 'Fill in a correct ..:account',
          },
          validate: (value: string) => {
            if (
              exemptAccounts?.filter((v) => v !== accountName).includes(value)
            ) {
              return 'This account already exists';
            }
            return true;
          },
        }}
        render={({ field }) => (
          <TextField
            placeholder="k:1234..."
            id="accountName"
            isInvalid={!!error?.message}
            errorMessage={`${error?.message}`}
            isDisabled={!!accountName}
            label="AccountName"
            {...field}
          />
        )}
      />

      {discoveredAccount && (
        <DiscoveredAccount
          accountAddress={discoveredAccount}
          asset={asset}
          setError={setError}
        />
      )}
    </Stack>
  );
};
