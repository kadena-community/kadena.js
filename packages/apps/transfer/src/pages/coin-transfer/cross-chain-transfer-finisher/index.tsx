import { Button, TextField } from '@kadena/react-components';

import {
  StyledNavItem,
  StyledNavItemIcon,
  StyledNavItemSelectedText,
  StyledNavItemText,
  StyledSelectedNavItem,
  StyledSidebar,
} from '../styles';

import {
  StyledAccountForm,
  StyledForm,
  StyledFormButton,
  StyledMainContent,
} from './styles';

import MainLayout from '@/components/Common/Layout/MainLayout';
import routes from '@/constants/routes';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useState } from 'react';

const CoinTransfer: FC = () => {
  const { t } = useTranslation('common');
  const [chainWebServer, setChainWebServer] =
    useState<string>('api.chainweb.com');
  const [requestKey, setRequestKey] = useState<string>('');
  const [kadenaXChainGas, setKadenaXChainGas] = useState<string>('');
  const [gasPrice, setGasPrice] = useState<string>('');
  const [gasLimit, setGasLimit] = useState<string>('');

  const handleSubmit = (e: any) => {
    e.preventDefault();

    console.log('submitted');
  };

  return (
    <MainLayout title={t('Kadena Cross Chain Transfer Finisher')}>
      <StyledMainContent>
        <StyledSidebar>
          <StyledNavItem href={routes.COIN_TRANSFER}>
            <StyledNavItemIcon>K:</StyledNavItemIcon>
            <StyledNavItemText>{t('Transfer')}</StyledNavItemText>
          </StyledNavItem>
          <StyledSelectedNavItem href={routes.CROSS_CHAIN_TRANSFER_FINISHER}>
            <StyledNavItemIcon>K:</StyledNavItemIcon>
            <StyledNavItemSelectedText>
              {t('Cross Chain Transfer Finisher')}
            </StyledNavItemSelectedText>
          </StyledSelectedNavItem>
        </StyledSidebar>
        <StyledForm onSubmit={handleSubmit}>
          <StyledAccountForm>
            <TextField
              label={t('Chain Server')}
              inputProps={{
                placeholder: t('Enter Chain Server'),
                // @ts-ignore
                onChange: (e) => setChainWebServer(e?.target?.value),
                value: chainWebServer,
                leadingText: t('mainnet01'),
              }}
            />
            <TextField
              label={t('Request Key')}
              info={requestKey ? '' : t('Not a Cross Chain Request Key')}
              inputProps={{
                placeholder: t('Enter Request Key'),
                // @ts-ignore
                onChange: (e) => setRequestKey(e?.target?.value),
                value: requestKey,
              }}
            />
            <TextField
              label={t('Gas Payer Account')}
              helper={t('only single pubkey accounts are supported')}
              inputProps={{
                placeholder: t('Enter Your Account'),
                // @ts-ignore
                onChange: (e) => setKadenaXChainGas(e?.target?.value),
                value: kadenaXChainGas,
              }}
            />
            <TextField
              label={t('Gas Price')}
              inputProps={{
                placeholder: t('Enter Gas Payer'),
                // @ts-ignore
                onChange: (e) => setGasPrice(e?.target?.value),
                value: gasPrice,
              }}
            />
            <TextField
              label={t('Gas Limit')}
              inputProps={{
                placeholder: t('Enter Gas Limit'),
                // @ts-ignore
                onChange: (e) => setGasLimit(e?.target?.value),
                value: gasLimit,
              }}
            />
          </StyledAccountForm>
          <StyledFormButton>
            <Button title={t('Finish Cross Chain Transfer')}>
              {t('Finish Cross Chain Transfer')}
            </Button>
          </StyledFormButton>
        </StyledForm>
      </StyledMainContent>
    </MainLayout>
  );
};

export default CoinTransfer;
