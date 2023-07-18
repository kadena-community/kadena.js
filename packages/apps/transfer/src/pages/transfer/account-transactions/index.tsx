import { Button, TextField } from '@kadena/react-ui';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { Option, Select } from '@/components/Global';
import { Network } from '@/constants/kadena';
import { useAppContext } from '@/context/app-context';
import {
  StyledContent,
  StyledFormButton,
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
  formStyle,
  mainContentStyle,
} from '@/pages/transfer/account-transactions/styles.css';
import {
  getTransactions,
  ITransaction,
} from '@/services/accounts/get-transactions';
import Debug from 'debug';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useEffect, useState } from 'react';

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
    }
  }, [router.isReady]);

  useEffect(() => {
    if (router.isReady) {
      getAndSetTransactions(
        router.query.network as Network,
        router.query.chain as string,
        router.query.account as string,
      ).catch((e) => {
        debug(e);
      });
    }
  }, [router.query.network, router.query.chain, router.query.account]);

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
      <main className={mainContentStyle}>
        <StyledContent>
          <form className={formStyle} onSubmit={checkTransactionsEvent}>
            <StyledSmallField>
              <Select
                leadingText={t('Chain')}
                onChange={(e: any) => setChain(e.target.value)}
                value={chain}
              >
                {renderChainOptions()}
              </Select>
            </StyledSmallField>
            <StyledMediumField>
              <TextField
                inputProps={{
                  id: 'account-input',
                  placeholder: t('Account'),
                  onChange: (e: any) =>
                    setAccount((e.target as HTMLInputElement).value),
                  value: account,
                }}
              />
            </StyledMediumField>
            <StyledFormButton>
              <Button.Root title={t('Check Transactions')}>
                {t('Check Transactions')}
              </Button.Root>
            </StyledFormButton>
          </form>

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
      </main>
    </MainLayout>
  );
};

export default CheckTransactions;
