import { MonoAccountBox } from '@kadena/kode-icons';
import {
  Button,
  Card,
  ContentHeader,
  Divider,
  Select,
  SelectItem,
  Stack,
} from '@kadena/kode-ui';
import { useState } from 'react';
import { useAccountsBalances } from '../hooks/balances';
import { useChains } from '../hooks/chains';
import { useWalletState } from '../state/wallet';
import { AccountItem } from './AccountItem';

export const Accounts = () => {
  const wallet = useWalletState();

  const { loading: loadingBalance, balances: accountsBalances } =
    useAccountsBalances(
      wallet.accounts,
      wallet.selectedNetwork,
      wallet.selectedFungible,
      wallet.selectedChain,
    );

  const { chains } = useChains(wallet.selectedNetwork);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRegistered = () => setRefreshKey((prev) => prev + 1);

  const handleChainChange = (selectedChainKey: string) => {
    wallet.selectChain(selectedChainKey as typeof wallet.selectedChain);
  };

  return (
    <Card fullWidth>
      <ContentHeader
        heading="Accounts"
        description="Manage your wallet accounts and balances across multiple chains."
        icon={<MonoAccountBox />}
      />

      <Divider />
      <Stack alignItems="flex-start" flexDirection="column" gap="xs">
        <Stack
          flexDirection="row"
          alignItems="center"
          gap="sm"
          marginBlockEnd="md"
        >
          <Select
            label="Chain Selector"
            onSelectionChange={(key) => handleChainChange(key as string)}
            selectedKey={wallet.selectedChain}
            placeholder="Choose a chain"
            size="md"
          >
            {chains.map((chain) => (
              <SelectItem key={chain}>{chain}</SelectItem>
            ))}
          </Select>
        </Stack>

        {wallet.accounts.map((account) => (
          <AccountItem
            key={`account-${account.index}`}
            account={account}
            accountsBalances={accountsBalances}
            loadingBalance={loadingBalance}
            onRegistered={handleRegistered}
            refreshKey={refreshKey}
          />
        ))}

        <Divider />
        <Button onPress={() => wallet.generateAccount()} variant="primary">
          Generate New Account
        </Button>
      </Stack>
    </Card>
  );
};
