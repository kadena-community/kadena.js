import {
  Button,
  Heading,
  SystemIcons,
  TextField,
} from '@kadena/react-components';

import {
  StyledAccountForm,
  StyledForm,
  StyledFormButton,
  StyledMainContent,
} from '../transfer/cross-chain-transfer-finisher/styles';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { Notification, Select, SidebarMenu } from '@/components/Global';
import { StyledOption } from '@/components/Global/Select/styles';
import { isExistingAccount } from '@/services/accounts/is-existing';
import { fundNewAccount } from '@/services/faucet';
import useTranslation from 'next-translate/useTranslation';
import React, {
  FC,
  FormEvent,
  FormEventHandler,
  useCallback,
  useState,
} from 'react';

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

const NewFaucetPage: FC = () => {
  const { t } = useTranslation('common');

  const [accountName, setAccountName] = useState('');
  const [chainID, setChainID] = useState<Chain>('0');

  const onFormSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      console.log('onFormSubmit', { e, accountName });
      // isExistingAccount();
      await fundNewAccount(accountName, chainID, [
        '426623443b003a765092ed0896de0ca3aaebf4fdda9e45940e6e9cf36801dada',
      ]);
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
    <MainLayout title={t('Create and Fund New Account')}>
      <StyledMainContent>
        <SidebarMenu />
        <StyledForm onSubmit={onFormSubmit}>
          <Notification
            title="Before you start"
            body='Generate a key pair by visiting this <a href="#"><strong>webpage</strong></a> or by downloading a <a href="#"><strong>wallet</strong></a>'
          />
          <StyledAccountForm>
            <Heading as="h3">Account</Heading>
            <TextField
              label={t(
                'Associate your public key with a unique account name of your choosing',
              )}
              status="error"
              inputProps={{
                onChange: onAccountNameChange,
                leadingText: 'K:',
              }}
            />
            <Select
              label={t('Chain ID')}
              onChange={onChainSelectChange}
              value={chainID}
              status="error"
              leadingText="C:"
            >
              {CHAINS.map((x) => {
                return <StyledOption key={`chain-${x}`}>{x}</StyledOption>;
              })}
            </Select>
          </StyledAccountForm>
          <StyledFormButton>
            <Button title={t('Create and Fund Account')}>
              {t('Create and Fund Account')}
            </Button>
          </StyledFormButton>
        </StyledForm>
      </StyledMainContent>
    </MainLayout>
  );
};

export default NewFaucetPage;
