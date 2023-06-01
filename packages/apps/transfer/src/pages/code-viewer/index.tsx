import { Button, TextField } from '@kadena/react-components';

import { StyledOption, StyledSelect } from '@/components/Global/Select/styles';
import dynamic from 'next/dynamic';

const AceViewer = dynamic(import('@/components/Global/Ace'), {
  ssr: false,
});

import {
  StyledAccountForm,
  StyledBack,
  StyledChevronLeft,
  StyledCodeViewerContainer,
  StyledCodeViewerWrapper,
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
  StyledResultContainer,
  StyledTextBold,
  StyledTextNormal,
  StyledTitle,
  StyledTitleContainer,
  StyledTotalChunk,
  StyledTotalContainer,
  StyledWalletNotConnected,
} from '@/pages/code-viewer/styles';
import { KLogoComponent } from '@/resources/svg/generated';
import { type CodeResult, codeViewer } from '@/services/modules/code-viewer';
import { convertIntToChainId } from '@/services/utils/utils';
import React, { FC, useState } from 'react';

const GetCode: FC = () => {
  const [moduleName, setModuleName] = useState<string>('');
  const [senderChain, setChain] = useState<number>(1);
  const [results, setResults] = useState<CodeResult>({});

  const networkdId = 'testnet04';
  const numberOfChains = 20;

  const getCode = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    try {
      event.preventDefault();
      const data = await codeViewer(
        moduleName,
        convertIntToChainId(senderChain),
        networkdId,
      );

      setResults(data);
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
    <StyledCodeViewerWrapper>
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
                <StyledInputLabel>Select Chain</StyledInputLabel>
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

        {results.status ? (
          <StyledResultContainer>
            <StyledTotalContainer>
              <StyledTotalChunk>
                <p>Request Key</p>
                <p>{results.reqKey}</p>
              </StyledTotalChunk>
              <StyledTotalChunk>
                <p>Status</p>
                <p>{results.status}</p>
              </StyledTotalChunk>
            </StyledTotalContainer>
          </StyledResultContainer>
        ) : null}

        {results.code ? (
          <StyledResultContainer>
            <StyledCodeViewerContainer>
              <AceViewer code={results.code}></AceViewer>
            </StyledCodeViewerContainer>
          </StyledResultContainer>
        ) : null}
      </StyledMainContent>
    </StyledCodeViewerWrapper>
  );
};

export default GetCode;
