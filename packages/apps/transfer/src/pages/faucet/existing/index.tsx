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
import { usePersistentChainID } from '@/hooks';
import {
  StyledAccountForm,
  StyledForm,
  StyledFormButton,
} from '@/pages/transfer/cross-chain-transfer-finisher/styles';
import { fundExistingAccount } from '@/services/faucet';
import { zodResolver } from '@hookform/resolvers/zod';
import useTranslation from 'next-translate/useTranslation';
import React, {
  FC,
  FormEvent,
  FormEventHandler,
  useCallback,
  useState,
} from 'react';
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

const ExistingAccountFaucetPage: FC = () => {
  const { t } = useTranslation('common');

  const [accountName, setAccountName] = useState('');
  const [chainID, onChainSelectChange] = usePersistentChainID();

  const [requestStatus, setRequestStatus] = useState<{
    status: FormStatus;
    message?: string;
  }>({ status: 'idle' });

  const onFormSubmit = useCallback(
    async (data: FormData) => {
      setRequestStatus({ status: 'processing' });

      try {
        await fundExistingAccount(accountName, chainID, AMOUNT_OF_COINS_FUNDED);

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
    [accountName, chainID],
  );

  const onAccountNameChange = useCallback<FormEventHandler<HTMLInputElement>>(
    (e) => {
      setAccountName(e.currentTarget.value);
    },
    [],
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
            successful: 'The coins have been funded to the given account.',
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
              onChange: onAccountNameChange,
              leftIcon: SystemIcon.KIcon,
            }}
            helperText={errors.name?.message ?? ''}
          />
          <ChainSelect onChange={onChainSelectChange} value={chainID} />
        </StyledAccountForm>
        <StyledFormButton>
          <Button.Root
            title={t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
            disabled={requestStatus.status === 'processing'}
          >
            {t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
            {requestStatus.status === 'processing' ? (
              <SystemIcon.Loading
                style={{ animation: '2000ms infinite linear spin' }}
              />
            ) : (
              <SystemIcon.TrailingIcon />
            )}
          </Button.Root>
        </StyledFormButton>
      </StyledForm>
    </div>
  );
};

export default ExistingAccountFaucetPage;
