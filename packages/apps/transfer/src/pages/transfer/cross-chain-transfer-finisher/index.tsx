import { Button, TextField } from '@kadena/react-components';

import MainLayout from '../../../components/Common/Layout/MainLayout';
import { SidebarMenu } from '../../../components/Global';
import { useAppContext } from '../../../context/app-context';

import {
  StyledAccountForm,
  StyledCheckbox,
  StyledCheckboxLabel,
  StyledFieldCheckbox,
  StyledForm,
  StyledFormButton,
  StyledMainContent,
  StyledToggleContainer,
} from './styles';

import useTranslation from 'next-translate/useTranslation';
import React, { FC, useState } from 'react';

const CrossChainTransferFinisher: FC = () => {
  const { t } = useTranslation('common');
  const { network } = useAppContext();

  const chainNetwork: {
    Mainnet: { server: string; network: string };
    Testnet: { server: string; network: string };
  } = {
    Mainnet: {
      server: 'api.chainweb.com',
      network: 'mainnet01',
    },
    Testnet: {
      server: 'api.testnet.chainweb.com',
      network: 'testnet04',
    },
  };

  const [requestKey, setRequestKey] = useState<string>('');
  const [kadenaXChainGas, setKadenaXChainGas] =
    useState<string>('kadena-xchain-gas');
  const [gasPrice, setGasPrice] = useState<string>('0.00000001');
  const [gasLimit, setGasLimit] = useState<string>('750');
  const [advancedOptions, setAdvancedOptions] = useState<boolean>(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    console.log('submitted');
  };

  return (
    <MainLayout title={t('Kadena Cross Chain Transfer Finisher')}>
      <StyledMainContent>
        <SidebarMenu />
        <StyledForm onSubmit={handleSubmit}>
          <StyledAccountForm>
            <StyledToggleContainer>
              <StyledFieldCheckbox>
                <StyledCheckbox
                  type="checkbox"
                  id={'advanced-options'}
                  placeholder={t('Enter private key to sign the transaction')}
                  onChange={(e) => setAdvancedOptions(!advancedOptions)}
                  value={advancedOptions.toString()}
                />
                <StyledCheckboxLabel htmlFor="advanced-options">
                  {t('Advanced options')}
                </StyledCheckboxLabel>
              </StyledFieldCheckbox>
            </StyledToggleContainer>

            <TextField
              label={t('Request Key')}
              info={requestKey ? '' : t('(Not a Cross Chain Request Key')}
              inputProps={{
                placeholder: t('Enter Request Key'),
                // @ts-ignore
                onChange: (e) => setRequestKey(e?.target?.value),
                value: requestKey,
              }}
            />

            {advancedOptions ? (
              <>
                <TextField
                  label="Chain Server"
                  inputProps={{
                    placeholder: t('Enter Chain Server'),
                    // @ts-ignore
                    onChange: (e) => setChainWebServer(e?.target?.value),
                    value: chainNetwork[network].server,
                    leadingText: chainNetwork[network].network,
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
              </>
            ) : null}
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

export default CrossChainTransferFinisher;
