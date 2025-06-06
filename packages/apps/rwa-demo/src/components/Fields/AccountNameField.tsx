import { useAsset } from '@/hooks/asset';
import { useNetwork } from '@/hooks/networks';
import type { IAddAgentProps } from '@/services/addAgent';
import type { IRetrievedAccount } from '@/services/discoverAccount';
import { discoverAccount } from '@/services/discoverAccount';
import { Notification, Stack, TextField } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { Control, FieldErrors, UseFormSetError } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { DiscoveredAccount } from '../DiscoveredAccount/DiscoveredAccount';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';

interface IProps {
  error?: FieldErrors['accountName'];
  accountName?: string;
  control: Control<any, any>;
  value?: string;
  setError?: UseFormSetError<IAddAgentProps>;
}

export const AccountNameField: FC<IProps> = ({
  error,
  accountName,
  control,
  value,
  setError,
}) => {
  const [discoveredAccount, setDiscoveredAccounts] = useState<
    IRetrievedAccount | undefined
  >(undefined);
  const { activeNetwork } = useNetwork();
  const [isPending, setIsPending] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { asset } = useAsset();

  const debounced = useDebouncedCallback(async (value, network) => {
    if (!value.startsWith('k:') || value.length !== 66) return;
    setIsPending(true);

    const [res] = await discoverAccount(value, network);

    setDiscoveredAccounts(res);
    setIsPending(false);

    if (!res) {
      setNotFound(true);
      if (setError) {
        setError('accountName', {
          type: 'manual',
          message: 'The account you entered does not exist on the network.',
        });
      }
    }
  }, 300);

  useEffect(() => {
    setDiscoveredAccounts(undefined);
    setNotFound(false);
    console.log(12312123123, value, activeNetwork);
    if ((!value && !accountName) || !activeNetwork) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const checkValue = value ? value : accountName ?? '';
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
            endAddon={isPending ? ((<TransactionPendingIcon />) as any) : null}
          />
        )}
      />
      {notFound && !error?.message && !!value?.length && (
        <Notification intent="negative" role="status" type="inlineStacked">
          The account you entered does not exist on the network.
        </Notification>
      )}
      {discoveredAccount && (
        <DiscoveredAccount account={discoveredAccount} asset={asset} />
      )}
    </Stack>
  );
};
