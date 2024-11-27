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

import React, { useEffect, useState } from 'react';
import {
  useAddressToName,
  useNameToAddress,
} from '../../hooks/kadenaNames/kadenaNamesResolver';
import { useWalletState } from '../../state/wallet';
import SdkFunctionDisplay from '../SdkFunctionDisplayer'; // Demo

export const KadenaNames: React.FC = () => {
  const wallet = useWalletState();

  const {
    name: resolvedName,
    error: nameError,
    loading: nameLoading,
    setAddress,
    address: inputAddress,
  } = useAddressToName(0, wallet.selectedNetwork);

  const {
    address: resolvedAddress,
    error: addressError,
    loading: addressLoading,
    setName,
    name: inputName,
  } = useNameToAddress(0, wallet.selectedNetwork);

  //* -- Start demo ---------------*/
  const [functionCalls, setFunctionCalls] = useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { functionName: string; functionArgs: any }[]
  >([]);

  useEffect(() => {
    const calls = [];

    if (inputAddress) {
      calls.push({
        functionName: 'walletSdk.kadenaNames.addressToName',
        functionArgs: {
          address: inputAddress,
          networkId: wallet.selectedNetwork,
        },
      });
    }

    if (inputName) {
      calls.push({
        functionName: 'walletSdk.kadenaNames.nameToAddress',
        functionArgs: {
          name: inputName,
          networkId: wallet.selectedNetwork,
        },
      });
    }

    setFunctionCalls(calls);
  }, [inputAddress, inputName, wallet.selectedNetwork]);
  /* -- End demo ---------------*/

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
          {/* Address to Name */}
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

          {/* Name to Address */}
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
        This is for Demo purposes, displaying what SDK function is execution for this action
      */}
      <div>
        {functionCalls.map((call, index) => (
          <SdkFunctionDisplay
            key={index}
            functionName={call.functionName}
            functionArgs={call.functionArgs}
          />
        ))}
      </div>
    </div>
  );
};
