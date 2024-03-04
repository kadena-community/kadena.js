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
  Text,
} from '@kadena/react-ui';

import Link from 'next/link';

import { AccountNameField } from '@/components/Global/AccountNameField';
import { ChainSelect } from '@/components/Global/ChainSelect';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import type { AccountDetails } from '@/hooks/use-account-details-query';
import { useAccountDetailsQuery } from '@/hooks/use-account-details-query';
import type { DerivationMode } from '@/hooks/use-ledger-public-key';
import useLedgerPublicKey, {
  derivationModes,
} from '@/hooks/use-ledger-public-key';
import {
  chainSelectContainerClass,
  notificationLinkStyle,
} from '@/pages/transactions/transfer/styles.css';
import type { ChainId } from '@kadena/types';
import useTranslation from 'next-translate/useTranslation';
import { Controller, useFormContext } from 'react-hook-form';
import { LedgerDetails } from './ledger-details';
import type { FormData } from './sign-form';

const accountFromOptions = ['Ledger', 'Coming soon…'] as const;

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
    getValues,
    watch,
    setValue,
  } = useFormContext<FormData>();

  const { selectedNetwork: network } = useWalletConnectClient();

  const senderData = useAccountDetailsQuery({
    account: getValues('sender'),
    networkId: network,
    chainId: getValues('senderChainId'),
  });

  useEffect(() => {
    if (senderData.isSuccess) {
      onDataUpdate(senderData.data);
    }
  }, [onDataUpdate, senderData.data, senderData.isSuccess]);

  const watchAmount = watch('amount');

  const invalidAmount =
    senderData.data && senderData.data.balance < watchAmount;

  const invalidAmountMessage = senderData.data
    ? `Cannot send more than ${senderData.data.balance.toFixed(4)} KDA.`
    : '';

  const [legacyToggleOn, setLegacyToggleOn] = useState<boolean>(false);

  const [{ value: ledgerPublicKey, error }, getPublicKey] =
    useLedgerPublicKey();

  useEffect(() => {
    if (ledgerPublicKey) {
      setValue('sender', `k:${ledgerPublicKey}`);
    }
  }, [ledgerPublicKey, setValue]);

  const derivationMode: DerivationMode = legacyToggleOn
    ? derivationModes[1]
    : derivationModes[0];

  useEffect(() => {
    onDerivationUpdate(derivationMode);
  }, [derivationMode, onDerivationUpdate]);

  return (
    <Card fullWidth>
      <Heading as={'h4'}>{t('Sender')} </Heading>

      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Select
          label="From"
          placeholder="Select an option"
          selectedKey={'Ledger'}
          disabledKeys={['Coming soon…']}
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
          setKeyId={onKeyIdUpdate}
          legacyToggleOn={legacyToggleOn}
          setLegacyToggleOn={setLegacyToggleOn}
          isErroneous={typeof error !== 'undefined'}
        />

        <Controller
          name="sender"
          control={control}
          render={({ field }) => (
            <AccountNameField
              {...field}
              isInvalid={!!errors.sender}
              errorMessage={errors.sender?.message}
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
                  onSelectionChange={(chainId) => {
                    onChange(chainId);
                    onChainUpdate(chainId);
                  }}
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
    </Card>
  );
};

export default SignFormSender;
