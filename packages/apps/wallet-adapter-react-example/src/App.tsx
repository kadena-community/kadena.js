import { MonoWallet } from '@kadena/kode-icons';
import {
  Button,
  Card,
  ContentHeader,
  Divider,
  Heading,
  Select,
  SelectItem,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import type {
  IAccountInfo,
  IAdapter,
  INetworkInfo,
  IUnsignedCommand,
} from '@kadena/wallet-adapter-core';
import { useKadenaWallet } from '@kadena/wallet-adapter-react';
import React, { useEffect, useRef, useState } from 'react';
import { createTransferCmd } from './transferCmd';
import { createTransferTx } from './transferTx';
import { isRpcError, validateRpcResponse } from './zodValidation';

const openZelcore = (): void => {
  window.open('zel:', '_self');
};

import './styles.css';

const App = () => {
  const { client, providerData } = useKadenaWallet();

  const activeAccountRef = useRef<HTMLDivElement>(null);
  const rpcResponseRef = useRef<HTMLDivElement>(null);

  const [selectedWallet, setSelectedWallet] = useState<IAdapter | null>(null);
  const [activeAccount, setActiveAccount] = useState<IAccountInfo | null>(null);
  const [network, setNetwork] = useState<INetworkInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [accountTo, setAccountTo] = useState<string>('');
  const [rpcResponse, setRpcResponse] = useState<any>(null);

  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    isError?: boolean;
    issues?: unknown;
    note?: string;
  } | null>(null);

  const [signCommandPayload, setSignCommandPayload] = useState('');
  const [signTxPayload, setSignTxPayload] = useState('');

  /**
   * Helper to set RPC response and run Zod validation
   */
  const validateAndSetRpcResponse = (methodName: string, resp: any) => {
    setRpcResponse(resp);
    const result = validateRpcResponse(methodName, resp);
    setValidationResult(result);
    rpcResponseRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Connect to the selected wallet
   */
  const handleConnect = async () => {
    if (!selectedWallet) {
      console.error('No wallet selected');
      return;
    }

    setLoading(true);
    try {
      if (selectedWallet.name === 'Zelcore') {
        // trigger Zelcore app to start local server
        openZelcore();
        // wait a bit for Zelcore to launch its HTTP endpoint
        await new Promise((resolve) => setTimeout(resolve, 500));
        const accounts = await client.getAccounts('Zelcore');
        if (Array.isArray(accounts) && accounts.length > 0) {
          setActiveAccount(accounts[0]);
        } else {
          throw new Error('No accounts returned from Zelcore');
        }
        const netInfo = await client.getActiveNetwork('Zelcore');
        setNetwork(netInfo);
      } else {
        // Chainweaver or others: use standard connect
        const accountInfo = await client.connect(
          selectedWallet.name,
          selectedWallet.name === 'Chainweaver'
            ? {
                accountName: prompt('Input your account'),
                tokenContract: 'coin',
                chainIds: ['0', '1'],
              }
            : undefined,
        );
        setActiveAccount(accountInfo);

        const networkInfo = await client.getActiveNetwork(selectedWallet.name);
        setNetwork(networkInfo);
      }

      console.log(
        'Connected to',
        selectedWallet.name,
        '->',
        activeAccount?.accountName,
      );

      setTimeout(() => {
        activeAccountRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    } catch (error) {
      console.error('Connect error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Disconnect from the selected wallet
   */
  const handleDisconnect = async () => {
    if (!selectedWallet) {
      console.error('No wallet selected');
      return;
    }

    setLoading(true);
    try {
      await client.disconnect(selectedWallet.name);
      setActiveAccount(null);
      setNetwork(null);
      setRpcResponse(null);
      setValidationResult(null);
      console.log('Disconnected from', selectedWallet.name);
    } catch (error) {
      console.error('Disconnect error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Handlers for each individual "kadena_*" method
  // ---------------------------------------------------------------------------

  const handleGetAccount = async () => {
    if (!selectedWallet) return;
    if (selectedWallet.name === 'Zelcore') openZelcore();
    try {
      const resp = await client.getActiveAccount(selectedWallet.name);
      validateAndSetRpcResponse('kadena_getAccount_v1', resp);
    } catch (err) {
      console.error(err);
      if (isRpcError(err)) {
        validateAndSetRpcResponse('kadena_getAccounts_v2', err);
        return;
      }
      if (err instanceof Error) {
        setRpcResponse({ error: err.message });
        return;
      }
      setRpcResponse(err);
    }
  };

  const handleGetAccounts = async () => {
    if (!selectedWallet) return;
    if (selectedWallet.name === 'Zelcore') openZelcore();
    try {
      const resp = await client.getAccounts(selectedWallet.name);
      validateAndSetRpcResponse('kadena_getAccounts_v2', resp);
    } catch (err) {
      console.error(err);
      if (isRpcError(err)) {
        validateAndSetRpcResponse('kadena_getAccounts_v2', err);
        return;
      }
      if (err instanceof Error) {
        setRpcResponse({ error: err.message });
        return;
      }
      setRpcResponse(err);
    }
  };

  const handleGetNetwork = async () => {
    if (!selectedWallet) return;
    try {
      const resp = await client.getActiveNetwork(selectedWallet.name);
      validateAndSetRpcResponse('kadena_getNetwork_v1', resp);
    } catch (err) {
      console.error(err);
      if (isRpcError(err)) {
        validateAndSetRpcResponse('kadena_getNetworks_v1', err);
        return;
      }
      if (err instanceof Error) {
        setRpcResponse({ error: err.message });
        return;
      }
      setRpcResponse(err);
    }
  };

  const handleGetNetworks = async () => {
    if (!selectedWallet) return;
    try {
      const resp = await client.getNetworks(selectedWallet.name);
      validateAndSetRpcResponse('kadena_getNetworks_v1', resp);
    } catch (err) {
      console.error(err);
      if (isRpcError(err)) {
        validateAndSetRpcResponse('kadena_getNetworks_v1', err);
        return;
      }
      if (err instanceof Error) {
        setRpcResponse({ error: err.message });
        return;
      }
      setRpcResponse(err);
    }
  };

  const handleSignCommand = async () => {
    if (!selectedWallet) return;
    try {
      const command = JSON.parse(signCommandPayload);
      const cmd: IUnsignedCommand = { ...command };
      const resp = await client.signCommand(selectedWallet.name, cmd);
      validateAndSetRpcResponse('kadena_signCommand', resp);
    } catch (err) {
      console.error(err);
      if (isRpcError(err)) {
        validateAndSetRpcResponse('kadena_signCommand', err);
        return;
      }
      if (err instanceof Error) {
        setRpcResponse({ error: err.message });
        return;
      }
      setRpcResponse(err);
    }
  };

  const handleSignTransaction = async () => {
    if (!selectedWallet) return;
    try {
      const transaction = JSON.parse(signTxPayload);
      const tx: IUnsignedCommand = { ...transaction };
      const resp = await client.signTransaction(selectedWallet.name, tx);
      validateAndSetRpcResponse('kadena_signTransaction', resp);
    } catch (err) {
      console.error(err);
      if (isRpcError(err)) {
        validateAndSetRpcResponse('kadena_signTransaction', err);
        return;
      }
      if (err instanceof Error) {
        setRpcResponse({ error: err.message });
        return;
      }
      setRpcResponse(err);
    }
  };

  // ---------------------------------------------------------------------------
  // Listen for account & network changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!selectedWallet) return;

    if (client.isDetected(selectedWallet.name)) {
      client.onAccountChange(selectedWallet.name, (newAccount) => {
        console.log('Account changed:', newAccount);
        setActiveAccount(newAccount);
      });

      client.onNetworkChange(selectedWallet.name, (newNetwork) => {
        console.log('Network changed:', newNetwork);
        setNetwork(newNetwork);
      });
    }
  }, [selectedWallet, client]);

  // ---------------------------------------------------------------------------
  // Render UI
  // ---------------------------------------------------------------------------
  return (
    <Card fullWidth>
      <ContentHeader
        heading="Kadena Wallet Adapter Example"
        description="(Ecko, Zelcore, etc.)"
        icon={<MonoWallet />}
      />
      <Divider />
      <Stack flexDirection="column" gap="lg" padding="lg">
        <Stack flexDirection="column" gap="sm">
          <Heading as="h3">Select Wallet</Heading>
          <Select
            aria-label="Wallet list"
            selectedKey={selectedWallet?.name ?? 'placeholder'}
            onSelectionChange={(key) =>
              setSelectedWallet(client.getAdapter(key as string) ?? null)
            }
          >
            {[
              <SelectItem key="placeholder" textValue="Placeholder">
                -- select an option --
              </SelectItem>,
              ...providerData.map((providerData) => (
                <SelectItem
                  key={providerData.name}
                  textValue={providerData.name}
                >
                  {providerData.name}{' '}
                  {providerData.detected ? '(Detected)' : '(Not found)'}
                </SelectItem>
              )),
            ]}
          </Select>
        </Stack>
        <Stack flexDirection="row" gap="md">
          <Button
            onPress={handleConnect}
            isDisabled={loading || !selectedWallet || !!activeAccount}
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </Button>
          <Button
            onPress={handleDisconnect}
            isDisabled={loading || !selectedWallet || !activeAccount}
          >
            {loading ? 'Disconnecting...' : 'Disconnect'}
          </Button>
        </Stack>
        {activeAccount && (
          <div ref={activeAccountRef} style={{ width: '100%' }}>
            <Stack flexDirection="column" gap="xs">
              <Heading as="h3">Active Account</Heading>
              <Text variant="body" as="code">
                <pre
                  className="wrap"
                  style={{ background: '#f4f4f4', padding: '1rem' }}
                >
                  {JSON.stringify(activeAccount, null, 2)}
                </pre>
              </Text>
            </Stack>
          </div>
        )}
        {network && (
          <Stack flexDirection="column" gap="xs">
            <Heading as="h3">Active Network</Heading>
            <Text variant="body" as="code">
              <pre
                className="wrap"
                style={{ background: '#f4f4f4', padding: '1rem' }}
              >
                {JSON.stringify(network, null, 2)}
              </pre>
            </Text>
          </Stack>
        )}
      </Stack>
      <Divider />
      <Stack flexDirection="column" gap="md" padding="lg" flexWrap="wrap">
        <Heading as="h3">RPC Response</Heading>
        <div ref={rpcResponseRef} style={{ width: '100%' }}>
          {rpcResponse && (
            <Stack flexDirection="column" gap="xs">
              <Text variant="body" as="code">
                <pre
                  className="wrap"
                  style={{
                    background: '#f4f4f4',
                    padding: '1rem',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {JSON.stringify(rpcResponse, null, 2)}
                  {'\n'}
                  {!('error' in rpcResponse)
                    ? validationResult?.success
                      ? `\n\n=== VALID ===\n${validationResult?.isError ? '(JSON-RPC Error object, but valid format)' : ''}`
                      : `\n\n=== INVALID ===\n${JSON.stringify(validationResult?.issues, null, 2)}`
                    : null}
                  {validationResult?.note
                    ? `\nNote: ${validationResult.note}`
                    : ''}
                </pre>
              </Text>
            </Stack>
          )}
        </div>
        <Divider />
        <Heading as="h3">Additional RPC Method Calls</Heading>
        <Stack
          flexDirection="row"
          gap="sm"
          flexWrap="wrap"
          className="stack-buttons"
        >
          <Button onPress={handleGetAccount} isDisabled={!activeAccount}>
            kadena_getAccount_v1
          </Button>
          <Button onPress={handleGetAccounts} isDisabled={!activeAccount}>
            kadena_getAccounts_v2
          </Button>
          <Button onPress={handleGetNetwork} isDisabled={!activeAccount}>
            kadena_getNetwork_v1
          </Button>
          <Button onPress={handleGetNetworks} isDisabled={!activeAccount}>
            kadena_getNetworks_v1
          </Button>
        </Stack>
        <Divider />
        <Stack flexDirection="column" gap="sm" flexWrap="wrap">
          <Heading as="h4">kadena_signCommand</Heading>
          <TextField
            label="Sign Command Payload"
            placeholder="JSON or Pact code for the command"
            value={signCommandPayload}
            onValueChange={setSignCommandPayload}
            isDisabled={!activeAccount}
          />
          <Button onPress={handleSignCommand} isDisabled={!activeAccount}>
            Sign Command
          </Button>
        </Stack>
        <Divider />
        <Heading as="h3">Send KDA</Heading>
        <div>
          <Stack flexDirection="column" gap="sm">
            <TextField
              label="To:"
              placeholder="Account to fund"
              value={accountTo}
              onValueChange={setAccountTo}
              isDisabled={!activeAccount}
            />
            <Stack flexDirection="row" gap="sm" flexWrap="wrap">
              <Button
                isDisabled={!activeAccount}
                onPress={() => {
                  if (!activeAccount) return;
                  createTransferCmd({
                    accountFrom: activeAccount.accountName,
                    pubkey: activeAccount.guard.keys[0],
                    accountTo: accountTo,
                    amount: 0.0001,
                    client: client,
                    walletName: selectedWallet?.name ?? 'Chainweaver',
                  })
                    .then((result) => {
                      console.log('Transaction result:', result);
                    })
                    .catch((error) => {
                      console.error('Transaction error:', error);
                    });
                }}
              >
                Send KDA Cmd
              </Button>
              <Button
                isDisabled={!activeAccount}
                onPress={() => {
                  if (!activeAccount) return;
                  createTransferTx({
                    accountFrom: activeAccount.accountName,
                    pubkey: activeAccount.guard.keys[0],
                    accountTo: accountTo,
                    amount: 0.0001,
                    client: client,
                    networkId: network?.networkId ?? 'mainnet01',
                    walletName: selectedWallet?.name ?? 'Chainweaver',
                  })
                    .then((result) => {
                      console.log('Transaction result:', result);
                    })
                    .catch((error) => {
                      console.error('Transaction error:', error);
                    });
                }}
              >
                Send KDA Tx
              </Button>
            </Stack>
          </Stack>
        </div>
        <Divider />
        <Stack flexDirection="column" gap="sm" flexWrap="wrap">
          <Heading as="h4">kadena_signTransaction</Heading>
          <TextField
            label="Sign Transaction Payload"
            placeholder="JSON or Pact code for the transaction"
            value={signTxPayload}
            onValueChange={setSignTxPayload}
            isDisabled={!activeAccount}
          />
          <Button onPress={handleSignTransaction} isDisabled={!activeAccount}>
            Sign Transaction
          </Button>
        </Stack>
        <Divider />
      </Stack>
    </Card>
  );
};

export default App;
