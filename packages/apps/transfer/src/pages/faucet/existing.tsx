import { Button, TextField } from '@kadena/react-components';

import {
  StyledAccountForm,
  StyledForm,
  StyledFormButton,
  StyledMainContent,
} from '../transfer/cross-chain-transfer-finisher/styles';

import { type Chain, CHAINS } from './new';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { Select, SidebarMenu } from '@/components/Global';
import { StyledOption } from '@/components/Global/Select/styles';
import { fundExistingAccount } from '@/services/faucet';
import useTranslation from 'next-translate/useTranslation';
import React, {
  FC,
  FormEvent,
  FormEventHandler,
  useCallback,
  useState,
} from 'react';

const ExistingFaucetPage: FC = () => {
  const { t } = useTranslation('common');

  const [accountName, setAccountName] = useState('');
  const [chainID, setChainID] = useState<Chain>('0');

  const onFormSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    console.log('onFormSubmit', { e, accountName });
    // isExistingAccount();
    await fundExistingAccount(accountName, chainID, 100);
  }, []);

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
      <StyledMainContent>
        <SidebarMenu />
        <StyledForm onSubmit={onFormSubmit}>
          <StyledAccountForm>
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
            <Button title={t('Fund 100 Coins')}>{t('Fund 100 Coins')}</Button>
          </StyledFormButton>
        </StyledForm>
      </StyledMainContent>
    </MainLayout>
  );
};

export default ExistingFaucetPage;
