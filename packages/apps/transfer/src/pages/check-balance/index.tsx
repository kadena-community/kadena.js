import { Button, TextField } from '@kadena/react-components';

import { Option, Select } from '@/components/Global';
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
              <TextField
                label="Target Chainweb Server"
                inputProps={{
                  placeholder: 'Enter Node Server',
                  // @ts-ignore
                  onChange: (e) => setServerValue(e?.target?.value),
                  value: inputServerValue,
                }}
              />
              <TextField
                label="Token Name"
                inputProps={{
                  placeholder: 'Enter Token Name',
                  // @ts-ignore
                  onChange: (e) => setTokenValue(e?.target?.value),
                  value: inputTokenValue,
                }}
              />
              <TextField
                label="Your Account Name"
                inputProps={{
                  placeholder: 'Enter Your Account',
                  // @ts-ignore
                  onChange: (e) => setAccountValue(e?.target?.value),
                  value: inputAccountValue,
                }}
              />
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
