import { Button, TextField } from '@kadena/react-components';

import MainLayout from '@/components/Common/Layout/MainLayout';
import {
  StyledAccountForm,
  StyledForm,
  StyledFormButton,
  StyledMainContent,
  StyledResultContainer,
  StyledSidebar,
  StyledTableContainer,
  StyledTotalChunk,
  StyledTotalContainer,
} from '@/pages/check-balance/styles';
import {
  type ChainResult,
  checkBalance,
} from '@/services/accounts/get-balance';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useState } from 'react';

const GetBalance: FC = () => {
  const { t } = useTranslation('common');
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
    <MainLayout title="Check Account Balance">
      <StyledMainContent>
        <StyledSidebar />
        <StyledForm onSubmit={getBalance}>
          <StyledAccountForm>
            <TextField
              label={t('Target Chainweb Server')}
              inputProps={{
                placeholder: t('Enter Node Server'),
                // @ts-ignore
                onChange: (e) => setServerValue(e?.target?.value),
                value: inputServerValue,
              }}
            />
            <TextField
              label={t('Token Name')}
              inputProps={{
                placeholder: t('Enter Token Name'),
                // @ts-ignore
                onChange: (e) => setTokenValue(e?.target?.value),
                value: inputTokenValue,
              }}
            />
            <TextField
              label={t('Your Account Name')}
              inputProps={{
                placeholder: t('Enter Your Account'),
                // @ts-ignore
                onChange: (e) => setAccountValue(e?.target?.value),
                value: inputAccountValue,
              }}
            />
          </StyledAccountForm>
          <StyledFormButton>
            <Button title={t('Get Account Balance')}>
              {t('Get Account Balance')}
            </Button>
          </StyledFormButton>
        </StyledForm>

        {results.length > 0 ? (
          <StyledResultContainer>
            <StyledTotalContainer>
              <StyledTotalChunk>
                <p>{t('Account Name')}</p>
                <p>{inputAccountValue}</p>
              </StyledTotalChunk>
              <StyledTotalChunk>
                <p>{t('Total Balance')}</p>
                <p>{calculateTotal().toFixed(3)} KDA</p>
              </StyledTotalChunk>
            </StyledTotalContainer>
            <StyledTableContainer>
              <table>
                <thead>
                  <tr>
                    <th>{t('Chain')}</th>
                    <th>{t('Guard')}</th>
                    <th>{t('Quantity')}</th>
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
    </MainLayout>
  );
};

export default GetBalance;
