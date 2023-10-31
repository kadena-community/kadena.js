import DrawerToolbar from '@/components/Common/DrawerToolbar';
import ResourceLinks from '@/components/Global/ResourceLinks';
import Routes from '@/constants/routes';
import { useToolbar } from '@/context/layout-context';
import {
  helpCenterButtonClass,
  homeWrapperClass,
} from '@/pages/home/styles.css';
import {
  Accordion,
  Box,
  Breadcrumbs,
  Card,
  Grid,
  Heading,
  Table,
} from '@kadena/react-ui';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Link from 'next/link';

import type { FC } from 'react';
import React, { useRef } from 'react';

const Home: FC = () => {
  const helpCenterRef = useRef<HTMLElement | null>(null);
  const { t } = useTranslation('common');

  const faqs: Array<{ title: string; body: React.ReactNode }> = [
    {
      title: t('What can I do with the Faucet?'),
      body: (
        <Trans
          i18nKey="common:faucet-description"
          components={[
            <Link href="/faucet/existing" key="faucet-existing-link" />,
            <Link href="/faucet/new" key="faucet-new-link" />,
          ]}
        />
      ),
    },
    {
      title: t('How do I generate a key pair?'),
      body: (
        <Trans
          i18nKey="common:how-to-keypair"
          components={[
            <a
              href="https://transfer.chainweb.com/"
              target="_blank"
              rel="noreferrer"
              key="chainweb-transfer-link"
            />,
            <strong key="generate-keypair" />,
            <a
              href="https://kadena.io/chainweaver-tos/"
              target="_blank"
              rel="noreferrer"
              key="chainweaver-link"
            />,
          ]}
        />
      ),
    },
  ];

  useToolbar([
    {
      title: t('Faucet'),
      icon: 'Earth',
      href: Routes.FAUCET_NEW,
    },
    {
      title: t('Transactions'),
      icon: 'Transition',
      href: Routes.CROSS_CHAIN_TRANSFER_TRACKER,
    },
    {
      title: t('Account'),
      icon: 'Account',
      href: Routes.ACCOUNT_TRANSACTIONS,
    },
  ]);

  const handleOpenHelpCenter = (): void => {
    // @ts-ignore
    helpCenterRef.openSection(0);
  };

  return (
    <div className={homeWrapperClass}>
      <Head>
        <title>{t('Kadena Developer Tools')}</title>
      </Head>
      <DrawerToolbar
        ref={helpCenterRef}
        sections={[
          {
            icon: 'HelpCircle',
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
      <div style={{ width: '680px' }}>
        <Heading bold={false} variant="h3">
          {t('Kadena Developer Tools')}
        </Heading>
        <Heading bold={false} as="h2" variant="h5" color="default">
          {t(
            "We're constantly adding new Developer Tools to make it easier for our builders to utilize all Kadena has to offer.",
          )}
        </Heading>
        <Card fullWidth>
          <Grid.Root columns={2}>
            <Grid.Item>
              <Heading as="h3" variant="h5">
                {t('General Links')}
              </Heading>
              <Box marginBottom="$4" />
              <ul>
                <li>
                  <a
                    href="https://docs.kadena.io/kadena"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('Overview of Kadena')}
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.kadena.io/kadena/kda/manage-kda"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('Manage your KDA')}
                  </a>
                </li>
                <li>
                  <a
                    href="https://kadena.io/grants/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('Contribute to the network')}
                  </a>
                </li>
              </ul>
            </Grid.Item>
            <Grid.Item>
              <Heading as="h3" variant="h5">
                {t('Developers Links')}
              </Heading>
              <Box marginBottom="$4" />
              <ul>
                <li>
                  <a
                    href="https://docs.kadena.io/build/quickstart"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('Quick start')}
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.kadena.io/pact"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('Pact language resources')}
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.kadena.io/build/guides/election-dapp-tutorial"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('Build your first dApp')}
                  </a>
                </li>
              </ul>
            </Grid.Item>
          </Grid.Root>
        </Card>
        <Card fullWidth>
          <Heading as="h3" variant="h5">
            {t('Frequently Asked Questions')}
          </Heading>
          <Box marginBottom="$4" />
          <Accordion.Root>
            {faqs.map((faq) => (
              <Accordion.Section title={faq.title} key={faq.title}>
                {faq.body}
              </Accordion.Section>
            ))}
          </Accordion.Root>
        </Card>
        <Card fullWidth>
          <Heading as="h3" variant="h5">
            Latest Updates
          </Heading>
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
