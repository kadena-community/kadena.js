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

import { zodResolver } from '@hookform/resolvers/zod';
import { CHAINS } from '@kadena/chainweb-node-client';
// import { createSignWithLedger } from '@kadena/client';
import AddPublicKeysSection from '@/components/Global/AddPublicKeysSection';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import {
  buttonContainerClass,
  chainSelectContainerClass,
  notificationLinkStyle,
} from './styles.css';
// import TransactionDetails from '@/pages/transactions/transfer/transaction-details';
import { createPrincipal } from '@/services/faucet/create-principal';
import { stripAccountPrefix } from '@/utils/string';
// import { transfer } from '@kadena/client-utils/coin';
import useLedgerPublicKey, {
  derivationModes,
} from '@/hooks/use-ledger-public-key';
import { useLedgerSign } from '@/hooks/use-ledger-sign';
import type { ISubmitTxResponseBody } from '@/services/transfer/submit-transaction';
import { pollResult, submitTx } from '@/services/transfer/submit-transaction';
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
  const { selectedNetwork, networksData } = useWalletConnectClient();

  const [toAccountTab, setToAccountTab] = useState('existing');
  const [keyId, setKeyId] = useState<number>();
  const [pred, onPredSelectChange] = useState<PredKey>('keys-all');

  const [pubKeys, setPubKeys] = useState<string[]>([]);
  // const [legacyToggleOn, setLegacyToggleOn] = useState<boolean>(false);
  // const [senderPublicKey, setSenderPublicKey] = useState<string>('');
  const [initialPublicKey, setInitialPublicKey] = useState<string>('');
  const [signedTx, setSignedTx] = useState<any | undefined>(undefined);
  const [requestStatus, setRequestStatus] = useState<{
    status: FormStatus;
    message?: string;
  }>({ status: 'idle' });
  const [legacyToggleOn, setLegacyToggleOn] = useState<boolean>(false);
  const derivationMode = legacyToggleOn
    ? derivationModes[1]
    : derivationModes[0];

  const accountFromOptions = ['Ledger', 'WalletConnect'];

  console.log(keyId);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
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
    networkId: 'testnet04',
    chainId: getValues('senderChainId'),
  });

  const [
    {
      error: ledgerError,
      value: ledgerPublicKey,
      loading: isFetchingLedgerPublicKey,
    },
    getPublicKey,
  ] = useLedgerPublicKey();

  console.log(
    'ledger stuff',
    ledgerError,
    ledgerPublicKey,
    isFetchingLedgerPublicKey,
  );

  useEffect(() => {
    if (ledgerPublicKey) {
      setValue('sender', `k:${ledgerPublicKey}`);
    }
  }, [ledgerPublicKey, setValue]);

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
    networkId: 'testnet04',
    chainId: getValues('receiverChainId'),
  });

  const { data: receiverName } = useQuery({
    queryKey: [
      'receiverName',
      pubKeys,
      watchReceiverChainId,
      pred,
      selectedNetwork,
      networksData,
    ],
    queryFn: () => createPrincipal(pubKeys, watchReceiverChainId, pred),
    enabled: pubKeys.length > 0,
    placeholderData: '',
    keepPreviousData: true,
  });

  useEffect(() => {
    setValue(
      'receiver',
      typeof receiverName === 'string' && pubKeys.length > 0
        ? receiverName
        : '',
    );
  }, [receiverName, watchReceiverChainId, setValue, pubKeys.length]);

  const invalidAmount =
    senderData.data && senderData.data.balance < watchAmount;
  const invalidAmountMessage = senderData.data
    ? `Cannot send more than ${senderData.data.balance.toFixed(4)} KDAs.`
    : '';

  const isReceiverAccountInvalid =
    receiverData?.error &&
    (receiverData?.error as { message: string }).message.includes(
      'row not found',
    );

  if (toAccountTab === 'existing' && isReceiverAccountInvalid) {
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

  const transferInput = {
    sender: {
      account: senderData.data?.account ?? '',
      publicKeys: ledgerPublicKey ? [ledgerPublicKey] : [],
    },
    receiver: isReceiverAccountInvalid
      ? {
          account: receiverData.data?.account ?? '',
          keyset: {
            keys: pubKeys,
            pred: pred,
          },
        }
      : receiverData.data?.account ?? '',
    chainId: getValues('senderChainId'),
    amount: String(getValues('amount')),
    targetChainId: onSameChain ? getValues('receiverChainId') : undefined,
  };

  const [{ error: signLedgerError, loading: isFetchingSigning }, signTx] =
    useLedgerSign();

  console.log(signLedgerError, isFetchingSigning);

  const handleSignTransaction = async () => {
    const { isSigned, pactCommand } = await signTx(transferInput, {
      networkId: 'Testnet04',
      derivationPath: derivationMode,
    });
    console.log('isSigned', isSigned);
    console.log('pact command', pactCommand);
    if (isSigned) {
      setSignedTx(pactCommand);
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log('onsubmit', data);

    const submitResponse = (await submitTx(
      signedTx,
      getValues('receiverChainId'),
      selectedNetwork,
      networksData,
    )) as ITransactionDescriptor;

    console.log(submitResponse);

    const pollResponse = pollResult(
      getValues('receiverChainId'),
      selectedNetwork,
      networksData,
      submitResponse,
    ) as unknown as ISubmitTxResponseBody;
    console.log(pollResponse);

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
  };

  const renderAccountFieldWithChain = (tab: string) => (
    <Stack flexDirection={'column'} gap={'md'}>
      <div className={chainSelectContainerClass}>
        <Controller
          name="receiverChainId"
          control={control}
          render={({ field }) => (
            <ChainSelect
              {...field}
              id="receiverChainId"
              onSelectionChange={(e) => setValue('receiverChainId', e)}
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
        <form onSubmit={handleSubmit(onSubmit)}>
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
                      render={({ field }) => (
                        <ChainSelect
                          {...field}
                          id="senderChainId"
                          onSelectionChange={(e) =>
                            setValue('senderChainId', e)
                          }
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
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <NumberField
                      {...field}
                      id="ledger-transfer-amount"
                      label={t('Amount')}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                  </Stack>
                </TabItem>
              </Tabs>
            </Card>

            <div className={buttonContainerClass}>
              <Button
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
                endIcon={<SystemIcon.TrailingIcon />}
                title={t('Sign')}
                type="button"
                onClick={handleSignTransaction}
              >
                {t('Sign')}
              </Button>
            </div>

            {signedTx ? (
              <>
                {/*<TransactionDetails transaction={signedTx} />*/}
                <div className={buttonContainerClass}>
                  <Button
                    isLoading={isSubmitting}
                    isDisabled={isSubmitting}
                    endIcon={<SystemIcon.TrailingIcon />}
                    title={t('Transfer')}
                    type="submit"
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
              </>
            ) : null}
          </Stack>
        </form>
      </Stack>
    </section>
  );
};

export default TransferPage;
