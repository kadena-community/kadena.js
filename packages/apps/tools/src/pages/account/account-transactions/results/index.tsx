import { ChainwebChainId } from '@kadena/chainweb-node-client';
import {
  Breadcrumbs,
  Heading,
  SystemIcon,
  Table,
} from '@kadena/react-ui';

import { Network } from '@/constants/kadena';
import Routes from '@/constants/routes';
import { useToolbar } from '@/context/layout-context';
import {
  getTransactions,
  ITransaction,
} from '@/services/accounts/get-transactions';
import Debug from 'debug';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, {
  FC,
  useEffect,
  useState,
} from 'react';

const CheckTransactions: FC = () => {
  const debug = Debug(
    'kadena-transfer:pages:transfer:account-transactions:results',
  );

  const { t } = useTranslation('common');
  const router = useRouter();

  const [results, setResults] = useState<ITransaction[]>([]);
  const [loadingState, setLoadingState] = useState<boolean>(true);

  useToolbar([
    {
      title: t('Account Transaction'),
      icon: SystemIcon.Account,
      href: Routes.ACCOUNT_TRANSACTIONS,
    },
  ]);

  useEffect(() => {
    if (router.isReady) {
      getAndSetTransactions(
        router.query.network as Network,
        router.query.chain as ChainwebChainId,
        router.query.account as string,
      )
        .catch((e) => {
          debug(e);
        })
        .finally(() => {
          setLoadingState(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

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

    setResults(result);
  }

  async function refreshResultsEvent(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    debug(refreshResultsEvent.name);

    event.preventDefault();

    getAndSetTransactions(
      router.query.network as Network,
      router.query.chain as ChainwebChainId,
      router.query.account as string,
    )
      .catch((e) => {
        debug(e);
      })
      .finally(() => {
        setLoadingState(false);
      });
  }

  return (
    <div>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Account')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Transactions')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Results')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <br />
      <Heading bold={false} as="h5">
        {t('Account Transactions')}
      </Heading>

      <Table.Root>
        <Table.Head>
          <Table.Tr>
            <Table.Th>{t('Date Time')}</Table.Th>
            <Table.Th>{t('Amount')}</Table.Th>
            <Table.Th>{t('Sender')}</Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          <Table.Tr>
            <Table.Td>
            </Table.Td>
          </Table.Tr>
        </Table.Body>
      </Table.Root>

      {/* <StyledContent>
        <form className={formStyle} onSubmit={checkTransactionsEvent}>
          <StyledSmallField>
            <ChainSelect
              onChange={onChainSelectChange}
              value={chainID}
              ariaLabel="Select Chain ID"
            />
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
            <Button title={t('Check Transactions')}>
              {t('Check Transactions')}
            </Button>
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

                  const delimiter = result.fromAccount === account ? '-' : '+';

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
      </StyledContent> */}
    </div>
  );
};

export default CheckTransactions;
