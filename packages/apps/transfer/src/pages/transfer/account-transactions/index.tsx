import { Button, TextField } from '@kadena/react-components';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { Option, Select } from '@/components/Global';
import { Network } from '@/constants/kadena';
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
import Debug from 'debug';

const CheckTransactions: FC = () => {
  const debug = Debug('kadena-transfer:pages:transfer:account-transactions');

  const { t } = useTranslation('common');
  const router = useRouter();
  const { network, setNetwork } = useAppContext();

  const [chain, setChain] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [results, setResults] = useState<ITransaction[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady) {
      setChain((router.query.chain as string) || '1');
      setAccount((router.query.account as string) || '');

      if (router.query.network) {
        setNetwork(router.query.network as Network);
      }

      getAndSetTransactions(
        router.query.network as Network,
        router.query.chain as string,
        router.query.account as string,
      ).catch((e) => {
        debug(e);
        console.log(e);
      });
    }
  }, [router.isReady, getAndSetTransactions]);

  const numberOfChains = 20;

  async function checkTransactionsEvent(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    debug(checkTransactionsEvent.name);
    try {
      event.preventDefault();

      if (!chain || !account) return;

      router.query = {
        network,
        chain,
        account,
      };

      await router.push(router);

      await getAndSetTransactions(network, chain, account);
    } catch (e) {
      debug(e);
    }
  }

  async function getAndSetTransactions(
    network: Network,
    chain: string,
    account: string,
  ): Promise<void> {
    debug(getAndSetTransactions.name);
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
    debug(renderChainOptions.name);
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
