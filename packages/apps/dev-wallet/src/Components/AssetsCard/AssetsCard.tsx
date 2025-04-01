import { useWallet } from '@/modules/wallet/wallet.hook';
import { useState } from 'react';
import { Accounts } from '../Accounts/Accounts';
import { Assets } from '../Assets/Assets';

export function AssetsCard() {
  const { accounts, fungibles, watchAccounts, activeNetwork } = useWallet();
  const filteredFungibles = fungibles.filter(
    ({ networkUUIDs }) =>
      !networkUUIDs ||
      (activeNetwork?.uuid && networkUUIDs.includes(activeNetwork?.uuid)),
  );
  const [selectedContract, setSelectedContract] = useState<string>(
    filteredFungibles[0].contract,
  );
  const filteredAccounts = accounts.filter(
    ({ contract }) => contract === selectedContract,
  );
  const filteredWatchedAccounts = watchAccounts.filter(
    ({ contract }) => contract === selectedContract,
  );
  return (
    <>
      <Assets
        accounts={accounts}
        fungibles={filteredFungibles}
        showAddToken
        selectedContract={selectedContract}
        setSelectedContract={setSelectedContract}
      />
      <Accounts
        show="owned"
        label="Accounts"
        accounts={filteredAccounts}
        contract={selectedContract}
      />
      <Accounts
        show="watched"
        label="Watched Accounts"
        accounts={filteredWatchedAccounts}
        contract={selectedContract}
      />
    </>
  );
}
