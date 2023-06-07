import { Button, TextField } from '@kadena/react-components';

import MainLayout from '../../components/Common/Layout/MainLayout';

import {
  StyledAccountForm,
  StyledForm,
  StyledFormButton,
  StyledMainContent,
} from './styles';

import { Option, Select, SidebarMenu } from '@/components/Global';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';

const CoinTransfer: FC = () => {
  const router = useRouter();

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
    <MainLayout title="Kadena Cross Chain Transfer Finisher">
      <StyledMainContent>
        <SidebarMenu />
        <StyledForm onSubmit={handleSubmit}>
          <StyledAccountForm>
            <TextField
              label="Chain Server"
              inputProps={{
                placeholder: 'Enter Chain Server',
                // @ts-ignore
                onChange: (e) => setChainWebServer(e?.target?.value),
                value: chainWebServer,
                leadingText: 'mainnet01',
              }}
            />
            <TextField
              label="Request Key"
              info={requestKey ? '' : 'Not a Cross Chain Request Key'}
              inputProps={{
                placeholder: 'Enter Request Key',
                // @ts-ignore
                onChange: (e) => setRequestKey(e?.target?.value),
                value: requestKey,
              }}
            />
            <TextField
              label="Gas Payer Account"
              helper="only single pubkey accounts are supported"
              inputProps={{
                placeholder: 'Enter Your Account',
                // @ts-ignore
                onChange: (e) => setKadenaXChainGas(e?.target?.value),
                value: kadenaXChainGas,
              }}
            />
            <TextField
              label="Gas Price"
              inputProps={{
                placeholder: 'Enter Gas Payer',
                // @ts-ignore
                onChange: (e) => setGasPrice(e?.target?.value),
                value: gasPrice,
              }}
            />
            <TextField
              label="Gas Limit"
              inputProps={{
                placeholder: 'Enter Gas Limit',
                // @ts-ignore
                onChange: (e) => setGasLimit(e?.target?.value),
                value: gasLimit,
              }}
            />
          </StyledAccountForm>
          <StyledFormButton>
            <Button title="Finish Cross Chain Transfer">
              Finish Cross Chain Transfer
            </Button>
          </StyledFormButton>
        </StyledForm>
      </StyledMainContent>
    </MainLayout>
  );
};

export default CoinTransfer;
