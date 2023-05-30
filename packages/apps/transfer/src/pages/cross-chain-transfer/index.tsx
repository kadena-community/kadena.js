import { Button, TextField } from '@kadena/react-components';

import {
  StyledAccountForm,
  StyledBack,
  StyledCheckBalanceWrapper,
  StyledChevronLeft,
  StyledForm,
  StyledFormButton,
  StyledFormContainer,
  StyledHeaderContainer,
  StyledHeaderLogoWalletContent,
  StyledHeaderText,
  StyledIconImage,
  StyledLogoTextContainer,
  StyledMainContent,
  StyledTextBold,
  StyledTextNormal,
  StyledTitle,
  StyledTitleContainer,
  StyledWalletNotConnected,
} from './styles';

import { KLogoComponent } from '@/resources/svg/generated';
import React, { FC, useState } from 'react';

const CoinTransfer: FC = () => {
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
    <StyledCheckBalanceWrapper>
      <StyledHeaderContainer>
        <StyledHeaderLogoWalletContent>
          <StyledLogoTextContainer>
            <KLogoComponent width="100px" />
            <StyledHeaderText>
              <StyledTextBold>K:Transfer</StyledTextBold>
              <StyledTextNormal>Kadena Testnet</StyledTextNormal>
            </StyledHeaderText>
          </StyledLogoTextContainer>
          <StyledWalletNotConnected>
            <p>Connect your wallet</p>
            <StyledIconImage width={'40px'} height={'40px'} />
          </StyledWalletNotConnected>
        </StyledHeaderLogoWalletContent>

        <StyledTitleContainer>
          <StyledBack href={'/'}>
            <StyledChevronLeft width={'20px'} height={'20px'} />
            <span>Back</span>
          </StyledBack>
          <StyledTitle>Finish Cross Chain Transfer</StyledTitle>
        </StyledTitleContainer>
      </StyledHeaderContainer>

      <StyledMainContent>
        <StyledFormContainer>
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
        </StyledFormContainer>
      </StyledMainContent>
    </StyledCheckBalanceWrapper>
  );
};

export default CoinTransfer;
