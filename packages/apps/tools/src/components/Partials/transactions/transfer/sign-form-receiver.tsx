import React, { useEffect, useState } from 'react';

import { AccountNameField } from '@/components/Global/AccountNameField';
import {
  Box,
  Button,
  Heading,
  Stack,
  SystemIcon,
  TabItem,
  Tabs,
  Text,
} from '@kadena/react-ui';
import { Controller, useFormContext } from 'react-hook-form';

import { ChainSelect } from '@/components/Global/ChainSelect';
import type { PredKey } from '@/components/Global/PredKeysSelect';
import { PredKeysSelect } from '@/components/Global/PredKeysSelect';
import { AddPublicKeysSection } from '@/components/Partials/transactions/transfer/add-public-keys';
import { chainSelectContainerClass } from '@/pages/transactions/transfer/styles.css';

import { useWalletConnectClient } from '@/context/connect-wallet-context';
import type { AccountDetails } from '@/hooks/use-account-details-query';
import { useAccountDetailsQuery } from '@/hooks/use-account-details-query';
import { stripAccountPrefix } from '@/utils/string';
import { useQuery } from '@tanstack/react-query';
import useTranslation from 'next-translate/useTranslation';
import type { FormData } from './sign-form';

import { LoadingCard } from '@/components/Global/LoadingCard';
import { useAccountChainDetailsQuery } from '@/hooks/use-account-chain-details-query';
import { createPrincipal } from '@/services/faucet/create-principal';
import type { ChainId } from '@kadena/types';

type TabValue = 'new' | 'existing';

export const SignFormReceiver = ({
  onDataUpdate,
  onPubKeysUpdate,
  onPredicateUpdate,
  onChainUpdate,
}: {
  onDataUpdate: (data: AccountDetails) => void;
  onPubKeysUpdate: (pubKeys: string[]) => void;
  onPredicateUpdate: (pred: PredKey) => void;
  onChainUpdate: (chainId: ChainId) => void;
}) => {
  const { t } = useTranslation('common');

  const { selectedNetwork: network, networksData } = useWalletConnectClient();

  const {
    control,
    formState: { errors },
    getValues,
    watch,
    setValue,
  } = useFormContext<FormData>();

  const [chainSelectOptions, setChainSelectOptions] = useState<
    { chainId: ChainId; data: string | number }[]
  >([]);

  const [watchReceiver, watchChain] = watch(['receiver', 'receiverChainId']);

  const receiverData = useAccountDetailsQuery({
    account: watchReceiver,
    networkId: network,
    chainId: watchChain,
  });

  const receiverAccountChains = useAccountChainDetailsQuery({
    account: getValues('receiver'),
    networkId: network,
  });

  useEffect(() => {
    if (receiverData.isSuccess) {
      if (receiverData?.data) {
        onDataUpdate(receiverData.data);
      }
    }
  }, [onDataUpdate, receiverData.data, receiverData.isSuccess]);

  const [toAccountTab, setToAccountTab] = useState<TabValue>('existing');

  const renderAccountFieldWithChain = (tab: TabValue) => (
    <Stack flexDirection={'column'} gap={'md'}>
      <Controller
        name="receiver"
        control={control}
        defaultValue={''}
        render={({ field }) => (
          <AccountNameField
            {...field}
            id="receiver-account-name"
            isInvalid={!!errors.receiver}
            errorMessage={errors.receiver?.message}
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
              onSelectionChange={(chainId) => {
                onChange(chainId);
                onChainUpdate(chainId);
              }}
              additionalInfoOptions={chainSelectOptions}
              isInvalid={!!errors.receiverChainId}
              errorMessage={errors.receiverChainId?.message}
            />
          )}
        />
      </div>
    </Stack>
  );

  const [pubKeys, setPubKeys] = useState<string[]>([]);

  const [initialPublicKey, setInitialPublicKey] = useState<string>('');

  const deletePublicKey = () => setValue('receiver', '');

  const [pred, onPredSelectChange] = useState<PredKey>('keys-all');

  if (toAccountTab === 'existing' && receiverData?.error) {
    setToAccountTab('new');
    setInitialPublicKey('');
    if (getValues('receiver').startsWith('k:')) {
      setPubKeys([stripAccountPrefix(getValues('receiver'))]);
    }
  }

  if (toAccountTab === 'new' && receiverData?.data) {
    setTimeout(() => {
      setToAccountTab('existing');
    }, 500);
  }

  const watchReceiverChainId = watch('receiverChainId');

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

  useEffect(() => {
    if (receiverAccountChains.isSuccess) {
      if (receiverAccountChains?.data) {
        setChainSelectOptions(
          receiverAccountChains.data.map((item) => ({
            chainId: item.chainId,
            data: item.data ? `existing` : 'new',
          })),
        );
      }
    }
  }, [receiverAccountChains.isSuccess, receiverAccountChains.data]);

  return (
    <LoadingCard fullWidth isLoading={receiverData.isFetching}>
      <Heading as={'h5'}>{t('Receiver')} </Heading>
      <Tabs
        aria-label="receiver-account-tabs"
        selectedKey={toAccountTab}
        onSelectionChange={(value) => setToAccountTab(value as TabValue)}
      >
        <TabItem key="existing" title="Existing">
          <Box padding={'xs'}>
            {renderAccountFieldWithChain('existing')}
            {receiverAccountChains.isFetching ? (
              <Stack flexDirection={'row'} marginBlockStart={'md'}>
                <SystemIcon.Information />
                <Text as={'span'} color={'emphasize'}>
                  {t('fetching-data')}
                </Text>
              </Stack>
            ) : null}
          </Box>
        </TabItem>

        <TabItem key="new" title="New">
          <Stack flexDirection={'column'} gap={'md'} padding={'xs'}>
            <AddPublicKeysSection
              publicKeys={pubKeys}
              deletePubKey={deletePublicKey}
              setPublicKeys={(keys) => {
                setPubKeys(keys);
                onPubKeysUpdate(keys);
              }}
              initialPublicKey={initialPublicKey}
            />
            {pubKeys.length > 1 ? (
              <PredKeysSelect
                onSelectionChange={(pred) => {
                  onPredSelectChange(pred);
                  onPredicateUpdate(pred);
                }}
                selectedKey={pred}
                aria-label="Select Predicate"
              />
            ) : null}

            {renderAccountFieldWithChain('new')}

            {receiverAccountChains.isFetching ? (
              <Stack flexDirection={'row'} marginBlockStart={'md'}>
                <SystemIcon.Information />
                <Text as={'span'} color={'emphasize'}>
                  {t('fetching-data')}
                </Text>
              </Stack>
            ) : null}
          </Stack>
        </TabItem>
      </Tabs>
    </LoadingCard>
  );
};

export default SignFormReceiver;
