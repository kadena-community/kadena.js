import { walletSdk } from '@kadena/wallet-sdk';
import React, { useState } from 'react';
import { executeNameRegistrationFlow } from '../actions/kadenaNamesActions';
import { PRICE_MAP } from '../constants/kadenaNamesConstants';
import { useWalletState } from '../state/wallet';

interface NameRegistrationFormProps {
  initialOwner?: string;
  initialAddress?: string;
  onRegistered?: () => void;
}

export const NameRegistrationForm: React.FC<NameRegistrationFormProps> = ({
  initialOwner = '',
  initialAddress = '',
  onRegistered,
}) => {
  const [owner, setOwner] = useState(initialOwner);
  const [address, setAddress] = useState(initialAddress);
  const [name, setName] = useState('');
  const [registrationPeriod, setRegistrationPeriod] =
    useState<keyof typeof PRICE_MAP>(1);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const wallet = useWalletState();

  const handleRegister = async () => {
    setLoading(true);
    setStatus('Registering name...');
    setError('');

    try {
      const transaction = await executeNameRegistrationFlow(
        owner,
        address,
        name,
        registrationPeriod,
        wallet.selectedNetwork,
        wallet.selectedChain,
      );

      if (transaction) {
        /* work in progress */
        const signedTransaction = await wallet.signTransaction(transaction);
        const final = await walletSdk.sendTransaction(
          signedTransaction,
          wallet.selectedNetwork,
          wallet.selectedChain,
        );
        console.info(final);

        setStatus('Name registered successfully!');
        onRegistered?.();
      }
    } catch (err) {
      console.error(err);
      setError(
        `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="text-white">Owner Address:</label>
        <input
          type="text"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="bg-medium-slate border border-border-gray rounded-md py-2 px-3 text-white w-full"
          placeholder="Enter your Kadena address"
        />
      </div>
      <div className="mb-4">
        <label className="text-white">Receiver Address:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="bg-medium-slate border border-border-gray rounded-md py-2 px-3 text-white w-full"
          placeholder="Enter the receiver address"
        />
      </div>
      <div className="mb-4">
        <label className="text-white">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-medium-slate border border-border-gray rounded-md py-2 px-3 text-white w-full"
          placeholder="Enter the name to register"
        />
      </div>
      <div className="mb-4">
        <label className="text-white">Registration Period:</label>
        <select
          value={registrationPeriod}
          onChange={(e) =>
            setRegistrationPeriod(
              e.target.value as unknown as keyof typeof PRICE_MAP,
            )
          }
          className="bg-medium-slate border border-border-gray rounded-md py-2 px-3 text-white w-full"
        >
          {Object.keys(PRICE_MAP).map((period) => (
            <option key={period} value={period}>
              {period} Year(s)
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleRegister}
        disabled={loading}
        className="bg-primary-green hover:bg-secondary-green text-white font-bold py-2 px-4 rounded w-full"
      >
        {loading ? 'Registering...' : 'Confirm Registration'}
      </button>
      {status && <p className="text-text-secondary mt-4">{status}</p>}
      {error && (
        <p className="text-error-color mt-4">
          <strong>Error:</strong> {error}
        </p>
      )}
    </div>
  );
};
