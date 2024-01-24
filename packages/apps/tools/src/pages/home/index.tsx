import DrawerToolbar from '@/components/Common/DrawerToolbar';
import ResourceLinks from '@/components/Global/ResourceLinks';
import { menuData } from '@/constants/side-menu-items';
import { useToolbar } from '@/context/layout-context';
import {
  homeWrapperClass,
  infoBoxStyle,
} from '@/pages/home/styles.css';
import {
  Accordion,
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Card,
  Grid,
  GridItem,
  Heading,
  Stack,
  Table,
} from '@kadena/react-ui';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';

import { linkStyle } from '@/pages/faucet/styles.css';
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
            <a
              className={linkStyle}
              key="faucet-existing-link"
              href="/faucet/existing"
            >
              {t('faucet-existing-link')}
            </a>,
            <a className={linkStyle} key="faucet-new-link" href="/faucet/new">
              {t('faucet-new-link')}
            </a>,
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
              className={linkStyle}
              key="chainweb-transfer-link"
              href="https://transfer.chainweb.com/"
              target="_blank"
              rel="noreferrer"
            >
              {t('chainweb-transfer-link')}
            </a>,
            <a
              className={linkStyle}
              href="https://chainweaver.kadena.network/"
              key="chainweaver-link"
              target="_blank"
              rel="noreferrer"
            >
              {t('chainweaver-link')}
            </a>,
          ]}
        />
      ),
    },
  ];

  useToolbar(menuData);

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
                <div className={infoBoxStyle}>
                  <span>
                    Blockchain transactions are irreversible. If you make a
                    mistake, your coins may not be recoverable. Before you
                    transfer large sums, it is always best to do a small test
                    transaction first and then send those coins back to the
                    sender to verify that the receiver account works as
                    expected.
                  </span>
                </div>
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
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Kadena Tools')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Startpage')}</BreadcrumbsItem>
      </Breadcrumbs>
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
        <Stack flexDirection="column" gap="lg" marginBlockStart="lg">
          <Card fullWidth>
            <Grid columns={2}>
              <GridItem>
                <Heading as="h3" variant="h5">
                  {t('General Links')}
                </Heading>
                <Box marginBlockEnd="md" />
                <ul>
                  <li>
                    <a
                      className={linkStyle}
                      href="https://docs.kadena.io/kadena"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('Overview of Kadena')}
                    </a>
                  </li>
                  <li>
                    <a
                      className={linkStyle}
                      href="https://docs.kadena.io/kadena/kda/manage-kda"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('Manage your KDA')}
                    </a>
                  </li>
                  <li>
                    <a
                      className={linkStyle}
                      href="https://kadena.io/grants/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('Contribute to the network')}
                    </a>
                  </li>
                </ul>
              </GridItem>
              <GridItem>
                <Heading as="h3" variant="h5">
                  {t('Developers Links')}
                </Heading>
                <Box marginBlockEnd="md" />
                <ul>
                  <li>
                    <a
                      className={linkStyle}
                      href="https://docs.kadena.io/build/quickstart"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('Quick start')}
                    </a>
                  </li>
                  <li>
                    <a
                      className={linkStyle}
                      href="https://docs.kadena.io/pact"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('Pact language resources')}
                    </a>
                  </li>
                  <li>
                    <a
                      className={linkStyle}
                      href="https://docs.kadena.io/build/guides/election-dapp-tutorial"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('Build your first dApp')}
                    </a>
                  </li>
                </ul>
              </GridItem>
            </Grid>
          </Card>
          <Card fullWidth>
            <Heading as="h3" variant="h5">
              {t('Frequently Asked Questions')}
            </Heading>
            <Box marginBlockEnd="md" />
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
            <Box as="p" marginBlockEnd="md">
              Changelog with the latest updates to the Kadena Development Tools.
            </Box>
            <Table.Root striped>
              <Table.Body>
                <Table.Tr>
                  <Table.Td>January 31, 2024</Table.Td>
                  <Table.Td>
                    Released version 1.2 of the Tools Website, including the
                    Transactions module, which has a Cross Chain Transfer
                    Tracker & Cross Chain Transfer Finisher.
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>November 30, 2023</Table.Td>
                  <Table.Td>
                    Initial release of the Tools Website, including the Faucet
                    module.
                  </Table.Td>
                </Table.Tr>
              </Table.Body>
            </Table.Root>
          </Card>
        </Stack>
      </div>
    </div>
  );
};

export default Home;
