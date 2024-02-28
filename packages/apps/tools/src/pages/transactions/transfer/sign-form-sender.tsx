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
import { useAccountDetailsQuery } from '@/hooks/use-account-details-query';
import type { DerivationMode } from '@/hooks/use-ledger-public-key';
import useLedgerPublicKey, {
  derivationModes,
} from '@/hooks/use-ledger-public-key';
import useTranslation from 'next-translate/useTranslation';
import { Controller, useFormContext } from 'react-hook-form';
import LedgerDetails from './ledger-details';
import type { FormData } from './sign-form';
import { chainSelectContainerClass, notificationLinkStyle } from './styles.css';

const accountFromOptions = ['Ledger', 'WalletConnect'] as const;

export const SignFormSender = () => {
  const { t } = useTranslation('common');
  const {
    register,
    control,
    formState: { errors },
    getValues,
    watch,
    setValue,
  } = useFormContext<FormData>();

  const [{ error: ledgerError, value: ledgerPublicKey }, getPublicKey] =
    useLedgerPublicKey();

  const [keyId, setKeyId] = useState<number>();

  const [legacyToggleOn, setLegacyToggleOn] = useState<boolean>(false);
  const derivationMode: DerivationMode = legacyToggleOn
    ? derivationModes[1]
    : derivationModes[0];

  const { selectedNetwork: network } = useWalletConnectClient();

  const senderData = useAccountDetailsQuery({
    account: getValues('sender'),
    networkId: network,
    chainId: getValues('senderChainId'),
  });

  const watchAmount = watch('amount');

  const invalidAmount =
    senderData.data && senderData.data.balance < watchAmount;

  const invalidAmountMessage = senderData.data
    ? `Cannot send more than ${senderData.data.balance.toFixed(4)} KDA.`
    : '';

  useEffect(() => {
    if (ledgerPublicKey) {
      setValue('sender', `k:${ledgerPublicKey}`);
    }
  }, [ledgerPublicKey, legacyToggleOn, setValue]);

  return (
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
