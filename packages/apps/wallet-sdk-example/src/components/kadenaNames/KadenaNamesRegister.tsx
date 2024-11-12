import React, { useCallback, useMemo, useState } from 'react';
import { useAccountBalance } from '../../hooks/balances';
import type { Account } from '../../state/wallet';
import { useWalletState } from '../../state/wallet';
import { NameRegistrationForm } from './NameRegistrationForm';

export const KadenaNamesRegister: React.FC = () => {
  const wallet = useWalletState();
  const [ownerAddress, setOwnerAddress] = useState<string>('');

  const ownerAccount: Account = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, publicKey] = ownerAddress.split(':');
    return {
      index: 0,
      publicKey: publicKey || '',
      name: ownerAddress,
    };
  }, [ownerAddress]);

  const { balance, error } = useAccountBalance(
    ownerAccount,
    wallet.selectedNetwork,
    wallet.selectedFungible,
    wallet.selectedChain,
  );

  const handleOwnerAddressChange = useCallback((address: string) => {
    setOwnerAddress(address);
  }, []);

  return (
    <div className="bg-dark-slate p-6 rounded-lg shadow-md w-full mx-auto">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        Register Kadena Name
      </h2>

      {error && (
        <p className="text-error-color text-center">Error: {error.message}</p>
      )}

      <NameRegistrationForm
        balance={balance ? parseFloat(balance) : 0}
        onOwnerAddressChange={handleOwnerAddressChange}
      />
    </div>
  );
};
