import {
  AccountNameField,
  ChainSelect,
  NAME_VALIDATION,
} from '@/components/Global';
import Routes from '@/constants/routes';
import { menuData } from '@/constants/side-menu-items';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import { usePersistentChainID } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { MonoKeyboardArrowRight } from '@kadena/react-icons';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  Grid,
  GridItem,
  Heading,
} from '@kadena/kode-ui';
import Debug from 'debug';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { mainContentClass, submitClass } from './styles.css';

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
  const { selectedNetwork: network } = useWalletConnectClient();
  const [chainID, onChainSelectChange] = usePersistentChainID();

  useToolbar(menuData, router.pathname);

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
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Account')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Transactions')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Filters')}</BreadcrumbsItem>
      </Breadcrumbs>
      <Box marginBlockEnd="sm" />
      <Heading as="h5">{t('Account Transaction Filters')}</Heading>
      <section className={mainContentClass}>
        <form onSubmit={handleSubmit(checkTransactionsEvent)}>
          <Card fullWidth>
            <Heading as="h6">Filters</Heading>
            <Box marginBlockEnd="md" />
            <Grid columns={2}>
              <GridItem>
                <ChainSelect
                  onSelectionChange={onChainSelectChange}
                  selectedKey={chainID}
                />
              </GridItem>
              <GridItem>
                <AccountNameField
                  {...register('name')}
                  errorMessage={errors.name?.message}
                  label={t('Account')}
                />
              </GridItem>
            </Grid>
          </Card>
          <section className={submitClass}>
            <Button type="submit" endVisual={<MonoKeyboardArrowRight />}>
              {t('Search for transactions')}
            </Button>
          </section>
        </form>
      </section>
    </div>
  );
};

export default CheckTransactions;
