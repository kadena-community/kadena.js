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

import {
  hoverTagContainerStyle,
  notificationContentStyle,
  notificationLinkStyle,
  pubKeysContainerStyle,
} from './styles.css';

import {
  accountNameContainerClass,
  buttonContainerClass,
  chainSelectContainerClass,
  containerClass,
  explorerLinkStyle,
  infoBoxStyle,
  infoTitleStyle,
  inputContainerClass,
  linksBoxStyle,
  linkStyle,
  notificationContainerStyle,
} from '../styles.css';

import DrawerToolbar from '@/components/Common/DrawerToolbar';
import { MenuLinkButton } from '@/components/Common/Layout/partials/Sidebar/MenuLinkButton';
import type { FormStatus, PredKey } from '@/components/Global';
import {
  AccountHoverTag,
  AccountNameField,
  ChainSelect,
  FormStatusNotification,
  HoverTag,
  PredKeysSelect,
  PublicKeyField,
} from '@/components/Global';
import { sidebarLinks } from '@/constants/side-links';
import { menuData } from '@/constants/side-menu-items';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import { usePersistentChainID } from '@/hooks';
import { pollResult } from '@/services/faucet';
import { createPrincipal } from '@/services/faucet/create-principal';
import { fundCreateNewAccount } from '@/services/faucet/fund-create-new';
import { validatePublicKey } from '@/services/utils/utils';
import { getExplorerLink } from '@/utils/getExplorerLink';
import { stripAccountPrefix } from '@/utils/string';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ITransactionDescriptor } from '@kadena/client';
import {
  MonoAdd,
  MonoContentCopy,
  MonoDelete,
  MonoInfo,
  MonoKeyboardArrowRight,
  MonoLink,
} from '@kadena/react-icons/system';
import { useQuery } from '@tanstack/react-query';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

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

const AMOUNT_OF_COINS_FUNDED: number = 20;
const isCustomError = (error: unknown): error is ICommandResult => {
  return error !== null && typeof error === 'object' && 'result' in error;
};

const schema = z.object({
  name: z.string(),
  pubKey: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const NewAccountFaucetPage: FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { selectedNetwork, networksData } = useWalletConnectClient();

  const [chainID, onChainSelectChange] = usePersistentChainID();
  const [pred, onPredSelectChange] = useState<PredKey>('keys-all');
  const [requestStatus, setRequestStatus] = useState<{
    status: FormStatus;
    message?: string;
  }>({ status: 'idle' });
  const [pubKeys, setPubKeys] = useState<string[]>([]);
  const [openItem, setOpenItem] = useState<{ item: number } | undefined>(
    undefined,
  );
  const [requestKey, setRequestKey] = useState<string>('');
  const drawerPanelRef = useRef<HTMLElement | null>(null);

  const { data: accountName } = useQuery({
    queryKey: [
      'accountName',
      pubKeys,
      chainID,
      pred,
      selectedNetwork,
      networksData,
    ],
    queryFn: () => createPrincipal(pubKeys, chainID, pred),
    enabled: pubKeys.length > 0,
    placeholderData: '',
    keepPreviousData: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    getValues,
    resetField,
    reset,
    control,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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
            <a
              className={linkStyle}
              href="https://transfer.chainweb.com/"
              target="_blank"
              rel="noreferrer"
              key="chainweb-transfer-link"
            />,
            <strong key="generate-keypair" />,
            <a
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

  useEffect(() => {
    setRequestStatus({ status: 'idle' });
  }, [pubKeys.length]);

  const currentAccName = getValues('name');

  useEffect(() => {
    setValue(
      'name',
      typeof accountName === 'string' && pubKeys.length > 0 ? accountName : '',
    );
  }, [accountName, chainID, currentAccName, setValue, pubKeys.length]);

  useToolbar(menuData, router.pathname);

  const onFormSubmit = useCallback(
    async (data: FormData) => {
      if (!pubKeys.length) {
        setError('pubKey', {
          type: 'custom',
          message: t('add-key-reminder'),
        });
        return;
      }

      setRequestStatus({ status: 'processing' });
      reset(undefined, { keepDirtyValues: true });
      setRequestKey('');
      try {
        const submitResponse = (await fundCreateNewAccount(
          data.name,
          pubKeys,
          chainID,
          selectedNetwork,
          networksData,
          AMOUNT_OF_COINS_FUNDED,
          pred,
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
        setOpenItem(undefined);
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
    [chainID, networksData, pred, pubKeys, selectedNetwork, reset, setError, t],
  );

  const mainnetSelected: boolean = selectedNetwork === 'mainnet01';
  const linkToExplorer = `${getExplorerLink(
    requestKey,
    selectedNetwork,
    networksData,
  )}`;

  const addPublicKey = () => {
    const value = stripAccountPrefix(getValues('pubKey') || '');

    const copyPubKeys = [...pubKeys];
    const isDuplicate = copyPubKeys.includes(value);

    if (isDuplicate) {
      setError('pubKey', { message: t('Duplicate public key') });
      return;
    }

    copyPubKeys.push(value);
    setPubKeys(copyPubKeys);
    resetField('pubKey');
  };

  const deletePublicKey = (index: number) => {
    const copyPubKeys = [...pubKeys];
    copyPubKeys.splice(index, 1);

    setPubKeys(copyPubKeys);
    setValue('name', '');
  };

  const handleOnClickLink = () => {
    setOpenItem(undefined);
  };

  const renderPubKeys = () => (
    <div className={pubKeysContainerStyle}>
      {pubKeys.map((key, index) => (
        <HoverTag
          key={`public-key-${key}`}
          value={key}
          onIconButtonClick={() => {
            deletePublicKey(index);
          }}
          icon={<MonoDelete />}
          maskOptions={{ headLength: 4, character: '.' }}
        />
      ))}
    </div>
  );

  return (
    <section className={containerClass}>
      <Head>
        <title>Kadena Developer Tools - Faucet</title>
      </Head>
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Faucet')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Fund New Account')}</BreadcrumbsItem>
      </Breadcrumbs>{' '}
      <Heading as="h4">{t('Create and Fund New Account')}</Heading>
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
      <div className={notificationContainerStyle}>
        <Notification intent="warning" role="none">
          <NotificationHeading>{t(`Before you start`)}</NotificationHeading>
          <Trans
            i18nKey="common:faucet-how-to-start"
            components={[
              <a
                className={notificationLinkStyle}
                target={'_blank'}
                href={'https://transfer.chainweb.com/'}
                rel="noreferrer"
                key="chainweb-transfer-link"
              />,
              <a
                className={notificationLinkStyle}
                target={'_blank'}
                href={'https://chainweaver.kadena.network/'}
                rel="noreferrer"
                key="chainweaver-link"
              />,
              <p key="text-wrapper" />,
              <Link
                className={notificationLinkStyle}
                href={'/faucet/existing'}
                key="faucet-existing-link"
              />,
            ]}
          />
        </Notification>
      </div>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <FormStatusNotification
          status={requestStatus.status}
          statusBodies={{
            successful: (
              <span className={notificationContentStyle}>
                {`${AMOUNT_OF_COINS_FUNDED} ${t('coins have been funded to')}`}
                <span className={hoverTagContainerStyle}>
                  <AccountHoverTag value={accountName as string} />
                </span>
              </span>
            ),
          }}
          body={requestStatus.message}
        />
        <Stack flexDirection="column" gap="lg">
          <Card fullWidth>
            <Heading as="h5">Public Keys</Heading>
            <Box marginBlockEnd="md" />
            <Controller
              name="pubKey"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <PublicKeyField
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    clearErrors('pubKey');
                  }}
                  errorMessage={errors?.pubKey?.message}
                  isInvalid={!!errors.pubKey}
                  endAddon={
                    <Button
                      icon={<MonoAdd />}
                      variant="text"
                      onPress={() => {
                        const value = getValues('pubKey');
                        const valid = validatePublicKey(
                          stripAccountPrefix(value || ''),
                        );
                        if (valid) {
                          addPublicKey();
                        } else {
                          setError('pubKey', {
                            type: 'custom',
                            message: t('invalid-pub-key-length'),
                          });
                        }
                      }}
                      aria-label="Add public key"
                      title="Add Public Key"
                      color="primary"
                      type="button"
                    />
                  }
                />
              )}
            />

            {pubKeys.length > 0 ? renderPubKeys() : null}

            {pubKeys.length > 1 ? (
              <PredKeysSelect
                onSelectionChange={onPredSelectChange}
                selectedKey={pred}
                aria-label="Select Predicate"
              />
            ) : null}
          </Card>
          <Card fullWidth>
            <Heading as="h5">{t('Account')}</Heading>
            <Box marginBlockEnd="md" />
            <div className={inputContainerClass}>
              <div className={accountNameContainerClass}>
                <AccountNameField
                  {...register('name')}
                  isInvalid={!!errors.name}
                  label={t('The account name to fund coins to')}
                  isDisabled
                  endAddon={
                    <Button
                      icon={<MonoContentCopy />}
                      variant="text"
                      onPress={async () => {
                        const value = getValues('name');
                        await navigator.clipboard.writeText(value);
                      }}
                      aria-label="Copy Account Name"
                      title="Copy Account Name"
                      color="primary"
                      type="button"
                    />
                  }
                />
              </div>
              <div className={chainSelectContainerClass}>
                <ChainSelect
                  onSelectionChange={onChainSelectChange}
                  selectedKey={chainID}
                  aria-label="Select Chain ID"
                />
              </div>
            </div>
          </Card>
          <div className={buttonContainerClass}>
            <Button
              isLoading={requestStatus.status === 'processing'}
              isDisabled={mainnetSelected}
              endIcon={<MonoKeyboardArrowRight />}
              title={t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
              type="submit"
            >
              {t('Create and Fund Account', { amount: AMOUNT_OF_COINS_FUNDED })}
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
export default NewAccountFaucetPage;
