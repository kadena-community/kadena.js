import { ICommandResult } from '@kadena/chainweb-node-client';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Grid,
  Heading,
} from '@kadena/react-ui';

import { buttonContainerClass, containerClass } from './styles.css';

import {
  ChainSelect,
  FormStatus,
  FormStatusNotification,
} from '@/components/Global';
import AccountNameField, {
  NAME_VALIDATION,
} from '@/components/Global/AccountNameField';
import Routes from '@/constants/routes';
import { useToolbar } from '@/context/layout-context';
import { usePersistentChainID } from '@/hooks';
import { fundExistingAccount } from '@/services/faucet';
import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
  name: NAME_VALIDATION,
});

type FormData = z.infer<typeof schema>;

const AMOUNT_OF_COINS_FUNDED: number = 100;

const isCustomError = (error: unknown): error is ICommandResult => {
  return error !== null && typeof error === 'object' && 'result' in error;
};

interface IFundExistingAccountResponseBody {
  result: {
    status: string;
    error:
      | undefined
      | {
          message: string;
        };
  };
}

interface IFundExistingAccountResponse
  extends Record<string, IFundExistingAccountResponseBody> {}

const ExistingAccountFaucetPage: FC = () => {
  const { t } = useTranslation('common');

  const [chainID, onChainSelectChange] = usePersistentChainID();

  const [requestStatus, setRequestStatus] = useState<{
    status: FormStatus;
    message?: string;
  }>({ status: 'idle' });

  useToolbar([
    {
      title: t('Existing'),
      icon: 'History',
      href: Routes.FAUCET_EXISTING,
    },
  ]);

  const onFormSubmit = useCallback(
    async (data: FormData) => {
      setRequestStatus({ status: 'processing' });

      try {
        const result = (await fundExistingAccount(
          data.name,
          chainID,
          AMOUNT_OF_COINS_FUNDED,
        )) as IFundExistingAccountResponse;

        const error = Object.values(result).find(
          (response) => response.result.status === 'failure',
        );

        if (error) {
          setRequestStatus({
            status: 'erroneous',
            message: error.result.error?.message || t('An error occurred.'),
          });
          return;
        }

        setRequestStatus({ status: 'successful' });
      } catch (err) {
        let message;

        if (isCustomError(err)) {
          const result = err.result;
          const status = result?.status;
          if (status === 'failure') {
            message = (result.error as { message: string }).message;
          }
        } else if (err instanceof Error) {
          message = err.message;
        } else {
          message = String(err);
        }

        setRequestStatus({ status: 'erroneous', message });
      }
    },
    [chainID, t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <section className={containerClass}>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Faucet')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Existing')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <Heading as="h4">{t('Add Funds to Existing Account')}</Heading>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <FormStatusNotification
          status={requestStatus.status}
          statusBodies={{
            successful: t('The coins have been funded to the given account.'),
          }}
          body={requestStatus.message}
        />
        <Card fullWidth>
          <Heading as="h5">Account</Heading>
          <Box marginBottom="$4" />
          <AccountNameField
            inputProps={register('name')}
            error={errors.name}
            label={t('The account name you would like to fund coins to')}
          />
          <Grid.Root columns={2} marginTop="$4">
            <Grid.Item>
              <ChainSelect
                onChange={onChainSelectChange}
                value={chainID}
                ariaLabel="Select Chain ID"
              />
            </Grid.Item>
          </Grid.Root>
        </Card>
        <div className={buttonContainerClass}>
          <Button
            loading={requestStatus.status === 'processing'}
            icon="TrailingIcon"
            iconAlign="right"
            title={t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
            disabled={requestStatus.status === 'processing'}
          >
            {t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ExistingAccountFaucetPage;
