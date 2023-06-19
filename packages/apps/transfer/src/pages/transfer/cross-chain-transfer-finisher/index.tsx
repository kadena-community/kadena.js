import { Button, TextField } from '@kadena/react-components';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { SidebarMenu } from '@/components/Global';
import { kadenaConstants } from '@/constants/kadena';
import { useAppContext } from '@/context/app-context';
import {
  StyledAccountForm,
  StyledCheckbox,
  StyledCheckboxLabel,
  StyledFieldCheckbox,
  StyledForm,
  StyledFormButton,
  StyledToggleContainer,
} from '@/pages/transfer/cross-chain-transfer-finisher/styles';
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
      server: kadenaConstants.MAINNET.API,
      network: kadenaConstants.MAINNET.NETWORKS.MAINNET01,
    },
    Testnet: {
      server: kadenaConstants.TESTNET.API,
      network: kadenaConstants.TESTNET.NETWORKS.TESTNET04,
    },
  };

  const [requestKey, setRequestKey] = useState<string>('');
  const [kadenaXChainGas, setKadenaXChainGas] =
    useState<string>('kadena-xchain-gas');
  const [gasPrice, setGasPrice] = useState<number>(0.00000001);
  const [gasLimit, setGasLimit] = useState<number>(kadenaConstants.GAS_LIMIT);
  const [advancedOptions, setAdvancedOptions] = useState<boolean>(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    console.log('submitted');
  };

  return (
    <MainLayout title={t('Kadena Cross Chain Transfer Finisher')}>
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
              onChange: (e) =>
                setRequestKey((e.target as HTMLInputElement).value),
              value: requestKey,
            }}
          />

          {advancedOptions ? (
            <>
              <TextField
                label="Chain Server"
                inputProps={{
                  placeholder: t('Enter Chain Server'),
                  value: chainNetwork[network].server,
                  leadingText: chainNetwork[network].network,
                }}
              />
              <TextField
                label={t('Gas Payer Account')}
                helper={t('only single pubkey accounts are supported')}
                inputProps={{
                  placeholder: t('Enter Your Account'),
                  onChange: (e) =>
                    setKadenaXChainGas((e.target as HTMLInputElement).value),
                  value: kadenaXChainGas,
                }}
              />
              <TextField
                label={t('Gas Price')}
                inputProps={{
                  placeholder: t('Enter Gas Payer'),
                  onChange: (e) =>
                    setGasPrice(Number((e.target as HTMLInputElement).value)),
                  value: gasPrice,
                }}
              />
              <TextField
                label={t('Gas Limit')}
                inputProps={{
                  placeholder: t('Enter Gas Limit'),
                  onChange: (e) =>
                    setGasLimit(Number((e.target as HTMLInputElement).value)),
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
    </MainLayout>
  );
};

export default CrossChainTransferFinisher;
