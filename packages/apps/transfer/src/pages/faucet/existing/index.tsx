import { IPollResponse } from '@kadena/chainweb-node-client';
import { ICommandBuilder, IPactCommand, PactCommand } from '@kadena/client';
import { Button, Heading, SystemIcon, TextField } from '@kadena/react-ui';

import FormStatusNotification from './notification';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { type OnChainSelectChange, ChainSelect } from '@/components/Global';
import { useAppContext } from '@/context/app-context';
import {
  StyledAccountForm,
  StyledForm,
  StyledFormButton,
} from '@/pages/transfer/cross-chain-transfer-finisher/styles';
import { fundExistingAccount } from '@/services/faucet';
import useTranslation from 'next-translate/useTranslation';
import React, {
  FC,
  FormEvent,
  FormEventHandler,
  useCallback,
  useState,
} from 'react';

// TODO: This needs to be changed to 100, when the contract is redeployed
const AMOUNT_OF_COINS_FUNDED: number = 20;

export type RequestStatus = 'not started' | 'pending' | 'succeeded' | 'failed';

const ExistingAccountFaucetPage: FC = () => {
  const { t } = useTranslation('common');

  const [accountName, setAccountName] = useState('');
  const { chainID, setChainID } = useAppContext();

  const [requestStatus, setRequestStatus] = useState<{
    status: RequestStatus;
    message?: string;
  }>({ status: 'not started' });

  const onPoll = async (
    transaction: IPactCommand & ICommandBuilder<Record<string, unknown>>,
    pollRequest: Promise<IPollResponse>,
  ): Promise<void> => {
    const request = await pollRequest;
    const result = request[transaction.requestKey!]?.result;
    const status = result?.status;
    if (status === 'failure') {
      const apiErrorMessage = (result.error as { message: string }).message;

      setRequestStatus({ status: 'failed', message: apiErrorMessage });
    }
  };

  const onFormSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setRequestStatus({ status: 'pending' });

      try {
        await fundExistingAccount(
          accountName,
          chainID,
          onPoll,
          AMOUNT_OF_COINS_FUNDED,
        );

        setRequestStatus({ status: 'succeeded' });
      } catch (err) {
        let message;
        if (err instanceof Error) {
          message = err.message;
        } else {
          message = String(err);
        }

        /*
         * When the poll callback rejects, it will return `this` (an instance of PactCommand).
         * We handle the `setRequestStatus` in the poll callback, since we get the actual error
         * message there. So in this case we can skip `setRequestStatus`, since we already did that.
         * In other "uncaught" cases we do want to do call `setRequestStatus` here.
         */
        if (!(err instanceof PactCommand)) {
          setRequestStatus({ status: 'failed', message });
        }
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

  const onChainSelectChange = useCallback<OnChainSelectChange>(
    (chainID) => {
      setChainID(chainID);
    },
    [setChainID],
  );

  return (
    <MainLayout title={t('Add Funds to Existing Account')}>
      <StyledForm onSubmit={onFormSubmit}>
        <FormStatusNotification
          status={requestStatus.status}
          body={requestStatus.message}
        />
        <StyledAccountForm>
          <Heading as="h3">Account</Heading>
          <TextField
            label={t('The account name you would like to fund coins to')}
            status="negative"
            inputProps={{
              id: 'account-name-input',
              onChange: onAccountNameChange,
              leftIcon: SystemIcon.KIcon,
            }}
          />
          <ChainSelect onChange={onChainSelectChange} value={chainID} />
        </StyledAccountForm>
        <StyledFormButton>
          <Button.Root
            title={t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
            disabled={requestStatus.status === 'pending'}
          >
            {t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
            {requestStatus.status === 'pending' ? (
              <SystemIcon.Loading
                style={{ animation: '2000ms infinite linear spin' }}
              />
            ) : (
              <SystemIcon.TrailingIcon />
            )}
          </Button.Root>
        </StyledFormButton>
      </StyledForm>
    </MainLayout>
  );
};

export default ExistingAccountFaucetPage;
