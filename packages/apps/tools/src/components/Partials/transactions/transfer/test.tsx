import { AccountNameField, ChainSelect } from '@/components/Global';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useAccountChainDetailsQuery } from '@/hooks/use-account-chain-details-query';
import type { useAccountDetailsQuery } from '@/hooks/use-account-details-query';
import { GasDefaults } from '@/hooks/use-ledger-sign';
import { chainSelectContainerClass } from '@/pages/transactions/transfer/styles.css';
import { MonoContentCopy } from '@kadena/react-icons/system';
import { Button, NumberField, Stack, Text } from '@kadena/react-ui';
import type { ChainId } from '@kadena/types';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { FormData } from './sign-form';
import { defaultValues } from './sign-form';

export interface ITestProps {
  isLedger: boolean;
  senderDataQuery: ReturnType<typeof useAccountDetailsQuery>;
  onChainUpdate: (chainId: ChainId) => void;
  isConnected?: boolean;
}

export const NON_EXISTING_ACCOUNT_ON_CHAIN = '—'; // "em dash" character

export const Test: FC<ITestProps> = ({
  isLedger,
  senderDataQuery,
  onChainUpdate,
  isConnected = false,
}) => {
  const { t } = useTranslation('common');

  const { selectedNetwork: network } = useWalletConnectClient();

  const {
    setValue,
    formState: { errors },
    register,
    control,
    watch,
  } = useFormContext<FormData>();

  const watchSender = watch('sender');

  const [chainSelectOptions, setChainSelectOptions] = useState<
    { chainId: ChainId; data: string | number }[]
  >([]);

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
            data: item.data
              ? `${item.data.balance.toFixed(4)} KDA`
              : NON_EXISTING_ACCOUNT_ON_CHAIN,
          })),
        );
      }
    } else {
      setChainSelectOptions([]); // reset to initial state
    }
  }, [senderAccountChains.isSuccess, senderAccountChains.data]);

  const watchAmount = watch('amount');

  const invalidAmount =
    senderDataQuery.data && senderDataQuery.data.balance < watchAmount;

  const invalidAmountMessage = senderDataQuery.data
    ? `Cannot send more than ${senderDataQuery.data.balance.toFixed(4)} KDA.`
    : '';

  if (isLedger && !isConnected) {
    return null;
  }

  return (
    <>
      <Controller
        name="sender"
        control={control}
        render={({ field }) => (
          <AccountNameField
            {...field}
            isDisabled={isLedger}
            id="sender-account-name"
            isInvalid={!!errors.sender}
            errorMessage={errors.sender?.message}
            endAddon={
              <Button
                icon={<MonoContentCopy />}
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
            description={isLedger ? t('unexpected-account-name') : undefined}
          />
        )}
      />

      <input
        type="hidden"
        {...register('isConnected', {
          value: !isLedger,
        })}
      />

      <Stack
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <div className={chainSelectContainerClass}>
          {/*<Controller*/}
          {/*  name="senderChainId"*/}
          {/*  control={control}*/}
          {/*  render={({ field: { onChange, value, ...rest } }) => (*/}
          {/*    <ChainSelect*/}
          {/*      {...rest}*/}
          {/*      selectedKey={value}*/}
          {/*      id="senderChainId"*/}
          {/*      onSelectionChange={(chainId) => {*/}
          {/*        onChange(chainId);*/}
          {/*        onChainUpdate(chainId);*/}
          {/*      }}*/}
          {/*      additionalInfoOptions={chainSelectOptions}*/}
          {/*      isInvalid={!!errors.senderChainId}*/}
          {/*      errorMessage={errors.senderChainId?.message}*/}
          {/*    />*/}
          {/*  )}*/}
          {/*/>*/}
          <ChainSelect
            {...register('senderChainId')}
            defaultSelectedKey={defaultValues.senderChainId}
            id="senderChainId"
            onSelectionChange={(chainId) => {
              // onChange(chainId);
              setValue('senderChainId', chainId);
              onChainUpdate(chainId);
            }}
            additionalInfoOptions={chainSelectOptions}
            isInvalid={!!errors.senderChainId}
            errorMessage={errors.senderChainId?.message}
            disabledKeys={chainSelectOptions
              .filter((x) => x.data === NON_EXISTING_ACCOUNT_ON_CHAIN)
              .map((x) => x.chainId)}
          />
        </div>
        {senderDataQuery.isFetching ? (
          <Text>{t('fetching-data')}</Text>
        ) : senderDataQuery.data ? (
          <Text>{senderDataQuery.data?.balance.toFixed(4)} KDA</Text>
        ) : (
          <Text>{t('No funds on selected chain.')}</Text>
        )}
      </Stack>

      {/*<Controller*/}
      {/*  name="amount"*/}
      {/*  control={control}*/}
      {/*  render={({ field: { onChange, ...rest } }) => (*/}
      {/*    <NumberField*/}
      {/*      {...rest}*/}
      {/*      id="ledger-transfer-amount"*/}
      {/*      label={t('Amount')}*/}
      {/*      onValueChange={(value) => onChange(value)}*/}
      {/*      isDisabled={!!senderData.error}*/}
      {/*      isInvalid={!!errors.amount || invalidAmount}*/}
      {/*      errorMessage={*/}
      {/*        invalidAmount ? invalidAmountMessage : errors.amount?.message*/}
      {/*      }*/}
      {/*      info={t('The amount of KDA to transfer.')}*/}
      {/*    />*/}
      {/*  )}*/}
      {/*/>*/}
      <NumberField
        {...register('amount')}
        id="ledger-transfer-amount"
        label={t('Amount')}
        onValueChange={(value) => setValue('amount', value)}
        minValue={0}
        // defaultValue={defaultValues.amount}
        isDisabled={!!senderDataQuery.error}
        isInvalid={!!errors.amount || invalidAmount}
        errorMessage={
          invalidAmount ? invalidAmountMessage : errors.amount?.message
        }
        info={t('The amount of KDA to transfer.')}
        description={
          isLedger
            ? `Gas price: ${GasDefaults.PRICE}, Gas limit: ${GasDefaults.LIMIT}`
            : undefined
        }
      />
    </>
  );
};
