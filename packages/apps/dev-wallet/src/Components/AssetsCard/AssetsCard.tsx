import { useWallet } from '@/modules/wallet/wallet.hook';
import { panelClass } from '@/pages/home/style.css';
import { Stack } from '@kadena/kode-ui';
import { useState } from 'react';
import { Accounts } from '../Accounts/Accounts';
import { Assets } from '../Assets/Assets';

export function AssetsCard() {
  const { accounts, fungibles } = useWallet();
  const [selectedContract, setSelectedContract] = useState<string>(
    fungibles[0].contract,
  );
  const filteredAccounts = accounts.filter(
    ({ contract }) => contract === selectedContract,
  );
  return (
    <Stack
      className={panelClass}
      marginBlockStart="xl"
      gap={'xl'}
      flexDirection={'column'}
    >
      <Assets
        accounts={filteredAccounts}
        fungibles={fungibles}
        showAddToken
        selectedContract={selectedContract}
        setSelectedContract={setSelectedContract}
      />
      <Accounts accounts={filteredAccounts} contract={selectedContract} />
    </Stack>
  );
}
