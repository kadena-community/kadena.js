import DrawerToolbar from '@/components/Common/DrawerToolbar';
import ResourceLinks from '@/components/Global/ResourceLinks';
import { menuData } from '@/constants/side-menu-items';
import { useToolbar } from '@/context/layout-context';
import { homeWrapperClass, infoBoxStyle } from '@/pages/home/styles.css';
import {
  Accordion,
  AccordionItem,
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Card,
  Cell,
  Column,
  Grid,
  GridItem,
  Heading,
  Row,
  Stack,
  Table,
  TableBody,
  TableHeader,
} from '@kadena/react-ui';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';

import { linkStyle } from '@/pages/faucet/styles.css';
import { MonoHelp } from '@kadena/react-icons/system';
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
            <Link
              className={linkStyle}
              key="faucet-existing-link"
              href="/faucet/existing"
            >
              {t('faucet-existing-link')}
            </Link>,
            <Link
              className={linkStyle}
              key="faucet-new-link"
              href="/faucet/new"
            >
              {t('faucet-new-link')}
            </Link>,
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
            <Link
              className={linkStyle}
              key="chainweb-transfer-link"
              href="https://transfer.chainweb.com/"
              target="_blank"
              rel="noreferrer"
            >
              {t('chainweb-transfer-link')}
            </Link>,
            <Link
              className={linkStyle}
              href="https://chainweaver.kadena.network/"
              key="chainweaver-link"
              target="_blank"
              rel="noreferrer"
            >
              {t('chainweaver-link')}
            </Link>,
          ]}
        />
      ),
    },
    {
      title: t('How do I create an account?'),
      body: (
        <Trans
          i18nKey="common:how-to-keys-accounts"
          components={[
            <Link
              className={linkStyle}
              key="chainweb-transfer-link"
              href="https://chainweaver.kadena.network/"
              target="_blank"
              rel="noreferrer"
            />,
          ]}
        />
      ),
    },
    {
      title: t('How do I select a network and chain?'),
      body: (
        <Trans
          i18nKey="common:how-to-networks"
          components={[
            <Link
              className={linkStyle}
              key="chainweb-transfer-link"
              href="https://docs.kadena.io/build/guides/election-dapp-tutorial/start-a-local-blockchain"
              target="_blank"
              rel="noreferrer"
            />,
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
            icon: <MonoHelp />,
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
                    {
                      title: 'Pact Language Resources',
                      href: 'https://www.kadena.io/pact',
                    },
                    {
                      title: 'Whitepapers',
                      href: 'https://www.kadena.io/whitepapers',
                    },
                    {
                      title: 'Kadena Client',
                      href: 'https://www.npmjs.com/package/@kadena/client',
                    },
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
        <Heading variant="h3">{t('Kadena Developer Tools')}</Heading>
        <Heading as="h2" variant="h5">
          <p>
            {t(
              'Set up your development environment and get the latest Developer Tools to build your application on the Kadena network.',
            )}
          </p>
          <p>
            {t('Select a network to get started or explore the documentation.')}
          </p>
        </Heading>
        <Stack flexDirection="column" gap="lg" marginBlockStart="lg">
          <Card fullWidth>
            <Grid columns={2}>
              <GridItem>
                <Heading as="h3" variant="h5">
                  {t('New to Kadena')}
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
                      {t('Welcome to Kadena')}
                    </a>
                  </li>
                  <li>
                    <a
                      className={linkStyle}
                      href="https://docs.kadena.io/kadena/why-kadena"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('Why Kadena?')}
                    </a>
                  </li>
                  <li>
                    <a
                      className={linkStyle}
                      href="https://docs.kadena.io/blogchain/2022/the-story-of-kadenas-proof-of-work-blockchain-2022-10-13"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('Proof of work consensus')}
                    </a>
                  </li>
                  <li>
                    <a
                      className={linkStyle}
                      href="https://docs.kadena.io/kadena/kda/kda-concepts"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('Accounts and keys')}
                    </a>
                  </li>
                  <li>
                    <a
                      className={linkStyle}
                      href="https://docs.kadena.io/kadena/wallets/chainweaver#networksh1378111525"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('Networks and nodes')}
                    </a>
                  </li>
                </ul>
              </GridItem>
              <GridItem>
                <Heading as="h3" variant="h5">
                  {t('For Developers')}
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
                      {t('Deploy your first contract')}
                    </a>
                  </li>
                  <li>
                    <a
                      className={linkStyle}
                      href="https://docs.kadena.io/pact"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('Get started with Pact')}
                    </a>
                  </li>
                  <li>
                    <a
                      className={linkStyle}
                      href="https://docs.kadena.io/marmalade"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('NFTs and Marmalade')}
                    </a>
                  </li>
                  <li>
                    <a
                      className={linkStyle}
                      href="https://docs.kadena.io/kadena/client"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('Kadena client')}
                    </a>
                  </li>
                  <li>
                    <a
                      className={linkStyle}
                      href="https://docs.kadena.io/pact/reference/functions"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('Pact functions')}
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
            <Accordion items={faqs} selectionMode="multiple">
              {(faq) => (
                <AccordionItem title={faq.title} key={faq.title}>
                  {faq.body}
                </AccordionItem>
              )}
            </Accordion>
          </Card>
          <Card fullWidth>
            <Heading as="h3" variant="h5">
              Latest Updates
            </Heading>
            <Box as="p" marginBlockEnd="md">
              Changelog with the latest updates to the Kadena Development Tools.
            </Box>

            <Table isStriped>
              <TableHeader>
                <Column>Date</Column>
                <Column>Update</Column>
              </TableHeader>
              <TableBody>
                <Row>
                  <Cell>January 31, 2024</Cell>
                  <Cell>
                    Released version 1.2 of the Tools Website, including the
                    Transactions module, which has a Cross Chain Transfer
                    Tracker & Cross Chain Transfer Finisher.
                  </Cell>
                </Row>
                <Row>
                  <Cell>November 30, 2023</Cell>
                  <Cell>
                    Initial release of the Tools Website, including the Faucet
                    module.
                  </Cell>
                </Row>
              </TableBody>
            </Table>
          </Card>
        </Stack>
      </div>
    </div>
  );
};

export default Home;
