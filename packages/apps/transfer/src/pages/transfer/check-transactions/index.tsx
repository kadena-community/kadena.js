import { Button, TextField } from '@kadena/react-components';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { Option, Select } from '@/components/Global';
import {
  StyledForm,
  StyledFormButton,
  StyledMainContent,
  StyledMediumField,
  StyledResultContainer,
  StyledSidebar,
  StyledSmallField,
} from '@/pages/transfer/check-transactions/styles';
import { getTransactions } from '@/services/accounts/get-transactions';
import React, { FC, useState } from 'react';

const CheckTransactions: FC = () => {
  const [inputChainValue, setChainValue] = useState<string>('1');
  const [inputAccountValue, setAccountValue] = useState<string>(
    'k:9346a8a431cb155623ba5dba36f964913cb543e38a4bf38a971aea9a56f545fa',
  );
  const [results, setResults] = useState<any[]>([]);

  const numberOfChains = 20;

  const checkTransactions = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    try {
      event.preventDefault();

      const result = await getTransactions({
        chain: inputChainValue,
        account: inputAccountValue,
      });

      setResults(result);
    } catch (e) {
      console.log(e);
    }
  };

  const renderChainOptions = (): JSX.Element[] => {
    const options = [];
    for (let i = 0; i < numberOfChains; i++) {
      options.push(
        <Option value={i} key={i}>
          {' '}
          {i}
        </Option>,
      );
    }
    return options;
  };

  return (
    <MainLayout title="Check Transactions">
      <StyledMainContent>
        <StyledSidebar />
        <StyledForm onSubmit={checkTransactions}>
          <StyledSmallField>
            <Select
              leadingText="Chain"
              onChange={(e) => setChainValue(e.target.value)}
              value={inputChainValue}
            >
              {renderChainOptions()}
            </Select>
          </StyledSmallField>
          <StyledMediumField>
            <TextField
              inputProps={{
                placeholder: 'Account Name',
                onChange: (e) =>
                  setAccountValue((e.target as HTMLInputElement).value),
                value: inputAccountValue,
              }}
            />
          </StyledMediumField>
          <StyledFormButton>
            <Button title="Check Transactions">Check Transactions</Button>
          </StyledFormButton>
        </StyledForm>

        {results.length > 0 ? (
          <StyledResultContainer></StyledResultContainer>
        ) : null}
      </StyledMainContent>
    </MainLayout>
  );
};

export default CheckTransactions;
