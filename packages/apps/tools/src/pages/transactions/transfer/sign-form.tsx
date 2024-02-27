import React, { useEffect, useState } from 'react';

import {
  Button,
  Card,
  Heading,
  NumberField,
  Select,
  SelectItem,
  Stack,
  SystemIcon,
  TabItem,
  Tabs,
  Text,
} from '@kadena/react-ui';

import {
  AccountNameField,
  NAME_VALIDATION,
} from '@/components/Global/AccountNameField';
import AddPublicKeysSection from '@/components/Global/AddPublicKeysSection';
import { ChainSelect } from '@/components/Global/ChainSelect';
import { FormStatusNotification } from '@/components/Global/FormStatusNotification';
import type { PredKey } from '@/components/Global/PredKeysSelect';
import { PredKeysSelect } from '@/components/Global/PredKeysSelect';
import type { DerivationMode } from '@/hooks/use-ledger-public-key';
import useLedgerPublicKey, {
  derivationModes,
  getDerivationPath,
} from '@/hooks/use-ledger-public-key';
import type {
  ICreateTransferInput,
  ICrossChainInput,
  TransferInput,
} from '@/hooks/use-ledger-sign';
import { useLedgerSign } from '@/hooks/use-ledger-sign';
import { zodResolver } from '@hookform/resolvers/zod';
import { CHAINS } from '@kadena/chainweb-node-client';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import LedgerDetails from './ledger-details';

import {
  buttonContainerClass,
  chainSelectContainerClass,
  notificationLinkStyle,
} from './styles.css';

import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useAccountDetailsQuery } from '@/hooks/use-account-details-query';
import { createPrincipal } from '@/services/faucet/create-principal';
import { stripAccountPrefix } from '@/utils/string';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const accountFromOptions = ['Ledger', 'WalletConnect'] as const;

const schema = z.object({
  sender: NAME_VALIDATION,
  senderChainId: z.enum(CHAINS),
  receiver: NAME_VALIDATION,
  amount: z.number().positive(),
  receiverChainId: z.enum(CHAINS),
});

type FormData = z.infer<typeof schema>;

export const SignForm = () => {
  const { t } = useTranslation('common');

  const [ledgerSignState, signTx] = useLedgerSign();

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

  const [keyId, setKeyId] = useState<number>();
  const [pred, onPredSelectChange] = useState<PredKey>('keys-all');

  const [pubKeys, setPubKeys] = useState<string[]>([]);
  const [initialPublicKey, setInitialPublicKey] = useState<string>('');

  const deletePublicKey = () => setValue('receiver', '');

  const [toAccountTab, setToAccountTab] = useState<'new' | 'existing'>(
    'existing',
  );

  const [legacyToggleOn, setLegacyToggleOn] = useState<boolean>(false);
  const derivationMode: DerivationMode = legacyToggleOn
    ? derivationModes[1]
    : derivationModes[0];

  const { selectedNetwork: network, networksData } = useWalletConnectClient();

  const senderData = useAccountDetailsQuery({
    account: getValues('sender'),
    networkId: network,
    chainId: getValues('senderChainId'),
  });

  const receiverData = useAccountDetailsQuery({
    account: getValues('receiver'),
    networkId: network,
    chainId: getValues('receiverChainId'),
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
    ? `Cannot send more than ${senderData.data.balance.toFixed(4)} KDA.`
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

  const handleSignTransaction = async (data: FormData) => {
    let transferInput: TransferInput;

    transferInput = {
      sender: {
        account: senderData.data?.account ?? '',
        publicKeys: ledgerPublicKey ? [ledgerPublicKey] : [],
      },
      receiver: receiverData.data?.account ?? '',
      chainId: data.senderChainId,
      amount: String(data.amount),
    };

    if (!onSameChain) {
      const xChainTransferInput: ICrossChainInput = {
        ...transferInput,
        receiver: {
          account: transferInput.receiver || data.receiver,
          keyset: {
            keys: receiverData.data?.guard.keys || pubKeys,
            pred: (receiverData.data?.guard.pred as PredKey) || pred,
          },
        },
        targetChainId: data.receiverChainId,
      };
      transferInput = xChainTransferInput;
    } else if (toAccountTab === 'new') {
      const createTransferInput: ICreateTransferInput = {
        ...transferInput,
        receiver: {
          account: data.receiver,
          keyset: {
            keys: pubKeys,
            pred: pred,
          },
        },
      };
      transferInput = createTransferInput;
    }

    await signTx(transferInput, {
      networkId: network,
      derivationPath: getDerivationPath(keyId!, derivationMode),
    });
  };

  const renderAccountFieldWithChain = (tab: string) => (
    <Stack flexDirection={'column'} gap={'md'}>
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
    </Stack>
  );

  return (
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

            <Stack
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
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
              {senderData.isFetching ? (
                <Text>Fetching account balance...</Text>
              ) : senderData.data ? (
                <Text>{senderData.data?.balance} KDA</Text>
              ) : (
                <Text>No funds on selected chain.</Text>
              )}
            </Stack>

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

                {renderAccountFieldWithChain('new')}

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
            isLoading={receiverData.isFetching || ledgerSignState.loading}
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
  );
};
