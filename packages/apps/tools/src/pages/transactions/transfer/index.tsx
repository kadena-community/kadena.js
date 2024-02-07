import type { PredKey } from '@/components/Global';
import {
  AccountNameField,
  ChainSelect,
  HoverTag,
  NAME_VALIDATION,
  PredKeysSelect,
  PublicKeyField,
} from '@/components/Global';
import { menuData } from '@/constants/side-menu-items';
import { useToolbar } from '@/context/layout-context';
import useAccountDetails from '@/hooks/use-account-details';
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
  FormFieldHeader,
  Heading,
  Notification,
  Select,
  SelectItem,
  Stack,
  SystemIcon,
  TabItem,
  Tabs,
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
import LedgerDetails from './ledger-details';

const schema = z.object({
  sender: NAME_VALIDATION,
  senderChainId: z.enum(CHAINS),
  receiver: NAME_VALIDATION,
  amount: z.number().positive(),
  receiverChainId: z.enum(CHAINS),
  senderAccountName: z.string(),
  receiverAccountName: z.string(),
  pubKey: z.string(),
});

type FormData = z.infer<typeof schema>;

const TransferPage = () => {
  const router = useRouter();
  useToolbar(menuData, router.pathname);
  const { t } = useTranslation('common');
  const { selectedNetwork, networksData } = useWalletConnectClient();

  const [toASccountTab, setToAccountTab] = useState('existing');
  const [pred, onPredSelectChange] = useState<PredKey>('keys-all');

  const [pubKeys, setPubKeys] = useState<string[]>([]);

  const accountFromOptions = ['Ledger', 'WalletConnect'];

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

  const watchReceiver = watch('receiver');
  const watchReceiverChainId = watch('receiverChainId');
  const receiverQuery = useAccountDetails(
    watchReceiver,
    'testnet04',
    watchReceiverChainId,
  );
  const watchChains = watch(['senderChainId', 'receiverChainId']);
  const onSameChain = watchChains.every((chain) => chain === watchChains[0]);

  console.log('watchReceiver', {
    watchReceiver,
    watchReceiverChainId,
    watchChains,
    onSameChain,
  });

  console.log('receiver', receiverQuery);

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
      'receiverAccountName',
      typeof receiverName === 'string' && pubKeys.length > 0
        ? receiverName
        : '',
    );
  }, [receiverName, watchReceiverChainId, setValue, pubKeys.length]);

  const publicKey: string = ''; // FIXME

  const onSubmit = async (data: FormData) => {
    console.log('onsubmit', data);

    const result = await transfer(
      {
        sender: { account: `k:${publicKey}`, publicKeys: [publicKey] },
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

  const setReceiverAccountTab = (tabKey: string) => {
    setToAccountTab(tabKey);
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
    setValue('receiverAccountName', '');
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

              {/* from sander */}
              <Stack
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="stretch"
                gap="sm"
              >
                <FormFieldHeader label={t('Account')} />
                <LedgerDetails />
                <Controller
                  name="senderChainId"
                  control={control}
                  render={({ field }) => <ChainSelect {...field} />}
                />
                <AccountNameField
                  {...register('senderAccountName')}
                  isInvalid={!!errors.senderAccountName}
                  label={t('The account name to fund coins to')}
                  isDisabled
                  endAddon={
                    <Button
                      icon={<SystemIcon.ContentCopy />}
                      variant="text"
                      onPress={async () => {
                        const value = 'acccount-name';
                        await navigator.clipboard.writeText(value);
                      }}
                      aria-label="Copy Account Name"
                      title="Copy Account Name"
                      color="primary"
                      type="button"
                    />
                  }
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
                selectedKey={toASccountTab}
                onSelectionChange={setReceiverAccountTab}
              >
                <TabItem key="existing" title="Existing">
                  <div>
                    <AccountNameField
                      {...register('receiverAccountName')}
                      isInvalid={!!errors.receiverAccountName}
                      label={t('The account name to fund coins to')}
                      isDisabled
                      endAddon={
                        <Button
                          icon={<SystemIcon.ContentCopy />}
                          variant="text"
                          onPress={async () => {
                            const value = 'account-name';
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
                    <AccountNameField
                      {...register('receiverAccountName')}
                      isInvalid={!!errors.receiverAccountName}
                      label={t('The account name to fund coins to')}
                      isDisabled
                      endAddon={
                        <Button
                          icon={<SystemIcon.ContentCopy />}
                          variant="text"
                          onPress={async () => {
                            const value = 'acccount-name';
                            await navigator.clipboard.writeText(value);
                          }}
                          aria-label="Copy Account Name"
                          title="Copy Account Name"
                          color="primary"
                          type="button"
                        />
                      }
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
                type="submit"
              >
                {t('Sign')}
              </Button>
            </div>
          </Stack>
        </form>
      </Stack>
    </section>
  );
};

export default TransferPage;
