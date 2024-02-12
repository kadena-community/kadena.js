import type { PredKey } from '@/components/Global';
import {
  AccountHoverTag,
  AccountNameField,
  ChainSelect,
  HoverTag,
  NAME_VALIDATION,
  PredKeysSelect,
  PublicKeyField,
} from '@/components/Global';
import { menuData } from '@/constants/side-menu-items';
import { useToolbar } from '@/context/layout-context';
// import useAccountDetails from '@/hooks/use-account-details';
import { useAccountDetailsQuery } from '@/hooks/use-account-details-query';

import {
  buttonContainerClass,
  chainSelectContainerClass,
} from '@/pages/faucet/styles.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { CHAINS } from '@kadena/chainweb-node-client';
// import { createSignWithLedger } from '@kadena/client';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { pubKeysContainerStyle } from '@/pages/faucet/new/styles.css';
import { notificationLinkStyle } from '@/pages/transactions/cross-chain-transfer-finisher/styles.css';
import { createPrincipal } from '@/services/faucet/create-principal';
import { validatePublicKey } from '@/services/utils/utils';
import { stripAccountPrefix } from '@/utils/string';
import { transfer } from '@kadena/client-utils/coin';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  Combobox,
  ComboboxItem,
  FormFieldHeader,
  Heading,
  Notification,
  Select,
  SelectItem,
  Stack,
  SystemIcon,
  TabItem,
  Tabs,
  Text,
  TextField,
} from '@kadena/react-ui';
import { useQuery } from '@tanstack/react-query';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { containerClass } from '../styles.css';
// import LedgerDetails from './ledger-details';
import { Toggle } from '@/components/Global/Toggle';
import TransactionDetails from '@/pages/transactions/transfer/transaction-details';

const schema = z.object({
  sender: NAME_VALIDATION,
  senderChainId: z.enum(CHAINS),
  receiver: NAME_VALIDATION,
  amount: z.number().positive(),
  receiverChainId: z.enum(CHAINS),
  // senderAccountName: z.string(),
  // receiverAccountName: z.string(),
  pubKey: z.string(),
});

type FormData = z.infer<typeof schema>;

const TransferPage = () => {
  const router = useRouter();
  useToolbar(menuData, router.pathname);
  const { t } = useTranslation('common');
  const { selectedNetwork, networksData } = useWalletConnectClient();

  const [toAccountTab, setToAccountTab] = useState('existing');
  const [pred, onPredSelectChange] = useState<PredKey>('keys-all');

  const [pubKeys, setPubKeys] = useState<string[]>([]);
  const [legacyToggleOn, setLegacyToggleOn] = useState<boolean>(false);
  const [senderPublicKey, setSenderPublicKey] = useState<string>('');
  // const [transactionDetailsExpanded, setTransactionDetailsExpanded] = useState(false);

  const accountFromOptions = ['Ledger', 'WalletConnect'];
  const ledgerOptions = Array.from({ length: 100 }, (_, i) => ({
    label: `${i}`,
    value: i,
  }));

  console.log(setSenderPublicKey);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    getValues,
    setError,
    resetField,
    setValue,
    clearErrors,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { senderChainId: CHAINS[0], receiverChainId: CHAINS[0] },
  });

  const {
    error: senderError,
    data: senderDetails,
    isFetching: isFetchingSender,
  } = useAccountDetailsQuery({
    account: getValues('sender'),
    networkId: 'testnet04',
    chainId: '1',
  });

  console.log('SENDER QUERY: ');
  console.log('error, details: ', senderError, senderDetails, isFetchingSender);

  const {
    error: receiverError,
    data: receiverDetails,
    isFetching: isFetchingReceiver,
  } = useAccountDetailsQuery({
    account: getValues('receiver'),
    networkId: 'testnet04',
    chainId: getValues('receiverChainId'),
  });

  console.log('RECEIVER QUERY: ');
  console.log(
    'error, details: ',
    receiverError,
    receiverDetails,
    isFetchingReceiver,
  );

  const watchReceiver = watch('receiver');
  const watchReceiverChainId = watch('receiverChainId');
  // const receiverQuery = useAccountDetails(
  //   watchReceiver,
  //   'testnet04',
  //   watchReceiverChainId,
  // );
  const watchChains = watch(['senderChainId', 'receiverChainId']);
  const onSameChain = watchChains.every((chain) => chain === watchChains[0]);

  console.log('watchReceiver', {
    watchReceiver,
    watchReceiverChainId,
    watchChains,
    onSameChain,
  });

  // console.log('receiver', receiverQuery);

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

  // const publicKey: string = ''; // FIXME

  const onSubmit = async (data: FormData) => {
    console.log('onsubmit', data);

    const result = await transfer(
      {
        sender: { account: `k:${pubKeys[0]}`, publicKeys: [...pubKeys] },
        receiver: data.receiver,
        // receiver: {
        //   account: data.receiver,
        //   // keyset: {
        //   //   keys: string[];
        //   //   pred: 'keys-all' | 'keys-2' | 'keys-any';
        //   // };
        // },
        amount: `${data.amount}`,
        // targetChainId: data.receiverChainId,
        chainId: data.receiverChainId,
      },
      {
        // @ts-ignore
        sign: () => {},
        host: ({ networkId, chainId }) =>
          `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
        defaults: { networkId: 'testnet04' },
      },
    )
      .on('sign', (data) => console.log('transfer - sign', data))
      .on('preflight', (data) => console.log('transfer - preflight', data))
      .on('submit', (data) => console.log('transfer - submit', data))
      .on('listen', (data) => console.log('transfer - listen', data))
      .execute();

    console.log('result', result);
  };

  const setReceiverAccountTab = (value: any) => {
    setToAccountTab(value);
  };

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
    setValue('receiver', '');
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
          icon="TrashCan"
          maskOptions={{ headLength: 4, character: '.' }}
        />
      ))}
    </div>
  );

  const setLegacyOn = () => {
    setLegacyToggleOn(!legacyToggleOn);
  };

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
        <Notification role="alert">
          Please visit{' '}
          <a
            href="https://support.ledger.com/hc/en-us/articles/7415959614109?docs=true"
            target="_blank"
            rel="noreferrer"
          >
            the Ledger docs
          </a>{' '}
          for more information.
        </Notification>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack flexDirection="column" gap="lg">
            {/* SENDER  FLOW */}
            <Card fullWidth>
              <Heading as={'h5'}>{t('Sender')} </Heading>
              {/* new */}

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
                  Find your key
                </Link>
              </Stack>

              <Stack
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="stretch"
                gap="sm"
              >
                <FormFieldHeader label={t('Account')} />
                {/*<LedgerDetails />*/}
                <>
                  <Combobox
                    startIcon={<SystemIcon.KeyIconFilled />}
                    allowsCustomValue
                    defaultItems={ledgerOptions}
                  >
                    {(item) => (
                      <ComboboxItem key={`ledger-key-${item.value}`}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </Combobox>
                  {senderPublicKey ? (
                    <AccountHoverTag value={senderPublicKey.slice(0, 15)} />
                  ) : (
                    <Text as="code">
                      Connect with your ledger to fetch your key
                    </Text>
                  )}
                </>

                <div className={chainSelectContainerClass}>
                  <Controller
                    name="senderChainId"
                    control={control}
                    render={({ field }) => (
                      <ChainSelect {...field} id="senderChainId" />
                    )}
                  />
                </div>

                <Toggle
                  label={'is Legacy'}
                  toggled={legacyToggleOn}
                  onClick={setLegacyOn}
                />

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
                            const value = getValues('sender');
                            await navigator.clipboard.writeText(value);
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
                <TextField
                  {...register('amount', { valueAsNumber: true })}
                  id="ledger-transfer-amount"
                  label="Amount"
                  isInvalid={!!errors.amount}
                  errorMessage={errors.amount?.message}
                  info="The amount of KDA to transfer."
                />
              </Stack>
            </Card>

            {/* RECEIVER FLOW */}
            <Card fullWidth>
              <FormFieldHeader label={t('Receiver')} />

              <Tabs
                aria-label="receiver-account-tabs"
                selectedKey={toAccountTab}
                onSelectionChange={setReceiverAccountTab}
              >
                <TabItem key="existing" title="Existing">
                  <div>
                    <Controller
                      name="receiver"
                      control={control}
                      render={({ field }) => (
                        <AccountNameField
                          {...field}
                          isInvalid={!!errors.receiver}
                          label={t('The account name to fund coins to')}
                          endAddon={
                            <Button
                              icon={<SystemIcon.ContentCopy />}
                              variant="text"
                              onPress={async () => {
                                const value = getValues('receiver');
                                await navigator.clipboard.writeText(value);
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
                  </div>
                  <div className={chainSelectContainerClass}>
                    <Controller
                      name="receiverChainId"
                      control={control}
                      render={({ field }) => (
                        <ChainSelect {...field} id="receiverChainId" />
                      )}
                    />
                  </div>
                </TabItem>

                <TabItem key="new" title="New">
                  <div>
                    <Controller
                      name="receiver"
                      control={control}
                      render={({ field }) => (
                        <AccountNameField
                          {...field}
                          isInvalid={!!errors.receiver}
                          label={t('The account name to fund coins to')}
                          placeholder={'Generated Account Name'}
                          isDisabled
                          endAddon={
                            <Button
                              icon={<SystemIcon.ContentCopy />}
                              variant="text"
                              onPress={async () => {
                                const value = getValues('receiver');
                                await navigator.clipboard.writeText(value);
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
                              icon={<SystemIcon.Plus />}
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
                  </div>
                  <div className={chainSelectContainerClass}>
                    <Controller
                      name="receiverChainId"
                      control={control}
                      render={({ field }) => (
                        <ChainSelect {...field} id="receiverChainId" />
                      )}
                    />
                  </div>
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
              >
                {t('Sign')}
              </Button>
            </div>

            <TransactionDetails network={selectedNetwork} />

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
          </Stack>
        </form>
      </Stack>
    </section>
  );
};

export default TransferPage;
