import {
  Breadcrumbs,
  Card,
  Heading,
  SystemIcon,
  Table,
} from '@kadena/react-ui';

import HelpCenter from './HelpCenter';

import Routes from '@/constants/routes';
import { useToolbar } from '@/context/layout-context';
import { homeWrapperClass } from '@/pages/home/styles.css';
import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';

const Home: FC = () => {
  const { t } = useTranslation('common');
  useToolbar([
    {
      title: t('Faucet'),
      icon: SystemIcon.Earth,
      href: Routes.FAUCET_EXISTING,
    },
    {
      title: t('Transactions'),
      icon: SystemIcon.Transition,
      href: Routes.CROSS_CHAIN_TRANSFER_TRACKER,
    },
    {
      title: t('Account'),
      icon: SystemIcon.Account,
      href: Routes.ACCOUNT_TRANSACTIONS,
    },
  ]);

  return (
    <div className={homeWrapperClass}>
      <HelpCenter />
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Kadena Tools')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Startpage')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <br />
      <Heading bold={false} variant="h3">
        Kadena Developer Tools
      </Heading>
      <Heading bold={false} variant="h4" color="default">
        Explore the developer tools platform.
      </Heading>
      <div style={{ width: '680px' }}>
        <Card fullWidth>
          <Heading variant="h5">Latest Updates</Heading>
          <p>
            Changelog with the latest updates to the Kadena Development Tools.
          </p>
          <br />
          <Table.Root>
            <Table.Body>
              <Table.Tr>
                <Table.Td>July 28, 2023</Table.Td>
                <Table.Td>Added the Account Transactions Overview.</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>July 10, 2023</Table.Td>
                <Table.Td>Released version 1 of the Tools Website.</Table.Td>
              </Table.Tr>
            </Table.Body>
          </Table.Root>
        </Card>
      </div>
    </div>
  );
};

export default Home;
