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

import { SignForm } from '@/components/Partials/transactions/transfer/sign-form';
import { SubmitTransaction } from '@/components/Partials/transactions/transfer/submit-transaction';

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

  const [receiverChainId, setReceiverChainId] = useState<ChainId>(CHAINS[0]);
  const [senderChainId, setSenderChainId] = useState<ChainId>(CHAINS[0]);

  return (
    <section className={containerClass}>
      <Head>
        <title>Kadena Developer Tools - Ledger</title>
      </Head>
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Transactions')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Transfer')}</BreadcrumbsItem>
      </Breadcrumbs>
      <Heading as="h4">{t('Transfer')}</Heading>
      <Stack
        flexDirection="column"
        paddingBlockStart={'md'}
        paddingBlockEnd={'xxxl'}
        gap={'lg'}
      >
        <Notification intent="info" role="alert" isDismissable>
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
        </Notification>

        <SignForm
          onSuccess={onSignSuccess}
          onSenderChainUpdate={setSenderChainId}
          onReceiverChainUpdate={setReceiverChainId}
        />
        <SubmitTransaction
          data={data}
          receiverChainId={receiverChainId}
          senderChainId={senderChainId}
        />
      </Stack>
    </section>
  );
};

export default TransferPage;
