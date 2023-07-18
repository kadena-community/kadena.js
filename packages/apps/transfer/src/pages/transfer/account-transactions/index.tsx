import { ChainwebChainId } from '@kadena/chainweb-node-client';
import { Button, TextField } from '@kadena/react-ui';

import MainLayout from '@/components/Common/Layout/MainLayout';
import { type OnChainSelectChange, ChainSelect } from '@/components/Global';
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
import React, {
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';

const CheckTransactions: FC = () => {
  const debug = Debug('kadena-transfer:pages:transfer:account-transactions');

  const { t } = useTranslation('common');
  const router = useRouter();
  const { network, setNetwork } = useAppContext();

  const [account, setAccount] = useState<string>('');
  const [results, setResults] = useState<ITransaction[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const { chainID, setChainID } = useAppContext();
  const onChainSelectChange = useCallback<OnChainSelectChange>(
    (chainID) => {
      setChainID(chainID);
    },
    [setChainID],
  );

  useEffect(() => {
    if (router.isReady) {
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
        chainID,
        router.query.account as string,
      ).catch((e) => {
        debug(e);
      });
    }
  }, [router.query.network, router.query.chain, router.query.account]);

  async function checkTransactionsEvent(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    debug(checkTransactionsEvent.name);
    try {
      event.preventDefault();

      if (!chainID || !account) return;

      router.query = {
        network,
        account,
      };

      await router.push(router);

      await getAndSetTransactions(network, chainID, account);
    } catch (e) {
      debug(e);
    }
  }

  async function getAndSetTransactions(
    network: Network,
    chain: ChainwebChainId,
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

  const onAccountInputChange = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >((e) => {
    setAccount(e.target.value);
  }, []);

  return (
    <MainLayout title={t('Account Transactions')}>
      <main className={mainContentStyle}>
        <StyledContent>
          <form className={formStyle} onSubmit={checkTransactionsEvent}>
            <StyledSmallField>
              <ChainSelect onChange={onChainSelectChange} value={chainID} />
            </StyledSmallField>
            <StyledMediumField>
              <TextField
                inputProps={{
                  id: 'account-input',
                  placeholder: t('Account'),
                  onChange: onAccountInputChange,
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
