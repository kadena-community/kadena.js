import { MonoShortcut } from '@kadena/kode-icons';
import {
  Card,
  ContentHeader,
  Divider,
  Heading,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';

import React from 'react';
import SdkFunctionDisplay from '../../components/SdkFunctionDisplayer';
import {
  useAddressToName,
  useNameToAddress,
} from '../../hooks/kadenaNames/kadenaNamesResolver';
import { useWalletState } from '../../state/wallet';

export const KadenaNames: React.FC = () => {
  const wallet = useWalletState();

  const {
    name: resolvedName,
    error: nameError,
    loading: nameLoading,
    setAddress,
    address: inputAddress,
    /* -- Start demo ---------------*/
    trackAddressToName,
    /* -- End demo ---------------*/
  } = useAddressToName(0, wallet.selectedNetwork);

  const {
    address: resolvedAddress,
    error: addressError,
    loading: addressLoading,
    setName,
    name: inputName,
    /* -- Start demo ---------------*/
    trackNameToAddress,
    /* -- End demo ---------------*/
  } = useNameToAddress(0, wallet.selectedNetwork);

  return (
    <div className="w-full max-w-[1000px] mx-auto p-6">
      <Card fullWidth>
        <ContentHeader
          heading="Simple Account Names"
          description="Kadena Address and Name Lookup."
          icon={<MonoShortcut />}
        />

        <Divider />

        <Stack flexDirection="column" gap="lg">
          <Stack flexDirection="column" gap="sm">
            <Heading as="h3">Address to Name</Heading>
            <TextField
              label="Enter Address"
              placeholder="Enter address"
              value={inputAddress}
              onValueChange={setAddress}
              size="md"
            />
            {nameLoading && <Text variant="ui">Loading...</Text>}
            {resolvedName && (
              <Text variant="ui">
                <strong>Name:</strong> {resolvedName}
              </Text>
            )}
            {nameError && (
              <Text variant="ui">
                <strong>Error:</strong> {nameError}
              </Text>
            )}
          </Stack>

          <Stack flexDirection="column" gap="sm">
            <Heading as="h3">Name to Address</Heading>
            <TextField
              label="Enter Name"
              placeholder="Enter name"
              value={inputName}
              onValueChange={setName}
              size="md"
            />
            {addressLoading && <Text variant="ui">Loading...</Text>}
            {resolvedAddress && (
              <Text variant="ui">
                <strong>Address:</strong> {resolvedAddress}
              </Text>
            )}
            {addressError && (
              <Text variant="ui">
                <strong>Error:</strong> {addressError}
              </Text>
            )}
          </Stack>
        </Stack>
      </Card>

      {/*
        This is for Demo purposes, displaying the SDK functions used in this component
      */}
      <div>
        {/* -- Start demo ---------------*/}
        {trackAddressToName && <SdkFunctionDisplay data={trackAddressToName} />}
        {trackNameToAddress && <SdkFunctionDisplay data={trackNameToAddress} />}
        {/* -- End demo ---------------*/}
      </div>
    </div>
  );
};
