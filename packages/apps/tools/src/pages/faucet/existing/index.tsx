import type { FormStatus } from '@/components/Global';
import {
  AccountNameField,
  ChainSelect,
  FormStatusNotification,
  NAME_VALIDATION,
} from '@/components/Global';
import { menuData } from '@/constants/side-menu-items';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import { usePersistentChainID } from '@/hooks';
import { fundExistingAccount, pollResult } from '@/services/faucet';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ICommandResult } from '@kadena/chainweb-node-client';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  Heading,
  Notification,
  NotificationHeading,
  Stack,
} from '@kadena/react-ui';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import DrawerToolbar from '@/components/Common/DrawerToolbar';
import { MenuLinkButton } from '@/components/Common/Layout/partials/Sidebar/MenuLinkButton';
import { sidebarLinks } from '@/constants/side-links';
import { notificationLinkStyle } from '@/pages/faucet/new/styles.css';
import { getExplorerLink } from '@/utils/getExplorerLink';
import type { ITransactionDescriptor } from '@kadena/client';
import {
  MonoInfo,
  MonoKeyboardArrowRight,
  MonoLink,
} from '@kadena/react-icons/system';
import Link from 'next/link';
import {
  accountNameContainerClass,
  buttonContainerClass,
  chainSelectContainerClass,
  containerClass,
  explorerLinkStyle,
  infoBoxStyle,
  infoTitleStyle,
  inputContainerClass,
  linkStyle,
  linksBoxStyle,
  notificationContainerStyle,
} from '../styles.css';

const schema = z.object({
  name: NAME_VALIDATION,
});

type FormData = z.infer<typeof schema>;

const AMOUNT_OF_COINS_FUNDED: number = 20;

const isCustomError = (error: unknown): error is ICommandResult => {
  return error !== null && typeof error === 'object' && 'result' in error;
};

interface IFundExistingAccountResponseBody {
  result: {
    status: string;
    error:
      | undefined
      | {
          message: string;
        };
  };
}

const ExistingAccountFaucetPage: FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { selectedNetwork, networksData } = useWalletConnectClient();

  const faqs: Array<{ title: string; body: React.ReactNode }> = [
    {
      title: t('What can I do with the Faucet?'),
      body: (
        <Trans
          i18nKey="common:faucet-description"
          components={[
            <Link
              className={linkStyle}
              href="/faucet/existing"
              key="faucet-existing-link"
            />,
            <Link
              className={linkStyle}
              href="/faucet/new"
              key="faucet-new-link"
            />,
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
              href="https://transfer.chainweb.com/"
              target="_blank"
              rel="noreferrer"
              key="chainweb-transfer-link"
            />,
            <strong key="generate-keypair" />,
            <Link
              className={linkStyle}
              href="https://chainweaver.kadena.network/"
              target="_blank"
              rel="noreferrer"
              key="chainweaver-link"
            />,
          ]}
        />
      ),
    },
  ];

  const [chainID, onChainSelectChange] = usePersistentChainID();

  const [requestStatus, setRequestStatus] = useState<{
    status: FormStatus;
    message?: string;
  }>({ status: 'idle' });

  const [openItem, setOpenItem] = useState<{ item: number } | undefined>(
    undefined,
  );
  const drawerPanelRef = useRef<HTMLElement | null>(null);
  const [requestKey, setRequestKey] = useState<string>('');

  useToolbar(menuData, router.pathname);

  const onFormSubmit = useCallback(
    async (data: FormData) => {
      setRequestStatus({ status: 'processing' });
      setOpenItem(undefined);
      setRequestKey('');

      try {
        const submitResponse = (await fundExistingAccount(
          data.name,
          chainID,
          selectedNetwork,
          networksData,
          AMOUNT_OF_COINS_FUNDED,
        )) as ITransactionDescriptor;

        setRequestKey(submitResponse.requestKey);

        const pollResponse = (await pollResult(
          chainID,
          selectedNetwork,
          networksData,
          submitResponse,
        )) as unknown as IFundExistingAccountResponseBody;

        const error = Object.values(pollResponse).find(
          (response) => response.result.status === 'failure',
        );

        if (error) {
          setRequestStatus({
            status: 'erroneous',
            message: error.result.error?.message || t('An error occurred.'),
          });
          return;
        }

        setRequestStatus({ status: 'successful' });
      } catch (err) {
        let message;

        if (isCustomError(err)) {
          const result = err.result;
          const status = result?.status;
          if (status === 'failure') {
            message = (result.error as { message: string }).message;
          }
        } else if (err instanceof Error) {
          message = err.message;
        } else {
          message = String(err);
        }

        const requestKey = message
          ? message.substring(
              message.indexOf('"') + 1,
              message.lastIndexOf('"'),
            )
          : '';
        setRequestKey(requestKey);

        setRequestStatus({ status: 'erroneous', message });
      }
    },
    [chainID, networksData, selectedNetwork, t],
  );

  const mainnetSelected: boolean = selectedNetwork === 'mainnet01';
  const linkToExplorer = `${getExplorerLink(
    requestKey,
    selectedNetwork,
    networksData,
  )}`;

  const handleOnClickLink = () => {
    setOpenItem(undefined);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <section className={containerClass}>
      <Head>
        <title>Kadena Developer Tools - Faucet</title>
      </Head>
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Faucet')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Fund Existing Account')}</BreadcrumbsItem>
      </Breadcrumbs>
      <Heading as="h4">{t('Add Funds to Existing Account')}</Heading>
      <div className={notificationContainerStyle}>
        {mainnetSelected ? (
          <Notification intent="warning" role="status">
            <NotificationHeading>
              {t('The Faucet is not available on Mainnet')}
            </NotificationHeading>
            <Trans
              i18nKey="common:faucet-unavailable-warning"
              components={[
                <a
                  className={notificationLinkStyle}
                  target={'_blank'}
                  href="https://chainweaver.kadena.network/contracts"
                  rel="noreferrer"
                  key="link-to-module"
                />,
              ]}
            />
          </Notification>
        ) : null}
      </div>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <FormStatusNotification
          status={requestStatus.status}
          statusBodies={{
            successful: t('The coins have been funded to the given account.'),
          }}
          body={requestStatus.message}
        />
        <Stack flexDirection="column" gap="lg">
          <Card fullWidth>
            <Heading as="h5">{t('Account')}</Heading>
            <Box marginBlockEnd="md" />
            <div className={inputContainerClass}>
              <div className={accountNameContainerClass}>
                <AccountNameField
                  {...register('name')}
                  errorMessage={errors.name?.message}
                  label={t('The account name to fund coins to')}
                />
              </div>
              <div className={chainSelectContainerClass}>
                <ChainSelect
                  onSelectionChange={onChainSelectChange}
                  selectedKey={chainID}
                />
              </div>
            </div>
          </Card>
          <div className={buttonContainerClass}>
            <Button
              isLoading={requestStatus.status === 'processing'}
              isDisabled={mainnetSelected}
              endVisual={<MonoKeyboardArrowRight />}
              title={t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
              type="submit"
            >
              {t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
            </Button>
          </div>
        </Stack>

        {requestKey !== '' ? (
          <FormStatusNotification
            status={'processing'}
            title={t('Transaction submitted')}
            body={
              <Trans
                i18nKey="common:link-to-kadena-explorer"
                components={[
                  <Link
                    className={explorerLinkStyle}
                    href={linkToExplorer}
                    target={'_blank'}
                    key={requestKey}
                  >
                    {requestKey}
                  </Link>,
                ]}
              />
            }
          />
        ) : null}
      </form>

      <DrawerToolbar
        ref={drawerPanelRef}
        initialOpenItem={openItem}
        sections={[
          {
            icon: <MonoInfo />,
            title: t('Frequently asked questions'),
            children: (
              <>
                {faqs.map((faq) => (
                  <div className={infoBoxStyle} key={faq.title}>
                    <p className={infoTitleStyle}>{faq.title}</p>
                    <p>{faq.body}</p>
                  </div>
                ))}
              </>
            ),
          },
          {
            icon: <MonoLink />,
            title: t('Resources & Links'),
            children: (
              <div className={linksBoxStyle}>
                {sidebarLinks.map((item, index) => (
                  <MenuLinkButton
                    title={item.title}
                    key={`menu-link-${index}`}
                    href={item.href}
                    active={item.href === router.pathname}
                    target="_blank"
                    onClick={handleOnClickLink}
                  />
                ))}
              </div>
            ),
          },
        ]}
      />
    </section>
  );
};

export default ExistingAccountFaucetPage;
