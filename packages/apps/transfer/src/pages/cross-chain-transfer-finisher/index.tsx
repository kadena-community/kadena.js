import { Button, TextField } from '@kadena/react-components';

import MainLayout from '../../components/Common/Layout/MainLayout';

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

import { SidebarMenu } from '@/components/Global';
import { useAppContext } from '@/context/app-context';
import React, { FC, useState } from 'react';

const CrossChainTransferFinisher: FC = () => {
  const { network } = useAppContext();

  const chainServerText =
    network.toString() === 'Mainnet' ? 'mainnet01' : 'testnet04';
  const chainServer =
    network.toString() === 'Mainnet'
      ? 'api.chainweb.com'
      : 'api.testnet.chainweb.com';

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
    <MainLayout title="Kadena Cross Chain Transfer Finisher">
      <StyledMainContent>
        <SidebarMenu />
        <StyledForm onSubmit={handleSubmit}>
          <StyledAccountForm>
            <StyledToggleContainer>
              <StyledFieldCheckbox>
                <StyledCheckbox
                  type="checkbox"
                  id={'advanced-options'}
                  placeholder="Enter private key to sign the transaction"
                  onChange={(e) => setAdvancedOptions(!advancedOptions)}
                  value={advancedOptions.toString()}
                />
                <StyledCheckboxLabel htmlFor="advanced-options">
                  Advanced options
                </StyledCheckboxLabel>
              </StyledFieldCheckbox>
            </StyledToggleContainer>

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

            {advancedOptions ? (
              <>
                <TextField
                  label="Chain Server"
                  inputProps={{
                    placeholder: 'Enter Chain Server',
                    // @ts-ignore
                    onChange: (e) => setChainWebServer(e?.target?.value),
                    value: chainServer,
                    leadingText: chainServerText,
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
              </>
            ) : null}
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

export default CrossChainTransferFinisher;
