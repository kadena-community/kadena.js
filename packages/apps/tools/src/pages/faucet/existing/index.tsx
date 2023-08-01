import { ICommandResult } from '@kadena/chainweb-node-client';
import {
  Breadcrumbs,
  Button,
  Heading,
  SystemIcon,
  TextField,
} from '@kadena/react-ui';

import {
  ChainSelect,
  FormStatus,
  FormStatusNotification,
} from '@/components/Global';
import Routes from '@/constants/routes';
import { useToolbar } from '@/context/layout-context';
import { usePersistentChainID } from '@/hooks';
import {
  StyledAccountForm,
  StyledForm,
  StyledFormButton,
} from '@/pages/transactions/cross-chain-transfer-finisher/styles';
import { fundExistingAccount } from '@/services/faucet';
import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(3).max(256),
});

type FormData = z.infer<typeof schema>;

// TODO: This needs to be changed to 100, when the contract is redeployed
const AMOUNT_OF_COINS_FUNDED: number = 20;

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
      icon: SystemIcon.History,
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
    <div>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Faucet')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Existing')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <StyledForm onSubmit={handleSubmit(onFormSubmit)}>
        <FormStatusNotification
          status={requestStatus.status}
          statusBodies={{
            successful: t('The coins have been funded to the given account.'),
          }}
          body={requestStatus.message}
        />
        <StyledAccountForm>
          <Heading as="h3">Account</Heading>
          <TextField
            label={t('The account name you would like to fund coins to')}
            status={errors.name ? 'negative' : undefined}
            inputProps={{
              ...register('name'),
              id: 'account-name-input',
              leftIcon: SystemIcon.KIcon,
            }}
            helperText={errors.name?.message ?? ''}
          />
          <ChainSelect
            onChange={onChainSelectChange}
            value={chainID}
            ariaLabel="Select Chain ID"
          />
        </StyledAccountForm>
        <StyledFormButton>
          <Button
            loading={requestStatus.status === 'processing'}
            icon="TrailingIcon"
            iconAlign="right"
            title={t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
            disabled={requestStatus.status === 'processing'}
          >
            {t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
          </Button>
        </StyledFormButton>
      </StyledForm>
    </div>
  );
};

export default ExistingAccountFaucetPage;
