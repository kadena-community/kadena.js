import type { FormStatus, PredKey } from '@/components/Global';
import {
  AccountNameField,
  ChainSelect,
  FormStatusNotification,
  NAME_VALIDATION,
  PredKeysSelect,
} from '@/components/Global';
import { menuData } from '@/constants/side-menu-items';
import { useToolbar } from '@/context/layout-context';
import { useAccountDetailsQuery } from '@/hooks/use-account-details-query';

import AddPublicKeysSection from '@/components/Global/AddPublicKeysSection';
import client from '@/constants/client';
import type { Network } from '@/constants/kadena';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import type { DerivationMode } from '@/hooks/use-ledger-public-key';
import useLedgerPublicKey, {
  derivationModes,
  getDerivationPath,
} from '@/hooks/use-ledger-public-key';
import { useLedgerSign } from '@/hooks/use-ledger-sign';
import { finishXChainTransfer } from '@/services/cross-chain-transfer-finish/finish-xchain-transfer';
import { createPrincipal } from '@/services/faucet/create-principal';
import type { ISubmitTxResponseBody } from '@/services/transfer/submit-transaction';
import {
  listenResult,
  pollResult,
  submitTx,
} from '@/services/transfer/submit-transaction';
import type { INetworkData } from '@/utils/network';
import { getApiHost } from '@/utils/network';
import { stripAccountPrefix } from '@/utils/string';
import { zodResolver } from '@hookform/resolvers/zod';
import { CHAINS } from '@kadena/chainweb-node-client';
import type { ITransactionDescriptor } from '@kadena/client';
import {
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  Heading,
  Notification,
  NumberField,
  Select,
  SelectItem,
  Stack,
  SystemIcon,
  TabItem,
  Tabs,
  Text,
} from '@kadena/react-ui';
import { useQuery } from '@tanstack/react-query';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { containerClass } from '../styles.css';
import LedgerDetails from './ledger-details';
import {
  buttonContainerClass,
  chainSelectContainerClass,
  notificationLinkStyle,
} from './styles.css';
import TransactionDetails from './transaction-details';

const schema = z.object({
  sender: NAME_VALIDATION,
  senderChainId: z.enum(CHAINS),
  receiver: NAME_VALIDATION,
  amount: z.number().positive(),
  receiverChainId: z.enum(CHAINS),
});

type FormData = z.infer<typeof schema>;

const TransferPage = () => {
  const router = useRouter();
  useToolbar(menuData, router.pathname);
  const { t } = useTranslation('common');
  const { selectedNetwork: network, networksData } = useWalletConnectClient();
  const [toAccountTab, setToAccountTab] = useState('existing');
  const [keyId, setKeyId] = useState<number>();
  const [pred, onPredSelectChange] = useState<PredKey>('keys-all');

  const [pubKeys, setPubKeys] = useState<string[]>([]);
  const [initialPublicKey, setInitialPublicKey] = useState<string>('');
  const [requestStatus, setRequestStatus] = useState<{
    status: FormStatus;
    message?: string;
  }>({ status: 'idle' });
  const [legacyToggleOn, setLegacyToggleOn] = useState<boolean>(false);
  const derivationMode: DerivationMode = legacyToggleOn
    ? derivationModes[1]
    : derivationModes[0];

  const [receiverRequestKey, setReceiverRequestKey] = useState<string>('');

  const networkData: INetworkData = networksData.filter(
    (item) => (network as Network) === item.networkId,
  )[0];

  const accountFromOptions = ['Ledger', 'WalletConnect'];

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { senderChainId: CHAINS[0], receiverChainId: CHAINS[0] },
  });

  const senderData: {
    error: unknown | { message: string };
    data:
      | {
          account: string;
          balance: number;
          guard: { keys: string[]; pred: string };
        }
      | undefined;
    isFetching: boolean;
  } = useAccountDetailsQuery({
    account: getValues('sender'),
    networkId: network,
    chainId: getValues('senderChainId'),
  });

  const [{ error: ledgerError, value: ledgerPublicKey }, getPublicKey] =
    useLedgerPublicKey();

  console.log('Ledger error: ', ledgerError);

  useEffect(() => {
    if (ledgerPublicKey) {
      setValue('sender', `k:${ledgerPublicKey}`);
    }
  }, [ledgerPublicKey, legacyToggleOn, setValue]);

  const watchReceiverChainId = watch('receiverChainId');
  const watchChains = watch(['senderChainId', 'receiverChainId']);
  const onSameChain = watchChains.every((chain) => chain === watchChains[0]);
  const watchAmount = watch('amount');

  const receiverData: {
    error: unknown | { message: string };
    data:
      | {
          account: string;
          balance: number;
          guard: { keys: string[]; pred: string };
        }
      | undefined;
    isFetching: boolean;
  } = useAccountDetailsQuery({
    account: getValues('receiver'),
    networkId: network,
    chainId: getValues('receiverChainId'),
  });

  const { data: receiverName } = useQuery({
    queryKey: [
      'receiverName',
      pubKeys,
      watchReceiverChainId,
      pred,
      network,
      networksData,
    ],
    queryFn: () => createPrincipal(pubKeys, watchReceiverChainId, pred),
    enabled: pubKeys.length > 0,
    placeholderData: '',
    keepPreviousData: true,
  });

  useEffect(() => {
    if (toAccountTab === 'new') {
      setValue(
        'receiver',
        typeof receiverName === 'string' && pubKeys.length > 0
          ? receiverName
          : '',
      );
    }
  }, [
    receiverName,
    watchReceiverChainId,
    setValue,
    toAccountTab,
    pubKeys.length,
  ]);

  const invalidAmount =
    senderData.data && senderData.data.balance < watchAmount;
  const invalidAmountMessage = senderData.data
    ? `Cannot send more than ${senderData.data.balance.toFixed(4)} KDAs.`
    : '';

  if (toAccountTab === 'existing' && receiverData?.error) {
    setToAccountTab('new');
    setInitialPublicKey(stripAccountPrefix(getValues('receiver')));
    setTimeout(() => {
      setValue('receiver', '');
    }, 100);
  }

  const setReceiverAccountTab = (value: any) => {
    setToAccountTab(value);
  };

  const deletePublicKey = () => setValue('receiver', '');

  const [ledgerSignState, signTx] = useLedgerSign();


  const handleSignTransaction = async (data: FormData) => {
    const transferInput = {
      sender: {
        account: senderData.data?.account ?? '',
        publicKeys: ledgerPublicKey ? [ledgerPublicKey] : [],
        pred: senderData.data?.guard.pred,
      },
      receiver: receiverData.data?.account ?? '',
      chainId: data.senderChainId,
      amount: String(data.amount),
    };
    if (!onSameChain) {
      // @ts-ignore
      transferInput.targetChainId = data.receiverChainId;
    }

    if (receiverData?.error) {
      // @ts-ignore
      transferInput.receiver = {
        account: data.receiver,
        keyset: {
          keys: pubKeys,
          pred: pred,
        },
      };
    }
    await signTx(transferInput, {
      networkId: network,
      derivationPath: getDerivationPath(keyId!, derivationMode),
    });
  };

  const onSubmit = async () => {
    const submitResponse = (await submitTx(
      [ledgerSignState.value!.pactCommand],
      getValues('senderChainId'),
      network,
      networksData,
    )) as ITransactionDescriptor[];

    if (!submitResponse) {
      return setRequestStatus({
        status: 'erroneous',
        message: t('An error occurred.'),
      });
    }

    const pollResponse = (await pollResult(
      getValues('senderChainId'),
      network,
      networksData,
      submitResponse[0],
    )) as unknown as ISubmitTxResponseBody;

    const error = Object.values(pollResponse).find(
      (response) => response.result.status === 'failure',
    );
    if (error) {
      setRequestStatus({
        status: 'erroneous',
        message: error.response.error?.message || t('An error occurred.'),
      });
      return;
    }
    setRequestStatus({ status: 'successful' });

    if (!onSameChain) {
      console.log('This is cross chain transfer - waiting for SPV proof');

      const apiHost = getApiHost({
        api: networkData.API,
        chainId: getValues('senderChainId'),
        networkId: network,
      });
      const { pollCreateSpv, listen } = client(apiHost);

      const requestObject = {
        requestKey: submitResponse[0].requestKey,
        networkId: network,
        chainId: getValues('senderChainId'),
      };

      const proof = await pollCreateSpv(
        requestObject,
        getValues('receiverChainId'),
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
        getValues('receiverChainId'),
        network,
        networksData,
        850,
        'kadena-xchain-gas',
      );

      if (typeof requestKeyOrError !== 'string') {
        setRequestStatus({
          status: 'erroneous',
          message: error.response.error?.message || t('An error occurred.'),
        });
        return;
      }
      setReceiverRequestKey(requestKeyOrError as string);

      try {
        const pollResponseTarget = await listenResult(
          getValues('receiverChainId'),
          network,
          networksData,
          {
            requestKey: requestKeyOrError,
            networkId: network,
            chainId: getValues('receiverChainId'),
          },
        );

        if (pollResponseTarget.result.status === 'success') {
          return setRequestStatus({ status: 'successful' });
        }
        setRequestStatus({
          status: 'erroneous',
          message: t('An error occurred.'),
        });
      } catch (e) {
        setRequestStatus({
          status: 'erroneous',
          message: error.response.error?.message || t('An error occurred.'),
        });
        return;
      }
    }
  };

  const renderAccountFieldWithChain = (tab: string) => (
    <Stack flexDirection={'column'} gap={'md'}>
      <div className={chainSelectContainerClass}>
        <Controller
          name="receiverChainId"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <ChainSelect
              {...rest}
              selectedKey={value}
              id="receiverChainId"
              onSelectionChange={(chainId) => onChange(chainId)}
              isInvalid={!!errors.receiverChainId}
              errorMessage={errors.receiverChainId?.message}
            />
          )}
        />
      </div>
      <Controller
        name="receiver"
        control={control}
        render={({ field }) => (
          <AccountNameField
            {...field}
            isInvalid={!!errors.receiver}
            errorMessage={errors.receiver?.message}
            label={t('The account name to fund coins to')}
            isDisabled={tab === 'new'}
            endAddon={
              <Button
                icon={<SystemIcon.ContentCopy />}
                variant="text"
                onPress={async () => {
                  await navigator.clipboard.writeText(field.value);
                }}
                aria-label="Copy Account Name"
                title="Copy Account Name"
                color="primary"
                type="button"
              />
            }
          />
        )}
      />
    </Stack>
  );

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
        <Notification intent="info" role="alert">
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
        <form onSubmit={handleSubmit(handleSignTransaction)}>
          <Stack flexDirection="column" gap="lg">
            {/* SENDER  FLOW */}
            <Card fullWidth>
              <Heading as={'h4'}>{t('Sender')} </Heading>

              <Stack flexDirection={'row'} justifyContent={'space-between'}>
                <Select
                  label="From"
                  placeholder="Select an option"
                  selectedKey={'Ledger'}
                >
                  {accountFromOptions.map((item) => (
                    <SelectItem key={item}>{item}</SelectItem>
                  ))}
                </Select>
                <Link
                  className={notificationLinkStyle}
                  href={'https://transfer.chainweb.com/search-ledger-keys.html'}
                  target={'_blank'}
                  key={'key'}
                >
                  {t('Find your key')}
                </Link>
              </Stack>

              <Stack
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="stretch"
                gap="md"
              >
                <LedgerDetails
                  getPublicKey={getPublicKey}
                  setKeyId={setKeyId}
                  legacyToggleOn={legacyToggleOn}
                  setLegacyToggleOn={setLegacyToggleOn}
                />

                <Stack flexDirection={'row'} justifyContent={'space-between'}>
                  <div className={chainSelectContainerClass}>
                    <Controller
                      name="senderChainId"
                      control={control}
                      render={({ field: { onChange, value, ...rest } }) => (
                        <ChainSelect
                          {...rest}
                          selectedKey={value}
                          id="senderChainId"
                          onSelectionChange={(chainId) => onChange(chainId)}
                          isInvalid={!!errors.senderChainId}
                          errorMessage={errors.senderChainId?.message}
                        />
                      )}
                    />
                  </div>
                </Stack>

                <Controller
                  name="sender"
                  control={control}
                  render={({ field }) => (
                    <AccountNameField
                      {...field}
                      isInvalid={!!errors.sender}
                      errorMessage={
                        senderData.error
                          ? 'Account not found on selected Chain'
                          : errors.sender
                          ? errors.sender.message
                          : undefined
                      }
                      label={t('The account name to fund coins to')}
                      // isDisabled
                      endAddon={
                        <Button
                          icon={<SystemIcon.ContentCopy />}
                          variant="text"
                          onPress={async () => {
                            await navigator.clipboard.writeText(field.value);
                          }}
                          aria-label="Copy Account Name"
                          title="Copy Account Name"
                          color="primary"
                          type="button"
                        />
                      }
                    />
                  )}
                />

                {senderData.isFetching ? (
                  <Stack flexDirection={'row'}>
                    <SystemIcon.Information />
                    <Text as={'span'} color={'emphasize'}>
                      Fetching sender account data..
                    </Text>
                  </Stack>
                ) : null}

                <Controller
                  name="amount"
                  control={control}
                  render={({ field: { onChange, ...rest } }) => (
                    <NumberField
                      {...rest}
                      id="ledger-transfer-amount"
                      label={t('Amount')}
                      onValueChange={(value) => onChange(value)}
                      isDisabled={!!senderData.error}
                      isInvalid={!!errors.amount || invalidAmount}
                      errorMessage={
                        invalidAmount
                          ? invalidAmountMessage
                          : errors.amount?.message
                      }
                      info={t('The amount of KDA to transfer.')}
                    />
                  )}
                />
              </Stack>
            </Card>

            {/* RECEIVER FLOW */}
            <Card fullWidth>
              <Heading as={'h4'}>{t('Receiver')} </Heading>
              <Tabs
                aria-label="receiver-account-tabs"
                selectedKey={toAccountTab}
                onSelectionChange={setReceiverAccountTab}
              >
                <TabItem key="existing" title="Existing">
                  {renderAccountFieldWithChain('existing')}
                  {receiverData.isFetching ? (
                    <Stack flexDirection={'row'}>
                      <SystemIcon.Information />
                      <Text as={'span'} color={'emphasize'}>
                        Fetching receiver account data..
                      </Text>
                    </Stack>
                  ) : null}
                </TabItem>

                <TabItem key="new" title="New">
                  <Stack flexDirection={'column'} gap={'md'}>
                    <AddPublicKeysSection
                      publicKeys={pubKeys}
                      deletePubKey={deletePublicKey}
                      setPublicKeys={setPubKeys}
                      initialPublicKey={initialPublicKey}
                    />
                    {pubKeys.length > 1 ? (
                      <PredKeysSelect
                        onSelectionChange={onPredSelectChange}
                        selectedKey={pred}
                        aria-label="Select Predicate"
                      />
                    ) : null}

                    {renderAccountFieldWithChain('existing')}

                    {receiverData.isFetching ? (
                      <Stack flexDirection={'row'}>
                        <SystemIcon.Information />
                        <Text as={'span'} color={'emphasize'}>
                          Fetching receiver account data..
                        </Text>
                      </Stack>
                    ) : null}
                  </Stack>
                </TabItem>
              </Tabs>
            </Card>

            {ledgerSignState.error && (
              <FormStatusNotification
                status="erroneous"
                body={ledgerSignState.error.message}
              />
            )}

            <div className={buttonContainerClass}>
              <Button
                isLoading={receiverData.isFetching}
                // isDisabled={isSubmitting}
                endIcon={<SystemIcon.TrailingIcon />}
                title={t('Sign')}
                type="submit"
              >
                {t('Sign')}
              </Button>
            </div>
          </Stack>
        </form>

        <Stack flexDirection="column" gap="lg">
          {ledgerSignState.value ? (
            <>
              <TransactionDetails
                transactions={{ cmds: [ledgerSignState.value.pactCommand] }}
              />
              <div className={buttonContainerClass}>
                <Button
                  isLoading={ledgerSignState.loading}
                  isDisabled={ledgerSignState.loading}
                  endIcon={<SystemIcon.TrailingIcon />}
                  title={t('Transfer')}
                  // type="submit"
                  onPress={onSubmit}
                >
                  {t('Transfer')}
                </Button>
              </div>
              <FormStatusNotification
                status={requestStatus.status}
                statusBodies={{
                  successful: t(
                    'The coins have been funded to the given account.',
                  ),
                }}
                body={requestStatus.message}
              />
              <Text>Target chain request key: {receiverRequestKey}</Text>
            </>
          ) : null}
        </Stack>
      </Stack>
    </section>
  );
};

export default TransferPage;
