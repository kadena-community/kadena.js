import {
  Button,
  Heading,
  SystemIcons,
  TextField,
} from '@kadena/react-components';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { Notification, Select } from '@/components/Global';
import { StyledOption } from '@/components/Global/Select/styles';
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
  ReactNode,
  useCallback,
  useState,
} from 'react';

const AMOUNT_OF_COINS_FUNDED: number = 21;

export const CHAINS = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
] as const;

export type ChainTuple = typeof CHAINS;
export type Chain = ChainTuple[number];

type RequestStatus = 'not started' | 'pending' | 'succeeded' | 'failed';

const getIconComponent = (status: RequestStatus): ReactNode => {
  switch (status) {
    case 'not started':
    case 'succeeded':
    case 'failed':
      return <SystemIcons.TrailingIcon />;
    case 'pending':
      return (
        <SystemIcons.Loading
          style={{ animation: '2000ms infinite linear spin' }}
        />
      );
  }
};

const getRequestStatusNotification = (status: RequestStatus): ReactNode => {
  switch (status) {
    case 'pending':
      return (
        <Notification
          title="Transaction is being processed..."
          body="Transaction is being processed..."
        />
      );

    case 'succeeded':
      return (
        <Notification
          title="Transaction has successfully completed"
          body="Transaction has successfully completed"
        />
      );

    default:
      return null;
  }
};

const ExistingFaucetPage: FC = () => {
  const { t } = useTranslation('common');

  const [accountName, setAccountName] = useState('');
  const [chainID, setChainID] = useState<Chain>('0');
  const [errors, setErrors] = useState<string[]>([]);

  const [requestStatus, setRequestStatus] =
    useState<RequestStatus>('not started');

  const onFormSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      console.log('onFormSubmit', { e, accountName });

      // Reset form request state
      setErrors([]);
      setRequestStatus('pending');

      // isExistingAccount();
      try {
        console.log('lets try to fund it');
        await fundExistingAccount(
          accountName,
          chainID,
          async (transaction, pollRequest): Promise<void> => {
            console.log(
              `Polling ${transaction.requestKey}.\nStatus: ${transaction.status}`,
            );
            console.log('Await request', await pollRequest);
            const request = await pollRequest;
            const result = request[transaction.requestKey!]?.result;
            const status = result?.status;
            if (status === 'failure') {
              const apiErrorMessage = (result.error as { message: string })
                .message;
              setErrors((errors) => [
                ...errors,
                `The request failed because of the following error;<br><br>"<code>${apiErrorMessage}</code>"`,
              ]);
            }
          },
          AMOUNT_OF_COINS_FUNDED,
        );
        console.log('hooray');
        setRequestStatus('succeeded');
      } catch (err) {
        console.error('Caught it in catch block', err);
        setErrors((errors) => [...errors, err]);
        setRequestStatus('failed');
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

  const onChainSelectChange = useCallback<FormEventHandler<HTMLSelectElement>>(
    (e) => {
      console.log('onChainSelectChange', { value: e.currentTarget.value });
      setChainID(e.currentTarget.value as Chain);
    },
    [],
  );

  return (
    <MainLayout title={t('Add Funds to Existing Account')}>
      <StyledForm onSubmit={onFormSubmit}>
        {errors.length
          ? errors.map((error, i) => {
              return (
                <Notification
                  key={`error-${i}`}
                  title="Something went wrong"
                  body={error}
                  onClose={() => {
                    setErrors(errors.filter((item) => item === error));
                  }}
                />
              );
            })
          : null}
        {getRequestStatusNotification(requestStatus)}
        <StyledAccountForm>
          <Heading as="h3">Account</Heading>
          <TextField
            label={t(
              'Associate your public key with a unique account name of your choosing',
            )}
            status="error"
            inputProps={{
              onChange: onAccountNameChange,
              leftPanel: SystemIcons.KIcon,
            }}
          />
          <Select
            label={t('Chain ID')}
            onChange={onChainSelectChange}
            value={chainID}
            status="error"
            leftPanel={SystemIcons.Link}
          >
            {CHAINS.map((x) => {
              return <StyledOption key={`chain-${x}`}>{x}</StyledOption>;
            })}
          </Select>
        </StyledAccountForm>
        <StyledFormButton>
          <Button
            title={t('Fund 100 Coins')}
            disabled={requestStatus === 'pending'}
          >
            {t('Fund 100 Coins')}
            {getIconComponent(requestStatus)}
          </Button>
        </StyledFormButton>
      </StyledForm>
    </MainLayout>
  );
};

export default ExistingFaucetPage;
