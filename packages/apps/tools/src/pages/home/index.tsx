import {
  Breadcrumbs,
  Card,
  Heading,
  SystemIcon,
  Table,
} from '@kadena/react-ui';

import DrawerToolbar from '@/components/Common/DrawerToolbar';
import ResourceLinks from '@/components/Global/ResourceLinks';
import Routes from '@/constants/routes';
import { useToolbar } from '@/context/layout-context';
import {
  helpCenterButtonClass,
  homeWrapperClass,
} from '@/pages/home/styles.css';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useRef } from 'react';

const Home: FC = () => {
  const helpCenterRef = useRef<HTMLElement | null>(null);
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

  const handleOpenHelpCenter = (): void => {
    // @ts-ignore
    helpCenterRef.openSection(0);
  };

  return (
    <div className={homeWrapperClass}>
      <DrawerToolbar
        ref={helpCenterRef}
        sections={[
          {
            icon: SystemIcon.HelpCircle,
            title: t('Help Center'),
            children: (
              <>
                <p>
                  Blockchain transactions are irreversible. If you make a
                  mistake, your coins may not be recoverable. Before you
                  transfer large sums, it is always best to do a small test
                  transaction first and then send those coins back to the sender
                  to verify that the receiver account works as expected.
                </p>
                <ResourceLinks
                  links={[
                    { title: 'Pact Language Resources', href: '#' },
                    { title: 'Whitepaper', href: '#' },
                    { title: 'KadenaJs', href: '#' },
                  ]}
                />
              </>
            ),
          },
        ]}
      />
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
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            If you're seeking Help click{' '}
            <span
              className={helpCenterButtonClass}
              onClick={handleOpenHelpCenter}
            >
              HERE
            </span>
          </p>
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
