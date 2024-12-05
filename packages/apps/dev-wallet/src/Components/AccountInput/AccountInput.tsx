import { Keyset } from '@/pages/transfer-v2/Components/keyset';
import { discoverReceiver, IReceiverAccount } from '@/pages/transfer-v2/utils';

import {
  MonoAccountBalanceWallet,
  MonoLoading,
} from '@kadena/kode-icons/system';
import { Button, Notification, Stack, TextField } from '@kadena/kode-ui';
import { useState } from 'react';
import { KeySetDialog } from '../KeysetDialog/KeySetDialog';
import { DiscoverdAccounts } from './DiscoverdAccounts';

export function AccountInput({
  networkId,
  contract,
  onAccount,
  account,
  address,
  setAddress,
}: {
  networkId: string;
  contract: string;
  account: IReceiverAccount | undefined;
  address: string;
  setAddress: (address: string) => void;
  onAccount: (account?: IReceiverAccount) => void;
}) {
  console.log('AccountInput', account);
  const [discoveredAccounts, setDiscoveredAccounts] = useState<
    IReceiverAccount[] | undefined
  >(undefined);
  const [needToAddKeys, setNeedToAddKeys] = useState(false);
  const [showKeysetDialog, setShowKeysetDialog] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [discovering, setDiscovering] = useState<string | undefined>(undefined);

  const handleDiscover = async (addressArg?: string) => {
    console.log('handleDiscover', addressArg, discovering);
    const innerAddress = typeof addressArg === 'string' ? addressArg : address;
    try {
      if (
        !innerAddress ||
        innerAddress === discovering ||
        innerAddress === account?.address
      ) {
        return;
      }
      setDiscovering(innerAddress);
      setNeedToAddKeys(false);
      setDiscoveredAccounts(undefined);
      onAccount(undefined);
      const accounts = await discoverReceiver(
        innerAddress,
        networkId,
        contract,
        (key) => key,
      );
      if (accounts.length === 1) {
        onAccount(accounts[0]);
      }
      if (accounts.length > 1) {
        setDiscoveredAccounts(accounts);
      }
      if (accounts.length === 0) {
        setNeedToAddKeys(true);
      }
      setDiscovering(undefined);
    } catch (e: any) {
      setError(e && e.message ? e : JSON.stringify(e));
    }
  };

  return (
    <Stack flexDirection={'column'} gap={'md'}>
      {showKeysetDialog && (
        <KeySetDialog
          close={() => setShowKeysetDialog(false)}
          onDone={(guard) => {
            setShowKeysetDialog(false);
            setNeedToAddKeys(false);
            const account: IReceiverAccount = {
              address: address,
              keyset: { guard },
              chains: [],
              overallBalance: '0.0',
            };
            onAccount(account);
          }}
          isOpen
        />
      )}
      <Stack flexDirection={'column'}>
        <TextField
          aria-label="Account"
          key={'account-input'}
          startVisual={
            <Stack gap={'sm'}>
              <MonoAccountBalanceWallet />
            </Stack>
          }
          description={
            discovering ? (
              <Stack>
                <MonoLoading /> Discovering...
              </Stack>
            ) : (
              error?.message
            )
          }
          value={address}
          onChange={(e) => {
            const newAddress = e.target.value;
            setAddress(newAddress);
            if (account && newAddress !== account?.address) {
              onAccount(undefined);
            }
          }}
          autoFocus={false}
          onFocusChange={(isFocused) => {
            if (!isFocused && !account) {
              console.log('onBlur called', address);
              handleDiscover(address);
            }
          }}
        />
        {account && account.keyset.guard && (
          <Keyset guard={account.keyset.guard} />
        )}
      </Stack>
      {needToAddKeys && (
        <Notification role="status" intent="info">
          The address is not recognized. Please add the public key to the
          account.{' '}
          <Stack gap={'sm'}>
            <Button
              variant="outlined"
              isCompact
              onClick={() => setShowKeysetDialog(true)}
            >
              Add
            </Button>
          </Stack>
        </Notification>
      )}
      {discoveredAccounts && discoveredAccounts.length >= 2 && (
        <DiscoverdAccounts
          accounts={discoveredAccounts}
          onSelect={(account: IReceiverAccount) => {
            setDiscoveredAccounts(undefined);
            onAccount(account);
          }}
          onClosed={() => setDiscoveredAccounts(undefined)}
          inline
        />
      )}
    </Stack>
  );
}
