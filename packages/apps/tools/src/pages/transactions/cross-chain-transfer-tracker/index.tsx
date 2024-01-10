import DrawerToolbar from '@/components/Common/DrawerToolbar';
import { MenuLinkButton } from '@/components/Common/Layout/partials/Sidebar/MenuLinkButton';
import { FormItemCard } from '@/components/Global/FormItemCard';
import { ProgressBar } from '@/components/Global/ProgressBar';
import RequestKeyField, {
  REQUEST_KEY_VALIDATION,
} from '@/components/Global/RequestKeyField';
import { menuData } from '@/constants/side-menu-items';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import { useDidUpdateEffect } from '@/hooks';
import type { IStatusData } from '@/services/transfer-tracker/get-transfer-status';
import {
  StatusId,
  getTransferStatus,
} from '@/services/transfer-tracker/get-transfer-status';
import { validateRequestKey } from '@/services/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FormFieldStatus } from '@kadena/react-ui';
import {
  Accordion,
  Breadcrumbs,
  Button,
  Grid,
  GridItem,
  Heading,
  Link,
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
  Stack,
  SystemIcon,
  TrackerCard,
} from '@kadena/react-ui';
import Debug from 'debug';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, FC } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { containerClass, notificationContainerStyle } from '../styles.css';
import {
  footerBarStyle,
  formButtonStyle,
  infoBoxStyle,
  linksBoxStyle,
} from './styles.css';

const schema = z.object({
  requestKey: REQUEST_KEY_VALIDATION,
});

type FormData = z.infer<typeof schema>;

const CrossChainTransferTracker: FC = () => {
  const { selectedNetwork: network, networksData } = useWalletConnectClient();
  const router = useRouter();
  const { t } = useTranslation('common');

  useToolbar(menuData, router.pathname);

  const debug = Debug(
    'kadena-transfer:pages:transfer:cross-chain-transfer-tracker',
  );

  const links = [
    {
      title: t('Tutorial'),
      href: 'https://kadena.io/',
    },
    {
      title: t('Documentation'),
      href: 'https://kadena.io/',
    },
    {
      title: t('Privacy & Policy'),
      href: 'https://kadena.io/',
    },
    {
      title: t('Terms of use'),
      href: 'https://kadena.io/',
    },
  ];

  const [requestKey, setRequestKey] = useState<string>(
    (router.query?.reqKey as string) || '',
  );
  const [data, setData] = useState<IStatusData>({});
  const [txError, setTxError] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [validRequestKey, setValidRequestKey] = useState<
    FormFieldStatus | undefined
  >();
  const [openItem, setOpenItem] = useState<{ item: number } | undefined>(
    undefined,
  );
  const drawerPanelRef = useRef<HTMLElement | null>(null);

  useDidUpdateEffect(() => {
    if (!router.isReady) {
      return;
    }
    const { reqKey } = router.query;
    if (reqKey) {
      setRequestKey(reqKey as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    setData({});
  }, [network]);

  const checkRequestKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    debug(checkRequestKey.name);

    //Clear error message when user starts typing
    setInputError('');
    if (!requestKey) {
      setValidRequestKey(undefined);
      return;
    }

    if (validateRequestKey(requestKey) === undefined) {
      setValidRequestKey('negative');
      return;
    }
    setValidRequestKey(undefined);
    return;
  };

  const handleSubmit = async (data: FormData): Promise<void> => {
    debug(handleSubmit);

    router.query.reqKey = data.requestKey;
    await router.push(router);

    setTxError('');

    try {
      await getTransferStatus({
        requestKey: data.requestKey,
        network: network,
        t,
        options: {
          onPoll: (status: IStatusData) => {
            setData(status);
            if (status.status === 'Error' && status.description) {
              //Set error message
              setTxError(status.description);
            }
          },
        },
        networksData,
      });
    } catch (error) {
      debug(error);
    }
  };

  const {
    register,
    handleSubmit: validateThenSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: { requestKey: router.query.reqKey as string },
    // @see https://www.react-hook-form.com/faqs/#Howtoinitializeformvalues
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  });

  const onRequestKeyChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setRequestKey(e.target.value);
    },
    [],
  );

  useEffect(() => {
    if (errors.requestKey?.message) {
      setInputError(errors.requestKey.message);
      setTxError('');
    }
  }, [errors.requestKey?.message]);

  const onOpenItemChange = () => {
    setOpenItem({ item: 0 });
  };

  const handleOnClickLink = () => {
    setOpenItem(undefined);
  };

  return (
    <section className={containerClass}>
      <Head>
        <title>Kadena Developer Tools - Transactions</title>
      </Head>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Transactions')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Cross Chain Tracker')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <Heading as="h4">{t('Track & trace transactions')}</Heading>
      <Stack
        direction="column"
        paddingTop={'$6'}
        paddingBottom={'$10'}
        marginBottom={'$6'}
        gap={'$6'}
      >
        {txError ? (
          <div className={notificationContainerStyle}>
            <Notification
              intent="negative"
              isDismissable
              onDismiss={() => {
                setTxError('');
              }}
              icon={<SystemIcon.AlertBox />}
              role="status"
            >
              <NotificationHeading>Warning</NotificationHeading>
              {txError}
              <NotificationFooter>
                <NotificationButton
                  intent="negative"
                  onClick={validateThenSubmit(handleSubmit)}
                  icon={<SystemIcon.Refresh />}
                >
                  {t('Retry')}
                </NotificationButton>
              </NotificationFooter>
            </Notification>
          </div>
        ) : null}
        <form onSubmit={validateThenSubmit(handleSubmit)}>
          <FormItemCard
            heading={t('Search Request')}
            helper={t('Where can I find the request key?')}
            helperHref="#"
            helperOnClick={() => onOpenItemChange()}
            disabled={false}
          >
            <Grid>
              <GridItem>
                <RequestKeyField
                  helperText={inputError || undefined}
                  status={validRequestKey}
                  {...register('requestKey')}
                  onKeyUp={checkRequestKey}
                  onChange={onRequestKeyChange}
                  error={errors.requestKey}
                />
              </GridItem>
            </Grid>
          </FormItemCard>
          <div className={formButtonStyle}>
            <Button
              type="submit"
              title={t('Search')}
              icon="Magnify"
              iconAlign="right"
              onClick={() => setOpenItem(undefined)}
            >
              {t('Search')}
            </Button>
          </div>
        </form>

        {data.receiverAccount ? (
          <FormItemCard heading={t('Overview')} disabled={false}>
            <Stack direction="row" gap="$md">
              <TrackerCard
                variant="vertical"
                icon={'QuickStart'}
                labelValues={[
                  {
                    label: t('Sender'),
                    value: data.senderAccount || '',
                    isAccount: true,
                  },
                  {
                    label: t('Chain'),
                    value: data.senderChain || '',
                  },
                ]}
              />
              {/*  Progress Bar will only show if the transfer is in progress /
                        completed.  If an error occurs, the notification will display the
                        error and no progress bar will show */}
              <ProgressBar
                checkpoints={[
                  {
                    status: 'complete',
                    title: t('Initiated transaction'),
                  },
                  {
                    status:
                      data?.id === StatusId.Success ? 'complete' : 'pending',
                    title: data.description || 'An error has occurred',
                  },
                  {
                    status:
                      data.id === StatusId.Pending ? 'incomplete' : 'complete',
                    title: t('Transfer complete'),
                  },
                ]}
              />
              <TrackerCard
                variant="vertical"
                icon={
                  data?.id === StatusId.Success
                    ? 'Receiver'
                    : 'ReceiverInactive'
                }
                labelValues={[
                  {
                    label: t('Receiver'),
                    value: data.receiverAccount || '',
                    isAccount: true,
                  },
                  {
                    label: t('Chain'),
                    value: data.receiverChain || '',
                  },
                ]}
              />
            </Stack>
          </FormItemCard>
        ) : null}
      </Stack>

      {data.id === StatusId.Pending ? (
        <div className={footerBarStyle}>
          <Stack
            padding={'$4'}
            justifyContent={'space-between'}
            alignItems={'flex-start'}
            direction={'row-reverse'}
          >
            <Link
              href={`/transactions/cross-chain-transfer-finisher?reqKey=${requestKey}`}
            >
              <Button color={'positive'} icon="Link" iconAlign="right">
                {t('Finish Transaction')}
              </Button>
            </Link>
          </Stack>
        </div>
      ) : null}

      <DrawerToolbar
        ref={drawerPanelRef}
        initialOpenItem={openItem}
        sections={[
          {
            icon: 'Information',
            title: t('Where can I find the request key?'),
            children: (
              <div className={infoBoxStyle}>
                <span>
                  You can start a cross chain transfer on Chainweaver and get a
                  request key.
                </span>
              </div>
            ),
          },
          {
            icon: 'Link',
            title: t('Resources & Links'),
            children: (
              <div className={linksBoxStyle}>
                <Accordion.Root>
                  {links.map((item, index) => (
                    <MenuLinkButton
                      title={item.title}
                      key={`menu-link-${index}`}
                      href={item.href}
                      active={item.href === router.pathname}
                      target="_blank"
                      onClick={handleOnClickLink}
                    />
                  ))}
                </Accordion.Root>
              </div>
            ),
          },
        ]}
      />
    </section>
  );
};

export default CrossChainTransferTracker;
