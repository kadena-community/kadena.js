import { menuData } from '@/constants/side-menu-items';
import { useToolbar } from '@/context/layout-context';

import {
  Breadcrumbs,
  BreadcrumbsItem,
  Heading,
  Notification,
  Stack,
} from '@kadena/react-ui';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';

import { CHAINS } from '@kadena/chainweb-node-client';
import type { ChainId } from '@kadena/types';
import type { PactCommandObject } from '@ledgerhq/hw-app-kda';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { containerClass } from '../styles.css';
import { notificationLinkStyle } from './styles.css';

import { RightInfoSidebar } from '@/components/Partials/transactions/transfer/right-info-sidebar';
import { SignForm } from '@/components/Partials/transactions/transfer/sign-form';
import { SubmitTransaction } from '@/components/Partials/transactions/transfer/submit-transaction';
import useIsLedgerLibSupported from '@/hooks/use-is-ledger-lib-supported';
import { MonoHelp } from '@kadena/react-icons/system';

const TransferPage = () => {
  const router = useRouter();
  useToolbar(menuData, router.pathname);
  const { t } = useTranslation('common');

  const [data, setData] = useState<PactCommandObject | null>(null);
  const onSignSuccess = useCallback<
    (pactCommandObject: PactCommandObject) => void
  >((pactCommandObject) => {
    setData(pactCommandObject);
  }, []);

  const browserSupported = useIsLedgerLibSupported();

  const [receiverChainId, setReceiverChainId] = useState<ChainId>(CHAINS[0]);
  const [senderChainId, setSenderChainId] = useState<ChainId>(CHAINS[0]);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const helpInfoSections = [
    {
      question: 'What was my key index, again?',
      content:
        'In case you forget which key index corresponds to which account, the Search Ledger Keys tool allows you to search your ledger for a specific key',
    },
    {
      question: 'What does legacy mode toggle do?',
      content:
        'If you used the “Change Ledger Account” feature in October 2023, you will be able to access your account keys using the “Legacy Mode” toggle that is now found next to the “Key Index” input field.',
    },
    {
      question: 'Some wise precautions when signing with a Ledger',
      content:
        'When signing on a Ledger device, you should always check the details of the transaction carefully. If everything is in order, click “Confirm” to sign the transaction. After this, the Transfer Tool should update its interface to show the transaction',
    },
  ];

  const [isLedger, setIsLedger] = useState<boolean>(false);
  const showNotSupported = !browserSupported && isLedger;

  const openSidebarMenu = () => setSidebarOpen(!sidebarOpen);

  return (
    <section className={containerClass}>
      <Head>
        <title>Kadena Developer Tools - Ledger</title>
      </Head>
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Transactions')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Transfer')}</BreadcrumbsItem>
      </Breadcrumbs>
      <Stack justifyContent={'space-between'} alignItems={'center'}>
        <Heading as="h4">{t('Transfer')}</Heading>
        <MonoHelp onClick={openSidebarMenu} cursor={'pointer'} />
      </Stack>

      <Stack
        flexDirection="column"
        paddingBlockStart={'md'}
        paddingBlockEnd={'xxxl'}
        gap={'lg'}
      >
        {showNotSupported ? (
          <Notification
            intent={'negative'}
            role={'alert'}
            type="inlineStacked"
            isDismissable
          >
            <div>
              <Trans
                i18nKey="common:ledger-error-notification"
                components={[
                  <a
                    className={notificationLinkStyle}
                    target={'_blank'}
                    href="https://caniuse.com/?search=webhid"
                    rel="noreferrer"
                    key="link-to-ledger-docs"
                  />,
                ]}
              />
            </div>
          </Notification>
        ) : null}
        <Notification
          intent="info"
          role="alert"
          type="inlineStacked"
          isDismissable
        >
          <div>
            <Trans
              i18nKey="common:ledger-info-notification"
              components={[
                <a
                  className={notificationLinkStyle}
                  target={'_blank'}
                  href="https://support.ledger.com/hc/en-us/articles/7415959614109?docs=true"
                  rel="noreferrer"
                  key="link-to-ledger-docs"
                />,
              ]}
            />
          </div>
        </Notification>

        <SignForm
          onSuccess={onSignSuccess}
          onSenderChainUpdate={setSenderChainId}
          onReceiverChainUpdate={setReceiverChainId}
          setIsLedger={setIsLedger}
          onReset={() => {
            setData(null);
          }}
        />
        <SubmitTransaction
          key={data?.hash}
          data={data}
          receiverChainId={receiverChainId}
          senderChainId={senderChainId}
        />
      </Stack>

      <RightInfoSidebar
        infoSections={helpInfoSections}
        sidebarOpen={sidebarOpen}
      />
    </section>
  );
};

export default TransferPage;
