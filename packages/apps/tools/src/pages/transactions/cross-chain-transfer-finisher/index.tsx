import DrawerToolbar from '@/components/Common/DrawerToolbar';
import { MenuLinkButton } from '@/components/Common/Layout/partials/Sidebar/MenuLinkButton';
import { FormStatusNotification } from '@/components/Global';
import {
  AccountNameField,
  NAME_VALIDATION,
} from '@/components/Global/AccountNameField';
import { FormItemCard } from '@/components/Global/FormItemCard';
import { OptionsModal } from '@/components/Global/OptionsModal';
import RequestKeyField, {
  REQUEST_KEY_VALIDATION,
} from '@/components/Global/RequestKeyField';
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
import type { INetworkData } from '@/utils/network';
import { getApiHost } from '@/utils/network';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Accordion,
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Notification,
  NotificationHeading,
  Stack,
  TextField,
  Textarea,
  TrackerCard,
} from '@kadena/react-ui';
import Debug from 'debug';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, FC } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { containerClass } from '../styles.css';
import {
  formButtonStyle,
  formContentStyle,
  notificationContainerStyle,
  notificationLinkStyle,
  textareaContainerStyle,
} from './styles.css';

// @see; https://www.geeksforgeeks.org/how-to-validate-a-domain-name-using-regular-expression/
const DOMAIN_NAME_REGEX: RegExp =
  /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/;

const schema = z.object({
  requestKey: REQUEST_KEY_VALIDATION,
  advancedOptions: z.boolean().optional(),
  server: z
    .string()
    .trim()
    .regex(DOMAIN_NAME_REGEX, 'Invalid Domain Name')
    .optional(),
  gasPayer: NAME_VALIDATION.optional(),
  gasLimit: z.number().optional(),
  gasPrice: z.string().optional(),
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

  const [requestKey, setRequestKey] = useState<string>(
    (router.query?.reqKey as string) || '',
  );
  const [pollResults, setPollResults] = useState<ITransferDataResult>({});
  const [finalResults, setFinalResults] = useState<ITransferResult>({});
  const [txError, setTxError] = useState('');
  const [processingTx, setProcessingTx] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openItem, setOpenItem] = useState<{ item: number } | undefined>(
    undefined,
  );
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

    if (!pollResults.tx) {
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
      data.gasPayer,
    );

    if (typeof requestKeyOrError !== 'string') {
      setTxError((requestKeyOrError as { error: string }).error);
      setProcessingTx(false);
      return;
    }

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
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    resetField,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      server: networkData.API,
      requestKey: requestKey,
      gasPayer: 'kadena-xchain-gas',
      gasLimit: kadenaConstants.GAS_LIMIT,
      gasPrice: kadenaConstants.GAS_PRICE.toFixed(8),
    },
    // @see https://www.react-hook-form.com/faqs/#Howtoinitializeformvalues
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  });

  const watchGasPayer = watch('gasPayer');

  const isGasStation = watchGasPayer === 'kadena-xchain-gas';
  const isAdvancedOptions = devOption !== 'BASIC';
  const showInputError =
    pollResults.error === undefined ? undefined : 'negative';
  const showInputHelper =
    pollResults.error !== undefined ? pollResults.error : '';
  const showNotification = Object.keys(finalResults).length > 0;

  const formattedSigData = `{
    "pred": "${pollResults.tx?.receiverGuard.pred}",
    "sigs": ${pollResults.tx?.receiverGuard.keys.map((key) => `"${key}"`)}"
  }`;

  const renderNotification =
    txError.toString() === '' ? (
      <FormStatusNotification
        status="successful"
        title={t('Notification title success')}
      >
        {t('XChain transfer has been successfully finalized!')}
      </FormStatusNotification>
    ) : (
      <FormStatusNotification status="erroneous" title={t('Transaction error')}>
        {txError.toString()}
      </FormStatusNotification>
    );

  const renderWaitingNotification = (
    <FormStatusNotification
      status="processing"
      title={t('form-status-title-processing')}
    />
  );

  const handleDevOptionsClick = (): void => {
    setOpenModal(true);
  };

  const handleCopySigData = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    await navigator.clipboard.writeText(formattedSigData);
  };

  const onOpenItemChange = () => {
    setOpenItem({ item: 0 });
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
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Transactions')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Cross Chain Finisher')}</BreadcrumbsItem>
      </Breadcrumbs>
      <Heading as="h4">{t('Finish transaction')}</Heading>

      <div className={notificationContainerStyle}>
        <Notification intent="warning" role="status" isDismissable>
          <NotificationHeading>{t('Application Settings')}</NotificationHeading>
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
              helperOnClick={() => onOpenItemChange()}
            >
              <Box marginBlockEnd="md" />
              <Grid>
                <GridItem>
                  <RequestKeyField
                    helperText={showInputHelper}
                    status={showInputError}
                    {...register('requestKey')}
                    value={requestKey}
                    onChange={onRequestKeyChange}
                    onKeyUp={onCheckRequestKey}
                    error={errors.requestKey}
                  />
                </GridItem>
              </Grid>
            </FormItemCard>

            {pollResults.tx !== undefined ? (
              <FormItemCard heading={t('Overview')} disabled={false}>
                <Stack flexDirection="row" gap="xxl">
                  <TrackerCard
                    variant="horizontal"
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
                </Stack>
                <Stack flexDirection="row" gap="xxl">
                  <TrackerCard
                    variant="horizontal"
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

                  <TrackerCard
                    variant="horizontal"
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
                </Stack>
              </FormItemCard>
            ) : null}

            {pollResults.tx !== undefined ? (
              <FormItemCard
                heading={t('Gas Settings')}
                helper={t('What is a gas payer?')}
                helperHref="#"
                disabled={false}
                helperOnClick={() => onOpenItemChange()}
              >
                <Grid columns={1} marginBlockStart="md">
                  <GridItem>
                    <AccountNameField
                      label={t('Gas Payer')}
                      inputProps={{
                        ...register('gasPayer', { shouldUnregister: true }),
                        id: 'gas-payer-account-input',
                        placeholder: t('Enter Your Account'),
                      }}
                      error={
                        !isGasStation
                          ? {
                              message: 'Please enter kadena-xchain-gas',
                              type: 'gas-station',
                            }
                          : errors.gasPayer
                      }
                    />
                  </GridItem>
                </Grid>

                <Grid columns={1} marginBlockStart="md">
                  <GridItem>
                    <TextField
                      disabled={!isAdvancedOptions}
                      helperText={t(
                        'This input field will only be enabled if the user is in expert mode',
                      )}
                      {...register('gasLimit', { shouldUnregister: true })}
                      label={t('Gas Limit')}
                      id="gas-limit-input"
                      placeholder={t('Enter Gas Limit')}
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
                helperOnClick={() => onOpenItemChange()}
              >
                <Box marginBlockEnd="md" />
                <Grid columns={1}>
                  <GridItem>
                    <div className={textareaContainerStyle}>
                      <Textarea
                        readOnly
                        fontFamily="codeFont"
                        id="sig-text-area"
                        value={formattedSigData}
                      />
                      <IconButton
                        as={'button'}
                        color="primary"
                        icon={'ContentCopy'}
                        onClick={async (event) => {
                          await handleCopySigData(event);
                        }}
                        title={t('copySigData')}
                      />
                    </div>
                  </GridItem>
                </Grid>
              </FormItemCard>
            ) : null}
          </Stack>
        </section>
        <section className={formButtonStyle}>
          <Button type="submit" disabled={processingTx} icon="TrailingIcon">
            {t('Finish Transaction')}
          </Button>
        </section>
      </form>

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
                </Accordion.Root>
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
