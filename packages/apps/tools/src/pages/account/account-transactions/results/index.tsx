import DrawerToolbar from '@/components/Common/DrawerToolbar';
import { ProgressBar } from '@/components/Global/ProgressBar';
import type { Network } from '@/constants/kadena';
import Routes from '@/constants/routes';
import { menuData } from '@/constants/side-menu-items';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import type { ITransaction } from '@/services/accounts/get-transactions';
import { getTransactions } from '@/services/accounts/get-transactions';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  ContentHeader,
  Grid,
  GridItem,
  Heading,
  Table,
  Text,
  TrackerCard,
} from '@kadena/react-ui';
import Debug from 'debug';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import {
  filterItemClass,
  headerButtonGroupClass,
  mainContentClass,
} from './styles.css';

const CheckTransactions: FC = () => {
  const debug = Debug(
    'kadena-transfer:pages:transfer:account-transactions:results',
  );

  const { t } = useTranslation('common');
  const router = useRouter();
  const { networksData } = useWalletConnectClient();

  const [results, setResults] = useState<ITransaction[]>([]);
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [transactionDetails, setTransactionDetails] = useState<ITransaction>();

  const transactionDetailsRef = useRef<HTMLElement | null>(null);

  function displayAccountName(accountName: string): string {
    if (accountName.length > 20) {
      return `${accountName.replace(/(\w{4}).*(\w{4})/, '$1****$2')}`;
    }

    return accountName;
  }

  useToolbar(menuData, router.pathname);

  useEffect(() => {
    if (router.isReady) {
      if (
        !router.query.network ||
        !router.query.chain ||
        !router.query.account
      ) {
        router.push(Routes.ACCOUNT_TRANSACTIONS_FILTERS).catch((e) => {
          debug(e);
        });
        return;
      }

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
    if (!chain || !account || !network) return;

    const result = await getTransactions({
      network,
      chain,
      account,
      networksData,
    });

    setResults(result as ITransaction[]);
  }

  async function refreshResultsEvent(): Promise<void> {
    debug(refreshResultsEvent.name);

    setResults([]);

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

  async function resetFiltersEvent(): Promise<void> {
    debug(resetFiltersEvent.name);

    await router.push(Routes.ACCOUNT_TRANSACTIONS_FILTERS);
  }

  const handleOpenTransactionDetails = (result: ITransaction): void => {
    setTransactionDetails(result);
    // @ts-ignore
    transactionDetailsRef.openSection(0);
  };

  return (
    <div className={mainContentClass}>
      <DrawerToolbar
        ref={transactionDetailsRef}
        sections={[
          {
            icon: 'Information',
            title: t('Transaction Details'),
            children: (
              <>
                <TrackerCard
                  labelValues={[
                    {
                      label: 'Sender',
                      value: transactionDetails?.fromAccount,
                      isAccount: true,
                    },
                    {
                      label: 'From chain',
                      value: transactionDetails?.chain,
                    },
                  ]}
                  icon={'QuickStart'}
                />
                <Box marginBlockEnd="md" />
                <ProgressBar
                  checkpoints={[
                    {
                      title: 'Initiated transaction',
                      status: 'complete',
                    },
                    {
                      title: 'Transaction complete',
                      status: 'complete',
                    },
                  ]}
                />
                <Box marginBlockEnd="xs" />
                <TrackerCard
                  labelValues={[
                    {
                      label: 'Receiver',
                      value: transactionDetails?.fromAccount,
                      isAccount: true,
                    },
                    {
                      label: 'to chain',
                      value:
                        transactionDetails?.crossChainId ||
                        transactionDetails?.chain,
                    },
                  ]}
                  icon={'ReceiverInactive'}
                />
              </>
            ),
          },
        ]}
      />
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Account')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Transactions')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Results')}</BreadcrumbsItem>
      </Breadcrumbs>
      <Box marginBlockEnd="sm" />
      <Grid columns={2}>
        <GridItem>
          <Heading bold={false} as="h5">
            {t('Account Transactions')}
          </Heading>
        </GridItem>
        <GridItem>
          <div className={headerButtonGroupClass}>
            <Button icon="TrashCan" onClick={resetFiltersEvent}>
              {t('Reset all filters')}
            </Button>
            <Button icon="Refresh" onClick={refreshResultsEvent}>
              {t('Reload')}
            </Button>
          </div>
        </GridItem>
      </Grid>
      <Box marginBlockEnd="xxs" />
      <Text color="emphasize">
        {t('Filtered by')}:
        {router.query.chain ? (
          <div className={filterItemClass}>Chain: {router.query.chain}</div>
        ) : (
          ''
        )}
        {router.query.account ? (
          <div className={filterItemClass}>
            {displayAccountName(router.query.account as string)}
          </div>
        ) : (
          ''
        )}
        {router.query.network ? (
          <div className={filterItemClass}>{router.query.network}</div>
        ) : (
          ''
        )}
      </Text>
      <Box marginBlockEnd="xxxl" />

      {loadingState ? 'LOADING' : ''}

      <Grid columns={2}>
        <GridItem>
          <ContentHeader
            heading={t('Incoming transactions')}
            icon={'ArrowCollapseDown'}
            description="This table is listing all the incoming transaction sorted by date."
          />
          <Box marginBlockEnd="xxxl" />
          <Table.Root>
            <Table.Head>
              <Table.Tr>
                <Table.Th>{t('Date Time')}</Table.Th>
                <Table.Th>{t('Amount')}</Table.Th>
                <Table.Th>{t('Sender')}</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Head>
            <Table.Body>
              {results.map((result, index) => {
                const isIncomming = result.toAccount === router.query.account;

                if (!isIncomming) {
                  return <Table.Tr key={index}></Table.Tr>;
                }

                return (
                  <Table.Tr
                    key={index}
                    onClick={() => handleOpenTransactionDetails(result)}
                  >
                    <Table.Td>
                      {new Date(result.blockTime).toLocaleString()}
                    </Table.Td>
                    <Table.Td>{result.amount}</Table.Td>
                    <Table.Td>
                      {displayAccountName(result.fromAccount as string)}
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Body>
          </Table.Root>
        </GridItem>
        <GridItem>
          <ContentHeader
            heading={t('Outgoing transactions')}
            icon={'ArrowExpandUp'}
            description="This table is listing all the outgoing transaction sorted by date."
          />
          <Box marginBlockEnd="xxxl" />
          <Table.Root>
            <Table.Head>
              <Table.Tr>
                <Table.Th>{t('Date Time')}</Table.Th>
                <Table.Th>{t('Amount')}</Table.Th>
                <Table.Th>{t('Receiver')}</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Head>
            <Table.Body>
              {results.map((result, index) => {
                const isOutgoing = result.fromAccount === router.query.account;

                if (!isOutgoing) {
                  return <Table.Tr key={index}></Table.Tr>;
                }

                return (
                  <Table.Tr
                    key={index}
                    onClick={() => handleOpenTransactionDetails(result)}
                  >
                    <Table.Td>
                      {new Date(result.blockTime).toLocaleString()}
                    </Table.Td>
                    <Table.Td>{result.amount}</Table.Td>
                    <Table.Td>
                      {displayAccountName(result.toAccount as string)}
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Body>
          </Table.Root>
        </GridItem>
      </Grid>
    </div>
  );
};

export default CheckTransactions;
