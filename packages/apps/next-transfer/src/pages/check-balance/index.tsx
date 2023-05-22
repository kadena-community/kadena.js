import { Button } from '@kadena/react-components';

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
  StyledInputField,
  StyledInputLabel,
  StyledLogoTextContainer,
  StyledMainContent,
  StyledResultContainer,
  StyledTableContainer,
  StyledTextBold,
  StyledTextNormal,
  StyledTitle,
  StyledTitleContainer,
  StyledTotalChunk,
  StyledTotalContainer,
  StyledWalletNotConnected,
} from '@/pages/check-balance/styles';
import { KLogoComponent } from '@/resources/svg/generated';
import {
  type ChainResult,
  checkBalance,
} from '@/services/accounts/get-balance';
import React, { FC, useState } from 'react';

const GetBalance: FC = () => {
  const [inputServerValue, setServerValue] = useState<string>('');
  const [inputTokenValue, setTokenValue] = useState<string>('');
  const [inputAccountValue, setAccountValue] = useState<string>('');
  const [results, setResults] = useState<ChainResult[]>([]);

  const getBalance = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    try {
      event.preventDefault();
      const data = await checkBalance(
        inputServerValue,
        inputTokenValue,
        inputAccountValue,
      );
      setResults(data);
    } catch (e) {
      console.log(e);
    }
  };

  const calculateTotal = (): number =>
    results.reduce(
      (acc, item) => acc + parseFloat(item.data?.balance ?? '0'),
      0,
    );

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
          <StyledTitle>Check account balance</StyledTitle>
        </StyledTitleContainer>
      </StyledHeaderContainer>

      <StyledMainContent>
        <StyledFormContainer>
          <StyledForm onSubmit={getBalance}>
            <StyledAccountForm>
              <StyledField>
                <StyledInputLabel>Target Chainweb Server</StyledInputLabel>
                <StyledInputField
                  type="text"
                  id="server"
                  placeholder="Enter Node Server"
                  onChange={(e) => setServerValue(e.target.value)}
                  value={inputServerValue}
                />
              </StyledField>
              <StyledField>
                <StyledInputLabel>Token Name</StyledInputLabel>
                <StyledInputField
                  type="text"
                  id="server"
                  placeholder="Enter Token Name"
                  onChange={(e) => setTokenValue(e.target.value)}
                  value={inputTokenValue}
                />
              </StyledField>
              <StyledField>
                <StyledInputLabel>Your Account Name</StyledInputLabel>
                <StyledInputField
                  type="text"
                  id="server"
                  placeholder="Enter Your Account"
                  onChange={(e) => setAccountValue(e.target.value)}
                  value={inputAccountValue}
                />
              </StyledField>
            </StyledAccountForm>
            <StyledFormButton>
              <Button title="Get Account Balance">Get Account Balance</Button>
            </StyledFormButton>
          </StyledForm>
        </StyledFormContainer>

        {results.length > 0 ? (
          <StyledResultContainer>
            <StyledTotalContainer>
              <StyledTotalChunk>
                <p>Account Name</p>
                <p>{inputAccountValue}</p>
              </StyledTotalChunk>
              <StyledTotalChunk>
                <p>Total Balance</p>
                <p>{calculateTotal().toFixed(3)} KDA</p>
              </StyledTotalChunk>
            </StyledTotalContainer>
            <StyledTableContainer>
              <table>
                <thead>
                  <tr>
                    <th>Chain</th>
                    <th>Guard</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => {
                    console.log(result);
                    return (
                      <tr key={result.chain}>
                        <td>{result.chain}</td>
                        <td>
                          <p>{result.data?.guard.pred}</p>
                          {result.data?.guard.keys.map((key) => (
                            <span key={key}>{key}</span>
                          ))}
                        </td>
                        <td>{result.data?.balance ?? 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </StyledTableContainer>
          </StyledResultContainer>
        ) : null}
      </StyledMainContent>
    </StyledCheckBalanceWrapper>
  );
};

export default GetBalance;
