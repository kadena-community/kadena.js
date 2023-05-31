import { Button, TextField } from '@kadena/react-components';

import { StyledOption, StyledSelect } from '@/components/Global/Select/styles';
import {
  StyledAccountForm,
  StyledBack,
  StyledCheckBalanceWrapper,
  StyledChevronLeft,
  StyledField,
  StyledForm,
  StyledFormButton,
  StyledFormContainer,
  StyledHeaderContainer,
  StyledHeaderLogoWalletContent,
  StyledHeaderText,
  StyledIconImage,
  StyledInputLabel,
  StyledLogoTextContainer,
  StyledMainContent,
  StyledTextBold,
  StyledTextNormal,
  StyledTitle,
  StyledTitleContainer,
  StyledWalletNotConnected,
} from '@/pages/code-viewer/styles';
import { KLogoComponent } from '@/resources/svg/generated';
import { codeViewer } from '@/services/modules/code-viewer';
import React, { FC, useState } from 'react';

const GetCode: FC = () => {
  const [moduleName, setModuleName] = useState<string>('');
  const [senderChain, setChain] = useState<number>(1);
  // const [results, setResults] = useState<ChainResult[]>([]);

  const NETWORK_ID = 'testnet04';
  const chainId = '1';
  const numberOfChains = 20;

  const getCode = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    try {
      event.preventDefault();
      const data = await codeViewer(moduleName, chainId);
      console.log(data);
      // setResults(data);
    } catch (e) {
      console.log(e);
    }
  };

  const renderChainOptions = (): JSX.Element[] => {
    const options = [];
    for (let i = 0; i < numberOfChains; i++) {
      options.push(
        <StyledOption value={i} key={i}>
          Chain {i}
        </StyledOption>,
      );
    }
    return options;
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
          <StyledTitle>Code Viewer</StyledTitle>
        </StyledTitleContainer>
      </StyledHeaderContainer>

      <StyledMainContent>
        <StyledFormContainer>
          <StyledForm onSubmit={getCode}>
            <StyledAccountForm>
              <StyledField>
                <StyledInputLabel>Chain</StyledInputLabel>
                <StyledSelect
                  value={senderChain}
                  placeholder="Select Chain"
                  onChange={(e) => setChain(parseInt(e.target.value))}
                >
                  {renderChainOptions()}
                </StyledSelect>
              </StyledField>
              <TextField
                label="Module Name"
                inputProps={{
                  placeholder: 'Enter desired module name',
                  // @ts-ignore
                  onChange: (e) => setModuleName(e?.target?.value),
                  value: moduleName,
                }}
              />
            </StyledAccountForm>
            <StyledFormButton>
              <Button title="Get Code">Get Code</Button>
            </StyledFormButton>
          </StyledForm>
        </StyledFormContainer>
      </StyledMainContent>
    </StyledCheckBalanceWrapper>
  );
};

export default GetCode;
