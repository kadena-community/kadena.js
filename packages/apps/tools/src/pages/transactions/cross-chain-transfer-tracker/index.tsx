import DrawerToolbar from '@/components/Common/DrawerToolbar';
import { MenuLinkButton } from '@/components/Common/Layout/partials/Sidebar/MenuLinkButton';
import {
  FormItemCard,
  ProgressBar,
  REQUEST_KEY_VALIDATION,
  RequestKeyField,
} from '@/components/Global';
import { sidebarLinks } from '@/constants/side-links';
import { menuData } from '@/constants/side-menu-items';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import { useDidUpdateEffect } from '@/hooks';
import type { IStatusData } from '@/services/transfer-tracker/get-transfer-status';
import {
  StatusId,
  getTransferStatus,
} from '@/services/transfer-tracker/get-transfer-status';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MonoInfo,
  MonoLink,
  MonoRefresh,
  MonoSearch,
  MonoWarning,
} from '@kadena/react-icons/system';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Grid,
  GridItem,
  Heading,
  Notification,
  NotificationButton,
  NotificationFooter,
  NotificationHeading,
  Stack,
  TrackerCard,
} from '@kadena/react-ui';
import Debug from 'debug';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, FC } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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

  const helpInfoSections = [
    {
      tag: 'request-key',
      title: t('help-request-key-question'),
      content: t('help-request-key-content'),
    },
  ];

  const debug = Debug(
    'kadena-transfer:pages:transfer:cross-chain-transfer-tracker',
  );

  const [requestKey, setRequestKey] = useState<string>(
    (router.query?.reqKey as string) || '',
  );
  const [data, setData] = useState<IStatusData>({});
  const [txError, setTxError] = useState<string>('');
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
            if (!status.receiverChain && !status.receiverAccount) {
              setTxError(t('Not a Cross Chain Request Key'));
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
    handleSubmit: validateThenSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: { requestKey: requestKey },
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
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Transactions')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Cross Chain Transfer Tracker')}</BreadcrumbsItem>
      </Breadcrumbs>
      <Heading as="h4">{t('Track & trace transactions')}</Heading>
      <Stack
        flexDirection="column"
        paddingBlockStart={'md'}
        paddingBlockEnd={'xxxl'}
        gap={'lg'}
      >
        {txError ? (
          <div className={notificationContainerStyle}>
            <Notification
              intent="negative"
              isDismissable
              onDismiss={() => {
                setTxError('');
              }}
              icon={<MonoWarning />}
              role="status"
            >
              <NotificationHeading>Warning</NotificationHeading>
              {txError}
              <NotificationFooter>
                <NotificationButton
                  intent="negative"
                  onClick={validateThenSubmit(handleSubmit)}
                  icon={<MonoRefresh />}
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
            <Box marginBlockEnd="md" />
            <Grid>
              <GridItem>
                <Controller
                  name="requestKey"
                  control={control}
                  render={({ field }) => (
                    <RequestKeyField
                      errorMessage={errors.requestKey?.message}
                      isInvalid={!!errors.requestKey}
                      {...field}
                      onChange={onRequestKeyChange}
                    />
                  )}
                />
              </GridItem>
            </Grid>
          </FormItemCard>
          <div className={formButtonStyle}>
            <Button
              type="submit"
              title={t('Search')}
              onPress={() => setOpenItem(undefined)}
              endIcon={<MonoSearch />}
              isLoading={isSubmitting}
            >
              {t('Search')}
            </Button>
          </div>
        </form>

        {data.receiverAccount ? (
          <FormItemCard heading={t('Overview')} disabled={false}>
            <Grid columns={3} marginBlockStart="md" gap={'md'}>
              <GridItem>
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
              </GridItem>
              <GridItem>
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
                        data.id === StatusId.Pending
                          ? 'incomplete'
                          : 'complete',
                      title: t('Transfer complete'),
                    },
                  ]}
                />
              </GridItem>
              <GridItem>
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
              </GridItem>
            </Grid>
          </FormItemCard>
        ) : null}
      </Stack>

      {data.id === StatusId.Pending ? (
        <div className={footerBarStyle}>
          <Stack
            padding={'xs'}
            justifyContent={'space-between'}
            alignItems={'flex-start'}
            flexDirection={'row-reverse'}
          >
            <Button
              title={t('Finish Transaction')}
              onPress={() => {
                window.location.href = `/transactions/cross-chain-transfer-finisher?reqKey=${requestKey}`;
              }}
              endIcon={<MonoLink />}
              variant="outlined"
            >
              {t('Finish Transaction')}
            </Button>
          </Stack>
        </div>
      ) : null}

      <DrawerToolbar
        ref={drawerPanelRef}
        initialOpenItem={openItem}
        sections={[
          {
            icon: <MonoInfo />,
            title: helpInfoSections[0].title,
            children: (
              <div className={infoBoxStyle}>
                <span>{helpInfoSections[0].content}</span>
              </div>
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

export default CrossChainTransferTracker;
