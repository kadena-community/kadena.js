import { Keyset } from '@/pages/transfer-v2/Components/keyset';
import { discoverReceiver } from '@/pages/transfer-v2/utils';
import { DiscoverdAccounts } from '@/pages/transfer/components/DiscoverdAccounts';
import { IReceiverAccount } from '@/pages/transfer/utils';
import {
  MonoAccountBalanceWallet,
  MonoLoading,
} from '@kadena/kode-icons/system';
import { Button, Notification, Stack, TextField } from '@kadena/kode-ui';
import { useEffect, useState } from 'react';
import { KeySetDialog } from '../KeysetDialog/KeySetDialog';

export function AccountInput({
  networkId,
  contract,
  onAccount,
  account,
}: {
  networkId: string;
  contract: string;
  account?: IReceiverAccount;
  onAccount: (account: IReceiverAccount) => void;
}) {
  const [address, setAddress] = useState(account?.address || '');
  const [discoveredAccounts, setDiscoveredAccounts] = useState<
    IReceiverAccount[]
  >([]);
  const [needToAddKeys, setNeedToAddKeys] = useState(false);
  const [showKeysetDialog, setShowKeysetDialog] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [discovering, setDiscovering] = useState(false);
  const selectedAccount =
    discoveredAccounts.length === 1 ? discoveredAccounts[0] : undefined;

  useEffect(() => {
    if (account?.address) {
      setAddress(account.address);
      handleDiscover(account.address);
    }
  }, [account?.address]);

  const handleDiscover = async (addressArg?: string) => {
    const innerAddress = typeof addressArg === 'string' ? addressArg : address;
    try {
      if (!innerAddress) {
        return;
      }
      setDiscovering(true);
      setNeedToAddKeys(false);
      const accounts = await discoverReceiver(
        innerAddress,
        networkId,
        contract,
        (key) => key,
      );
      setDiscovering(false);
      if (accounts.length > 1) {
        setDiscoveredAccounts(accounts);
        return;
      }
      if (accounts.length === 0) {
        setNeedToAddKeys(true);
        return;
      }
      setDiscoveredAccounts(accounts);
      onAccount(accounts[0]);
    } catch (e: any) {
      setError(e && e.message ? e : JSON.stringify(e));
    }
  };

  return (
    <Stack flexDirection={'column'}>
      {showKeysetDialog && (
        <KeySetDialog
          close={() => setShowKeysetDialog(false)}
          onDone={(guard) => {
            setShowKeysetDialog(false);
            setNeedToAddKeys(false);
            const account: IReceiverAccount = {
              address,
              keyset: { guard },
              chains: [],
              overallBalance: '0.0',
            };
            setDiscoveredAccounts([account]);
            onAccount(account);
          }}
          isOpen
        />
      )}
      {discoveredAccounts.length >= 2 && (
        <DiscoverdAccounts
          accounts={discoveredAccounts}
          onSelect={(account: IReceiverAccount) => {
            setDiscoveredAccounts([account]);
            onAccount(account);
          }}
        />
      )}
      <TextField
        aria-label="Account"
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
        onChange={(e) => setAddress(e.target.value)}
        onBlur={() => handleDiscover()}
      />
      {selectedAccount && selectedAccount.keyset.guard && (
        <Keyset guard={selectedAccount.keyset.guard} />
      )}
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
    </Stack>
  );
}
