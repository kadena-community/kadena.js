import React, { useEffect, useState } from 'react';

import { AccountNameField } from '@/components/Global/AccountNameField';
import {
  Box,
  Button,
  Heading,
  Notification,
  Stack,
  TabItem,
  Tabs,
  Text,
} from '@kadena/react-ui';
import { useFormContext } from 'react-hook-form';

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
import { MonoContentCopy, MonoInfo } from '@kadena/react-icons/system';
import type { ChainId } from '@kadena/types';
import { useDebounce } from 'react-use';
import type { SenderType } from './sign-form-sender';

type TabValue = 'new' | 'existing';

export const SignFormReceiver = ({
  onDataUpdate,
  onPubKeysUpdate,
  onPredicateUpdate,
  onChainUpdate,
  signingMethod,
}: {
  onDataUpdate: (data: AccountDetails | undefined) => void;
  onPubKeysUpdate: (pubKeys: string[]) => void;
  onPredicateUpdate: (pred: PredKey) => void;
  onChainUpdate: (chainId: ChainId) => void;
  signingMethod: SenderType;
}) => {
  const { t } = useTranslation('common');

  const isLedger = signingMethod === 'Ledger';

  const { selectedNetwork: network, networksData } = useWalletConnectClient();

  const {
    register,
    formState: { errors },
    getValues,
    watch,
    setValue,
  } = useFormContext<FormData>();

  const [chainSelectOptions, setChainSelectOptions] = useState<
    { chainId: ChainId; data: string | number }[]
  >([]);

  const [watchReceiver, watchChain] = watch(['receiver', 'receiverChainId']);

  const [debouncedValue, setDebouncedValue] = useState('');

  useDebounce(
    () => {
      setDebouncedValue(watchReceiver);
    },
    1000,
    [watchReceiver],
  );

  const receiverData = useAccountDetailsQuery({
    account: debouncedValue,
    networkId: network,
    chainId: watchChain,
  });

  const receiverAccountChains = useAccountChainDetailsQuery({
    account: debouncedValue,
    networkId: network,
  });

  useEffect(() => {
    if (receiverData.isSuccess) {
      if (receiverData?.data) {
        onDataUpdate(receiverData.data);
      }
    } else {
      onDataUpdate(undefined);
    }
  }, [onDataUpdate, receiverData.data, receiverData.isSuccess]);

  const [toAccountTab, setToAccountTab] = useState<TabValue>('existing');

  const renderAccountFieldWithChain = (tab: TabValue) => (
    <Stack flexDirection={'column'} gap={'md'}>
      <AccountNameField
        {...register('receiver')}
        id="receiver-account-name"
        isInvalid={!!errors.receiver}
        errorMessage={errors.receiver?.message}
        isDisabled={tab === 'new'}
        endAddon={
          <Button
            icon={<MonoContentCopy />}
            variant="text"
            onPress={async () => {
              await navigator.clipboard.writeText(getValues('receiver'));
            }}
            aria-label="Copy Account Name"
            title="Copy Account Name"
            color="primary"
            type="button"
          />
        }
        description={isLedger ? t('ledger-account-name-signing') : undefined}
      />
      <div className={chainSelectContainerClass}>
        <ChainSelect
          {...register('receiverChainId')}
          id="receiverChainId"
          onSelectionChange={(chainId) => {
            setValue('receiverChainId', chainId);
            onChainUpdate(chainId);
          }}
          additionalInfoOptions={chainSelectOptions}
          isInvalid={!!errors.receiverChainId}
          errorMessage={errors.receiverChainId?.message}
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
            data: item.data ? 'existing' : 'new',
          })),
        );
      }
    } else {
      setChainSelectOptions([]); // reset to initial state
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
                <MonoInfo />
                <Text as={'span'} color={'emphasize'}>
                  {t('fetching-data')}
                </Text>
              </Stack>
            ) : null}
          </Box>
        </TabItem>

        <TabItem key="new" title="New">
          <Stack flexDirection={'column'} gap={'md'} padding={'xs'}>
            {isLedger && (
              <Notification role="alert" intent="info" isDismissable>
                {t('ledger-account-creation-info')}
              </Notification>
            )}
            <AddPublicKeysSection
              publicKeys={pubKeys}
              deletePubKey={deletePublicKey}
              setPublicKeys={(keys) => {
                setPubKeys(keys);
                onPubKeysUpdate(keys);
              }}
              initialPublicKey={initialPublicKey}
              maxKeysAmount={isLedger ? 1 : undefined}
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
                <MonoInfo />
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
