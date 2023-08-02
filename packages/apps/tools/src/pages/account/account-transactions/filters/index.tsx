import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Grid,
  Heading,
  Input,
  InputWrapper,
  SystemIcon,
} from '@kadena/react-ui';

import { mainContentClass, submitClass } from './styles.css';

import { ChainSelect } from '@/components/Global';
import Routes from '@/constants/routes';
import { useAppContext } from '@/context';
import { useToolbar } from '@/context/layout-context';
import { usePersistentChainID } from '@/hooks';
import Debug from 'debug';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useState } from 'react';

const CheckTransactions: FC = () => {
  const debug = Debug(
    'kadena-transfer:pages:transfer:account-transactions:filters',
  );

  const { t } = useTranslation('common');
  const router = useRouter();
  const { network } = useAppContext();
  const [chainID, onChainSelectChange] = usePersistentChainID();
  const [account, setAccount] = useState<string>('');

  useToolbar([
    {
      title: t('Account Transactions'),
      icon: SystemIcon.Account,
      href: Routes.ACCOUNT_TRANSACTIONS_FILTERS,
    },
  ]);

  async function checkTransactionsEvent(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    debug(checkTransactionsEvent.name);
    try {
      event.preventDefault();

      if (!chainID || !account) return;

      router.pathname = Routes.ACCOUNT_TRANSACTIONS_RESULTS;
      router.query = {
        network,
        chain: chainID,
        account,
      };

      await router.push(router);
    } catch (e) {
      debug(e);
    }
  }

  return (
    <div>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Account')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Transactions')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Filters')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <Box marginBottom="$3" />
      <Heading bold={false} as="h5">
        {t('Account Transaction Filters')}
      </Heading>
      <section className={mainContentClass}>
        <form onSubmit={checkTransactionsEvent}>
          <Card fullWidth>
            <Heading as="h6">Filters</Heading>
            <Box marginBottom="$4" />
            <Grid.Root columns={2}>
              <Grid.Item>
                <ChainSelect
                  onChange={onChainSelectChange}
                  value={chainID}
                  ariaLabel="Select Chain ID"
                />
              </Grid.Item>
              <Grid.Item>
                <InputWrapper label="Account" htmlFor="account">
                  <Input
                    onChange={(e) => setAccount(e.target.value)}
                    id="account"
                    leftIcon={SystemIcon.KIcon}
                  />
                </InputWrapper>
              </Grid.Item>
            </Grid.Root>
          </Card>
          <section className={submitClass}>
            <Button icon="TrailingIcon">{t('Search for transactions')}</Button>
          </section>
        </form>
      </section>
    </div>
  );
};

export default CheckTransactions;
