import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Grid,
  Heading,
  SystemIcon,
} from '@kadena/react-ui';

import { mainContentClass, submitClass } from './styles.css';

import { ChainSelect } from '@/components/Global';
import AccountNameField, {
  NAME_VALIDATION,
} from '@/components/Global/AccountNameField';
import Routes from '@/constants/routes';
import { useAppContext } from '@/context';
import { useToolbar } from '@/context/layout-context';
import { usePersistentChainID } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import Debug from 'debug';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const schema = z.object({
  name: NAME_VALIDATION,
});

type FormData = z.infer<typeof schema>;

const CheckTransactions: FC = () => {
  const debug = Debug(
    'kadena-transfer:pages:transfer:account-transactions:filters',
  );

  const { t } = useTranslation('common');
  const router = useRouter();
  const { network } = useAppContext();
  const [chainID, onChainSelectChange] = usePersistentChainID();

  useToolbar([
    {
      title: t('Account Transactions'),
      icon: SystemIcon.Account,
      href: Routes.ACCOUNT_TRANSACTIONS_FILTERS,
    },
  ]);

  async function checkTransactionsEvent(data: FormData): Promise<void> {
    debug(checkTransactionsEvent.name);
    try {
      if (!chainID || !data.name) return;

      router.pathname = Routes.ACCOUNT_TRANSACTIONS_RESULTS;
      router.query = {
        network,
        chain: chainID,
        account: data.name,
      };

      await router.push(router);
    } catch (e) {
      debug(e);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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
        <form onSubmit={handleSubmit(checkTransactionsEvent)}>
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
                <AccountNameField
                  inputProps={register('name')}
                  error={errors.name}
                  label={t('Account')}
                />
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
