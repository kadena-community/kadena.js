import React, { useEffect, useState } from 'react';

import {
  Heading,
  NumberField,
  Select,
  SelectItem,
  Stack,
  Text,
} from '@kadena/react-ui';

import Link from 'next/link';

import { ChainSelect } from '@/components/Global/ChainSelect';
import { LoadingCard } from '@/components/Global/LoadingCard';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useAccountChainDetailsQuery } from '@/hooks/use-account-chain-details-query';
import type { AccountDetails } from '@/hooks/use-account-details-query';
import { useAccountDetailsQuery } from '@/hooks/use-account-details-query';
import type { DerivationMode } from '@/hooks/use-ledger-public-key';
import {
  chainSelectContainerClass,
  notificationLinkStyle,
} from '@/pages/transactions/transfer/styles.css';
import type { ChainId } from '@kadena/types';
import useTranslation from 'next-translate/useTranslation';
import { Controller, useFormContext } from 'react-hook-form';
import { SenderDetails } from './sender-details';
import type { FormData } from './sign-form';

export const accountFromOptions = [
  'Ledger',
  'Coming soon…',
  'Wallet Connect',
] as const;
export type SenderType = (typeof accountFromOptions)[number];

export const SignFormSender = ({
  onDataUpdate,
  onKeyIdUpdate,
  onDerivationUpdate,
  onChainUpdate,
}: {
  onDataUpdate: (data: AccountDetails) => void;
  onKeyIdUpdate: (keyId: number) => void;
  onDerivationUpdate: (derivationMode: DerivationMode) => void;
  onChainUpdate: (chainId: ChainId) => void;
}) => {
  const { t } = useTranslation('common');
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<FormData>();
  const [chainSelectOptions, setChainSelectOptions] = useState<
    { chainId: ChainId; data: string | number }[]
  >([]);

  const { selectedNetwork: network } = useWalletConnectClient();

  const [watchSender, watchChain] = watch(['sender', 'senderChainId']);

  const senderData = useAccountDetailsQuery({
    account: watchSender,
    networkId: network,
    chainId: watchChain,
  });

  useEffect(() => {
    if (senderData.isSuccess) {
      onDataUpdate(senderData.data);
    }
  }, [onDataUpdate, senderData.data, senderData.isSuccess]);

  const senderAccountChains = useAccountChainDetailsQuery({
    account: watchSender,
    networkId: network,
  });

  useEffect(() => {
    if (senderAccountChains.isSuccess) {
      if (senderAccountChains?.data) {
        setChainSelectOptions(
          senderAccountChains.data.map((item) => ({
            chainId: item.chainId,
            data: item.data ? `${item.data.balance.toFixed(4)} KDA` : 'N/A',
          })),
        );
      }
    }
  }, [senderAccountChains.isSuccess, senderAccountChains.data]);

  const watchAmount = watch('amount');

  const invalidAmount =
    senderData.data && senderData.data.balance < watchAmount;

  const invalidAmountMessage = senderData.data
    ? `Cannot send more than ${senderData.data.balance.toFixed(4)} KDA.`
    : '';

  const [senderType, setSenderType] = useState<SenderType>('Ledger');

  return (
    <LoadingCard fullWidth isLoading={senderData.isFetching}>
      <Heading as={'h5'}>{t('Sender')} </Heading>

      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Select
          label="From"
          placeholder="Select an option"
          selectedKey={senderType}
          disabledKeys={['Coming soon…']}
          onSelectionChange={(x) => {
            setSenderType(x as SenderType);
          }}
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
        <SenderDetails
          type={senderType}
          onKeyIdUpdate={onKeyIdUpdate}
          onDerivationUpdate={onDerivationUpdate}
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
                  onSelectionChange={(chainId) => {
                    onChange(chainId);
                    onChainUpdate(chainId);
                  }}
                  additionalInfoOptions={chainSelectOptions}
                  isInvalid={!!errors.senderChainId}
                  errorMessage={errors.senderChainId?.message}
                />
              )}
            />
          </div>
          {senderData.isFetching ? (
            <Text>{t('fetching-data')}</Text>
          ) : senderData.data ? (
            <Text>{senderData.data?.balance} KDA</Text>
          ) : (
            <Text>{t('No funds on selected chain.')}</Text>
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
                invalidAmount ? invalidAmountMessage : errors.amount?.message
              }
              info={t('The amount of KDA to transfer.')}
            />
          )}
        />
      </Stack>
    </LoadingCard>
  );
};

export default SignFormSender;
