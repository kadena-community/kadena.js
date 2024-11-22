import { Fungible } from '@/modules/account/account.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { panelClass } from '@/pages/home/style.css';
import { Stack } from '@kadena/kode-ui';
import { useState } from 'react';
import { Accounts } from '../Accounts/Accounts';
import { Assets } from '../Assets/Assets';

export function AssetsCard() {
  const { accounts, fungibles, watchAccounts } = useWallet();
  const [selectedFungible, setSelectedFungible] = useState<Fungible>(
    fungibles[0],
  );
  const filteredAccounts = accounts.filter(
    ({ fungibleId }) => fungibleId === selectedFungible.uuid,
  );
  const filteredWatchedAccounts = watchAccounts.filter(
    ({ fungibleId }) => fungibleId === selectedFungible.uuid,
  );
  return (
    <Stack className={panelClass} gap={'xl'} flexDirection={'column'}>
      <Assets
        accounts={accounts}
        fungibles={fungibles}
        showAddToken
        selectedFungible={selectedFungible}
        setSelectedFungible={setSelectedFungible}
      />
      <Accounts
        accounts={filteredAccounts}
        fungible={selectedFungible}
        watchedAccounts={filteredWatchedAccounts}
      />
    </Stack>
  );
}
