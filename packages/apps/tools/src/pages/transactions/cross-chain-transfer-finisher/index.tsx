import DrawerToolbar from '@/components/Common/DrawerToolbar';
import { MenuLinkButton } from '@/components/Common/Layout/partials/Sidebar/MenuLinkButton';
import {
  AccountNameField,
  FormItemCard,
  FormStatusNotification,
  OptionsModal,
  REQUEST_KEY_VALIDATION,
  RequestKeyField,
} from '@/components/Global';
import client from '@/constants/client';
import type { Network } from '@/constants/kadena';
import { kadenaConstants } from '@/constants/kadena';
import { sidebarLinks } from '@/constants/side-links';
import { menuData } from '@/constants/side-menu-items';
import { useAppContext } from '@/context/app-context';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import { useDidUpdateEffect } from '@/hooks';
import {
  infoBoxStyle,
  linksBoxStyle,
} from '@/pages/transactions/cross-chain-transfer-tracker/styles.css';
import type { ITransferResult } from '@/services/cross-chain-transfer-finish/finish-xchain-transfer';
import { finishXChainTransfer } from '@/services/cross-chain-transfer-finish/finish-xchain-transfer';
import type { ITransferDataResult } from '@/services/cross-chain-transfer-finish/get-transfer-data';
import { getTransferData } from '@/services/cross-chain-transfer-finish/get-transfer-data';
import { validateRequestKey } from '@/services/utils/utils';
import { getExplorerLink } from '@/utils/getExplorerLink';
import type { INetworkData } from '@/utils/network';
import { getApiHost } from '@/utils/network';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MonoContentCopy,
  MonoInfo,
  MonoKeyboardArrowRight,
  MonoLink,
} from '@kadena/kode-icons/system';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Grid,
  GridItem,
  Heading,
  Notification,
  NotificationHeading,
  Stack,
  TextField,
  TextareaField,
  TrackerCard,
} from '@kadena/kode-ui';
import Debug from 'debug';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, FC } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { containerClass } from '../styles.css';
import {
  formButtonStyle,
  formContentStyle,
  notificationContainerStyle,
  notificationKeyStyle,
  notificationLinkStyle,
  textareaContainerStyle,
  textareaWrapperStyle,
} from './styles.css';

const schema = z.object({
  requestKey: REQUEST_KEY_VALIDATION,
  gasPayer: z.literal('kadena-xchain-gas'),
  gasLimit: z.number().positive(),
});

type FormData = z.infer<typeof schema>;

interface IErrorObject {
  message: string;
}

const CrossChainTransferFinisher: FC = () => {
  const debug = Debug(
    'kadena-transfer:pages:transfer:cross-chain-transfer-finisher',
  );
  const { t } = useTranslation('common');
  const router = useRouter();
  const { devOption } = useAppContext();
  const { selectedNetwork: network, networksData } = useWalletConnectClient();

  const helpInfoSections = [
    {
      tag: 'request-key',
      title: t('help-request-key-question'),
      content: t('help-request-key-content'),
    },
    {
      tag: 'gas-settings',
      title: t('help-gas-settings-question'),
      content: t('help-gas-settings-content'),
    },
    {
      tag: 'signature-data',
      title: t('help-signature-data-question'),
      content: t('help-signature-data-content'),
    },
  ];

  const [requestKey, setRequestKey] = useState<string>(
    (router.query?.reqKey as string) || '',
  );
  const [receiverRequestKey, setReceiverRequestKey] = useState<string>('');
  const [pollResults, setPollResults] = useState<ITransferDataResult>({});
  const [finalResults, setFinalResults] = useState<ITransferResult>({});
  const [txError, setTxError] = useState('');
  const [processingTx, setProcessingTx] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openItem, setOpenItem] = useState<{ item: number } | undefined>(
    undefined,
  );
  const [activeInfoTag, setActiveInfoTag] = useState<{
    tag: string;
    title: string;
    content: string;
  }>(helpInfoSections[0]);
  const drawerPanelRef = useRef<HTMLElement | null>(null);

  const networkData: INetworkData = networksData.filter(
    (item) => (network as Network) === item.networkId,
  )[0];

  const checkRequestKey = async (reqKey = requestKey): Promise<void> => {
    if (!validateRequestKey(reqKey)) {
      return;
    }

    router.query.reqKey = reqKey;
    await router.push(router);

    setTxError('');
    setFinalResults({});

    const pollResult: ITransferDataResult | undefined = await getTransferData({
      requestKey: reqKey,
      network,
      t,
      networksData,
    });

    if (pollResult === undefined) {
      return;
    }

    setPollResults(pollResult);
    setOpenItem(undefined);
    if (pollResults.tx === undefined) {
      return;
    }
  };

  const onCheckRequestKey = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): Promise<void> => {
    e.preventDefault();
    debug(onCheckRequestKey.name);

    await checkRequestKey();
  };

  const handleValidateSubmit = async (data: FormData): Promise<void> => {
    debug(handleValidateSubmit.name);

    if (
      !pollResults.tx ||
      !pollResults.tx.sender.chain ||
      !pollResults.tx.receiver.chain
    ) {
      return;
    }

    setProcessingTx(true);
    window.scrollTo(0, 0);

    const networkId = networkData.networkId;
    const apiHost = getApiHost({
      api: networkData.API,
      chainId: pollResults.tx.sender.chain,
      networkId,
    });
    const { pollCreateSpv, listen } = client(apiHost);

    const requestObject = {
      requestKey: data.requestKey,
      networkId: networkId,
      chainId: pollResults.tx.sender.chain,
    };

    const proof = await pollCreateSpv(
      requestObject,
      pollResults.tx.receiver.chain,
    );
    const status = await listen(requestObject);
    const pactId = status.continuation?.pactId ?? '';

    const requestKeyOrError = await finishXChainTransfer(
      {
        pactId,
        proof,
        rollback: false,
        step: 1,
      },
      pollResults.tx.receiver.chain,
      networkId,
      networksData,
      data.gasLimit,
      data.gasPayer,
    );

    if (typeof requestKeyOrError !== 'string') {
      setTxError((requestKeyOrError as { error: string }).error);
      setFinalResults({
        requestKey: data.requestKey,
        status: (requestKeyOrError as { error: string }).error,
      });
      setProcessingTx(false);
      return;
    }
    setReceiverRequestKey(requestKeyOrError as string);

    const receiverApiHost = getApiHost({
      api: networkData.API,
      chainId: pollResults.tx.receiver.chain,
      networkId,
    });
    const receiverClient = client(receiverApiHost);

    try {
      const data = await receiverClient.listen({
        requestKey: requestKeyOrError as string,
        networkId,
        chainId: pollResults.tx.receiver.chain,
      });
      if (data.result.status === 'failure') {
        const error: IErrorObject = data.result.error as IErrorObject;
        setTxError(error.message);
      }
      setFinalResults({
        requestKey: data.reqKey,
        status: data.result.status,
      });
      setProcessingTx(false);
    } catch (tx) {
      debug(tx);

      setFinalResults({ ...tx });
      setProcessingTx(false);
    }
  };

  const onRequestKeyChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setRequestKey(e.target.value);
      setOpenItem(undefined);
    },
    [],
  );

  useToolbar(menuData, router.pathname);

  useDidUpdateEffect(async () => {
    if (!router.isReady) {
      return;
    }
    const { reqKey } = router.query;
    if (reqKey) {
      setRequestKey(reqKey as string);
      await checkRequestKey(reqKey as string);
      setOpenItem(undefined);
    }
  }, [router.isReady]);

  const {
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    resetField,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      requestKey: router.query?.reqKey as string,
      gasPayer: 'kadena-xchain-gas',
      gasLimit: kadenaConstants.GAS_LIMIT,
    },
  });
  useEffect(() => {
    setValue('requestKey', requestKey);
    setOpenItem(undefined);
  }, [requestKey, setValue]);

  const isAdvancedOptions = devOption !== 'BASIC';
  const showNotification = Object.keys(finalResults).length > 0;

  const formattedSigData = `{
    "pred": "${pollResults.tx?.receiverGuard?.pred}",
    "sigs": ${pollResults.tx?.receiverGuard?.keys.map((key) => `"${key}"`)}
  }`;

  const linkToExplorer = `${getExplorerLink(
    requestKey,
    networkData.networkId,
    networksData,
  )}`;

  const renderLinkToExplorer = (
    <p>
      <span className={notificationKeyStyle}>
        {t('Target Chain Request key: ')}
      </span>
      <Link
        className={notificationLinkStyle}
        href={linkToExplorer}
        target={'_blank'}
        key={requestKey}
      >
        {requestKey}
      </Link>
    </p>
  );

  const renderNotification =
    txError.toString() === '' && receiverRequestKey ? (
      <FormStatusNotification
        status="successful"
        title={t('form-status-title-successful')}
        body={t('XChain transfer has been successfully finalized!')}
      >
        {renderLinkToExplorer}
      </FormStatusNotification>
    ) : (
      <FormStatusNotification status="erroneous" title={t('Transaction error')}>
        {txError.toString()}
        {renderLinkToExplorer}
      </FormStatusNotification>
    );

  const renderWaitingNotification = receiverRequestKey ? (
    <FormStatusNotification
      status="processing"
      title={t('form-status-title-processing')}
      body={t('form-status-content-processing')}
    >
      {renderLinkToExplorer}
    </FormStatusNotification>
  ) : null;

  const handleDevOptionsClick = (): void => {
    setOpenModal(true);
  };

  const handleCopySigData = async () => {
    await navigator.clipboard.writeText(formattedSigData);
  };

  const onOpenItemChange = (tag: string) => {
    setOpenItem({ item: 0 });
    const helpSection = helpInfoSections.find((item) => item.tag === tag);
    if (!helpSection) return;
    setActiveInfoTag(helpSection);
  };

  const handleOnClickLink = () => {
    setOpenItem(undefined);
  };

  useEffect(() => {
    resetField('requestKey');
    setPollResults({});
    setFinalResults({});
    setTxError('');
  }, [network, resetField]);

  return (
    <section className={containerClass}>
      <Head>
        <title>Kadena Developer Tools - Transactions</title>
      </Head>
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Transactions')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Cross Chain Transfer Finisher')}</BreadcrumbsItem>
      </Breadcrumbs>
      <Heading as="h4">{t('Finish transaction')}</Heading>

      <div className={notificationContainerStyle}>
        <Notification
          intent="warning"
          role="status"
          type="inlineStacked"
          isDismissable
        >
          <NotificationHeading>{t('Application Settings')}</NotificationHeading>
          <div>
            <Trans
              i18nKey="common:application-settings-warning"
              components={[
                <a
                  className={notificationLinkStyle}
                  key="link-open-settings"
                  onClick={handleDevOptionsClick}
                />,
              ]}
            />
          </div>
        </Notification>
      </div>

      {showNotification ? (
        <div className={notificationContainerStyle}>{renderNotification}</div>
      ) : null}

      {processingTx ? (
        <div className={notificationContainerStyle}>
          {renderWaitingNotification}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(handleValidateSubmit)}>
        <section className={formContentStyle}>
          <Stack
            flexDirection="column"
            paddingBlockStart={'md'}
            paddingBlockEnd={'xxxl'}
            gap={'lg'}
          >
            <FormItemCard
              heading={t('Search Request')}
              helper={t('Where can I find the request key?')}
              helperHref="#"
              disabled={false}
              helperOnClick={() => onOpenItemChange('request-key')}
            >
              <Box marginBlockEnd="md" />
              <Grid>
                <GridItem>
                  <Controller
                    control={control}
                    name="requestKey"
                    render={({ field }) => (
                      <RequestKeyField
                        errorMessage={
                          pollResults.error || errors.requestKey?.message
                        }
                        isInvalid={!!pollResults.error || !!errors.requestKey}
                        {...field}
                        onChange={onRequestKeyChange}
                        onKeyUp={onCheckRequestKey}
                      />
                    )}
                  />
                </GridItem>
              </Grid>
            </FormItemCard>

            {pollResults.tx !== undefined ? (
              <FormItemCard heading={t('Overview')} disabled={false}>
                <Grid columns={2} marginBlockStart="md" gap={'md'}>
                  <GridItem>
                    <TrackerCard
                      variant="vertical"
                      labelValues={[
                        {
                          label: t('Network'),
                          value: networkData.networkId,
                        },
                        {
                          label: t('Server'),
                          value: networkData.API,
                        },
                      ]}
                    />
                  </GridItem>
                  <GridItem>
                    <TrackerCard
                      variant="vertical"
                      icon="Gas"
                      labelValues={[
                        {
                          label: t('Gas Payer'),
                          value: getValues('gasPayer'),
                          isAccount: false,
                        },
                      ]}
                    />
                  </GridItem>
                </Grid>
                <Grid columns={2} marginBlockStart="md" gap={'md'}>
                  <GridItem>
                    <TrackerCard
                      variant="vertical"
                      icon="QuickStart"
                      labelValues={[
                        {
                          label: t('Sender'),
                          value: pollResults?.tx?.sender.account,
                          isAccount: true,
                        },
                        {
                          label: t('Chain'),
                          value: pollResults?.tx?.sender.chain,
                        },
                      ]}
                    />
                  </GridItem>
                  <GridItem>
                    <TrackerCard
                      variant="vertical"
                      icon="Receiver"
                      labelValues={[
                        {
                          label: t('Receiver'),
                          value: pollResults?.tx?.receiver.account,
                          isAccount: true,
                        },
                        {
                          label: t('Chain'),
                          value: pollResults?.tx?.receiver.chain,
                        },
                      ]}
                    />
                  </GridItem>
                </Grid>
              </FormItemCard>
            ) : null}

            {pollResults.tx !== undefined ? (
              <FormItemCard
                heading={t('Gas Settings')}
                helper={t('What is a gas payer?')}
                helperHref="#"
                disabled={false}
                helperOnClick={() => onOpenItemChange('gas-settings')}
              >
                <Grid columns={1} marginBlockStart="md">
                  <GridItem>
                    <Controller
                      control={control}
                      name="gasPayer"
                      shouldUnregister
                      render={({ field }) => (
                        <AccountNameField
                          label={t('Gas Payer')}
                          {...field}
                          id="gas-payer-account-input"
                          placeholder={t('Enter Your Account')}
                          isInvalid={!!errors.gasPayer}
                          errorMessage={errors.gasPayer?.message}
                        />
                      )}
                    />
                  </GridItem>
                </Grid>

                <Grid columns={1} marginBlockStart="md">
                  <GridItem>
                    <Controller
                      control={control}
                      name="gasLimit"
                      shouldUnregister
                      render={({ field }) => (
                        <TextField
                          disabled={!isAdvancedOptions}
                          description={t(
                            'This input field will only be enabled if the user is in expert mode',
                          )}
                          label={t('Gas Limit')}
                          {...field}
                          value={`${field.value}`}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                          isInvalid={!!errors.gasLimit}
                          errorMessage={errors.gasLimit?.message}
                          id="gas-limit-input"
                          placeholder={t('Enter Gas Limit')}
                          type={'number'}
                        />
                      )}
                    />
                  </GridItem>
                </Grid>
              </FormItemCard>
            ) : null}

            {pollResults.tx !== undefined ? (
              <FormItemCard
                heading={t('SigData')}
                helper={t('How do I use the Signature data')}
                helperHref="#"
                helperOnClick={() => onOpenItemChange('signature-data')}
              >
                <Box marginBlockEnd="md" />
                <Grid columns={1}>
                  <GridItem>
                    <div className={textareaContainerStyle}>
                      <TextareaField
                        autoResize
                        isReadOnly
                        fontType="code"
                        id="sig-text-area"
                        value={formattedSigData}
                        aria-label={t('sigData')}
                        className={textareaWrapperStyle}
                      />
                      <Button
                        onPress={async () => {
                          await handleCopySigData();
                        }}
                        title={t('copySigData')}
                        aria-label={t('copySigData')}
                        variant="transparent"
                      >
                        <MonoContentCopy />
                      </Button>
                    </div>
                  </GridItem>
                </Grid>
              </FormItemCard>
            ) : null}
          </Stack>
        </section>
        <section className={formButtonStyle}>
          <Button
            type="submit"
            isLoading={processingTx}
            endVisual={<MonoKeyboardArrowRight />}
          >
            {t('Finish Transaction')}
          </Button>
        </section>
      </form>

      <DrawerToolbar
        ref={drawerPanelRef}
        initialOpenItem={openItem}
        sections={[
          {
            icon: <MonoInfo />,
            title: activeInfoTag.title,
            children: (
              <div className={infoBoxStyle}>
                <span>{activeInfoTag.content}</span>
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

      <OptionsModal
        isOpen={openModal}
        onOpenChange={() => setOpenModal(false)}
      />
    </section>
  );
};

export default CrossChainTransferFinisher;
