import { ChainwebChainId } from '@kadena/chainweb-node-client';
import { Breadcrumbs, Button, SystemIcon, TextField } from '@kadena/react-ui';

import { ChainSelect } from '@/components/Global';
import { Network } from '@/constants/kadena';
import Routes from '@/constants/routes';
import { useAppContext } from '@/context/app-context';
import { useToolbar } from '@/context/layout-context';
import { usePersistentChainID } from '@/hooks';
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
} from '@/pages/account/account-transactions/styles';
import {
  formStyle,
  mainContentStyle,
} from '@/pages/account/account-transactions/styles.css';
import {
  getTransactions,
  ITransaction,
} from '@/services/accounts/get-transactions';
import { zodResolver } from '@hookform/resolvers/zod';
import Debug from 'debug';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(3).max(256),
});

type FormData = z.infer<typeof schema>;

const CheckTransactions: FC = () => {
  const debug = Debug('kadena-transfer:pages:transfer:account-transactions');

  const { t } = useTranslation('common');
  const router = useRouter();
  const { network, setNetwork } = useAppContext();

  const [account, setAccount] = useState<string>('');
  const [results, setResults] = useState<ITransaction[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [chainID, onChainSelectChange] = usePersistentChainID();

  useToolbar([
    {
      title: t('Account Transaction'),
      icon: SystemIcon.Account,
      href: Routes.ACCOUNT_TRANSACTIONS,
    },
  ]);

  useEffect(() => {
    if (router.isReady) {
      setAccount((router.query.account as string) || '');

      if (router.query.network) {
        setNetwork(router.query.network as Network);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.network, router.query.chain, router.query.account]);

  async function checkTransactionsEvent(data: FormData): Promise<void> {
    debug(checkTransactionsEvent.name);
    try {
      router.query = {
        network,
        account: data.name,
      };

      await router.push(router);

      await getAndSetTransactions(network, chainID, data.name);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: { name: account },
    // @see https://www.react-hook-form.com/faqs/#Howtoinitializeformvalues
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  });

  return (
    <div>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Transfer')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Account Transactions')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <main className={mainContentStyle}>
        <StyledContent>
          <form
            className={formStyle}
            onSubmit={handleSubmit(checkTransactionsEvent)}
          >
            <StyledSmallField>
              <ChainSelect
                onChange={onChainSelectChange}
                value={chainID}
                ariaLabel="Select Chain ID"
              />
            </StyledSmallField>
            <StyledMediumField>
              <TextField
                label={t('Account')}
                status={errors.name ? 'negative' : undefined}
                inputProps={{
                  ...register('name'),
                  id: 'account-input',
                  placeholder: t('Account'),
                  leftIcon: SystemIcon.KIcon,
                }}
                helperText={errors.name?.message ?? ''}
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
    </div>
  );
};

export default CheckTransactions;
