import { Button, TextField } from '@kadena/react-components';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { Option, Select } from '@/components/Global';
import { useAppContext } from '@/context/app-context';
import {
  StyledContent,
  StyledForm,
  StyledFormButton,
  StyledMainContent,
  StyledMediumField,
  StyledResultContainer,
  StyledSmallField,
  StyledTable,
  StyledTableBody,
  StyledTableData,
  StyledTableHead,
  StyledTableHeader,
  StyledTableRow,
} from '@/pages/transfer/account-transactions/styles';
import {
  getTransactions,
  ITransaction,
} from '@/services/accounts/get-transactions';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useEffect, useState } from 'react';

const CheckTransactions: FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { network } = useAppContext();

  const [chain, setChain] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [results, setResults] = useState<ITransaction[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  useEffect(() => {
    if (Boolean(router.query.chain) && Boolean(router.query.account)) {
      setChain((router.query.chain as string) || '1');
      setAccount((router.query.account as string) || '');

      setTransactions(
        router.query.chain as string,
        router.query.account as string,
      ).catch((e) => console.log(e));
    }
  }, [router.query.chain, router.query.account, setTransactions]);

  const numberOfChains = 20;

  async function checkTransactionsEvent(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    try {
      event.preventDefault();

      if (!chain || !account) return;

      router.query = {
        chain,
        account,
      };

      await router.push(router);

      await setTransactions(chain, account);
    } catch (e) {
      console.log(e);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function setTransactions(chain: string, account: string): Promise<void> {
    if (!chain || !account) return;

    const result = await getTransactions({
      network,
      chain,
      account,
    });

    setHasSearched(true);

    setResults(result);
  }

  function renderChainOptions(): JSX.Element[] {
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
  }

  return (
    <MainLayout title={t('Account Transactions')}>
      <StyledMainContent>
        <StyledContent>
          <StyledForm onSubmit={checkTransactionsEvent}>
            <StyledSmallField>
              <Select
                leadingText={t('Chain')}
                onChange={(e) => setChain(e.target.value)}
                value={chain}
              >
                {renderChainOptions()}
              </Select>
            </StyledSmallField>
            <StyledMediumField>
              <TextField
                inputProps={{
                  placeholder: t('Account'),
                  onChange: (e) =>
                    setAccount((e.target as HTMLInputElement).value),
                  value: account,
                }}
              />
            </StyledMediumField>
            <StyledFormButton>
              <Button title={t('Check Transactions')}>
                {t('Check Transactions')}
              </Button>
            </StyledFormButton>
          </StyledForm>

          <StyledResultContainer>
            {results.length ? (
              <StyledTable>
                <StyledTableHead>
                  <StyledTableRow>
                    <StyledTableHeader>{t('Date')}</StyledTableHeader>
                    <StyledTableHeader>{t('Account')}</StyledTableHeader>
                    <StyledTableHeader>{t('Request Key')}</StyledTableHeader>
                    <StyledTableHeader>{t('Cross Chain')}</StyledTableHeader>
                    <StyledTableHeader>{t('Amount')}</StyledTableHeader>
                  </StyledTableRow>
                </StyledTableHead>
                <StyledTableBody>
                  {results.map((result, index) => {
                    console.log(result);

                    const accountText =
                      result.fromAccount === account
                        ? result.toAccount
                        : result.fromAccount;

                    const delimiter =
                      result.fromAccount === account ? '-' : '+';

                    return (
                      <StyledTableRow key={index}>
                        <StyledTableData>
                          {new Date(result.blockTime).toLocaleString()}
                        </StyledTableData>
                        <StyledTableData>{accountText}</StyledTableData>
                        <StyledTableData>{result.requestKey}</StyledTableData>
                        <StyledTableData>{result.crossChainId}</StyledTableData>
                        <StyledTableData>
                          {delimiter}
                          {result.amount}
                        </StyledTableData>
                      </StyledTableRow>
                    );
                  })}
                </StyledTableBody>
              </StyledTable>
            ) : hasSearched ? (
              <span>{t('No Results')}...</span>
            ) : null}
          </StyledResultContainer>
        </StyledContent>
      </StyledMainContent>
    </MainLayout>
  );
};

export default CheckTransactions;
