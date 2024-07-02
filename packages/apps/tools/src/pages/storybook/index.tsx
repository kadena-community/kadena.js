import {
  AccountHoverTag,
  AccountNameField,
  ChainSelect,
} from '@/components/Global';
import { useAccountDetailsQuery } from '@/hooks/use-account-details-query';
import type { DerivationMode } from '@/hooks/use-ledger-public-key';
import useLedgerPublicKey, {
  derivationModes,
} from '@/hooks/use-ledger-public-key';
import type { ChainId } from '@kadena/client';
import { MonoCAccount, MonoKey, MonoUsb } from '@kadena/react-icons/system';
import {
  Breadcrumbs,
  BreadcrumbsItem,
  Card,
  Combobox,
  ComboboxItem,
  ContentHeader,
  Heading,
  Select,
  SelectItem,
  Stack,
  Text,
} from '@kadena/kode-ui';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import React, { useState } from 'react';
import { containerStyle } from './styles.css';

const options = Array.from({ length: 10 }, (_, i) => ({
  id: `ledger-key-${i}`,
  name: `${i}`,
}));

const Storybook = () => {
  const { t } = useTranslation('common');

  const [accountName, setAccountName] = useState<string>('');
  const [chainId, setChainId] = useState<ChainId>('0');
  const {
    error: accountError,
    data: accountDetails,
    isFetching: isFetchingAccountDetails,
  } = useAccountDetailsQuery({
    account: accountName,
    networkId: 'testnet04',
    chainId,
  });

  console.log({ accountError, accountDetails });

  const defaultDerivationMode = derivationModes[0];
  const [derivationMode, setDerivationMode] = useState<DerivationMode>(
    defaultDerivationMode,
  );

  const [
    {
      error: ledgerError,
      value: ledgerPublicKey,
      loading: isFetchingLedgerPublicKey,
    },
    getPublicKey,
  ] = useLedgerPublicKey();

  console.log({ ledgerError, ledgerPublicKey });

  return (
    <section className={containerStyle}>
      <Head>
        <title>Kadena Developer Tools - Storybook</title>
      </Head>
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Storybook')}</BreadcrumbsItem>
      </Breadcrumbs>
      <Heading as="h4">{t('Storybook')}</Heading>
      <Stack flexDirection="column" gap="md">
        <Card fullWidth>
          <Stack flexDirection="column">
            <Heading as="h5">
              <Text variant="code">useAccountDetailsQuery</Text>
            </Heading>
            <Stack gap="md">
              <AccountNameField
                label="Account Name"
                onValueChange={(value) => {
                  setAccountName(value);
                }}
              />
              <ChainSelect
                onSelectionChange={(value) => setChainId(value)}
                selectedKey={chainId}
              />
            </Stack>
            <>
              <ContentHeader icon={<MonoCAccount />} heading="User Details" />
              {accountDetails ? (
                <dl>
                  {Object.entries(accountDetails).map(([key, value]) => {
                    return (
                      <>
                        <dt>{key}</dt>
                        <dd>{value.toString()}</dd>
                      </>
                    );
                  })}
                </dl>
              ) : (
                <Text>User not found (yet)</Text>
              )}
            </>
            {isFetchingAccountDetails && <Text>Loading...</Text>}
            {accountError ? (
              <Text>
                Error:{' '}
                {accountError instanceof Error ||
                Object.hasOwn(accountError, 'message')
                  ? (accountError as { message: string }).message
                  : 'Something went wrong'}
              </Text>
            ) : null}
          </Stack>
        </Card>
        <Card fullWidth>
          <Stack flexDirection="column">
            <Heading as="h5">
              <Text as="code">useLedgerPublicKey</Text>
            </Heading>
            <Stack gap="md">
              <Combobox
                allowsCustomValue
                startVisual={<MonoKey />}
                label="Key ID"
                onInputChange={async (value) => {
                  console.log('onInputChange', value);
                  await getPublicKey({
                    keyId: parseInt(value, 10),
                    derivationMode,
                  });
                }}
                defaultItems={options}
              >
                {(item) => (
                  <ComboboxItem key={item.id}>{item.name}</ComboboxItem>
                )}
              </Combobox>
              <Select
                defaultSelectedKey={defaultDerivationMode}
                label="Derivation Mode"
                items={derivationModes.map((mode) => ({
                  key: mode,
                  label: mode,
                }))}
                onSelectionChange={(value) => {
                  setDerivationMode(value as DerivationMode);
                }}
              >
                {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
              </Select>
            </Stack>
            <>
              <ContentHeader icon={<MonoUsb />} heading="Ledger Public Key" />
              {ledgerPublicKey ? (
                <dl>
                  <dt>Public Key</dt>
                  <dd>
                    <Text as="code">{ledgerPublicKey}</Text>
                  </dd>
                  <dt>Account name</dt>
                  <dd>
                    <AccountHoverTag value={`k:${ledgerPublicKey}`} />
                  </dd>
                </dl>
              ) : (
                <Text>Public key not fetched (yet)</Text>
              )}
            </>
            {isFetchingLedgerPublicKey && <Text>Loading...</Text>}
            {ledgerError ? (
              <Text>
                Error:{' '}
                {ledgerError instanceof Error ||
                Object.hasOwn(ledgerError, 'message')
                  ? (ledgerError as { message: string }).message
                  : 'Something went wrong'}
              </Text>
            ) : null}
          </Stack>
        </Card>
      </Stack>
    </section>
  );
};

export default Storybook;
