import { ChainId } from '@kadena/client';
import { walletSdk } from '@kadena/wallet-sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { getChainIdByNetwork } from '../actions/host';
import {
  executeCreateRegisterNameTransaction,
  fetchNameInfo,
  fetchPriceByPeriod,
} from '../actions/kadenaNamesActions';
import { PRICE_MAP } from '../constants/kadenaNamesConstants';
import { useWalletState } from '../state/wallet';
import { useDebounce } from '../utils/useDebounce';

interface NameRegistrationFormProps {
  initialOwner?: string;
  initialAddress?: string;
  onRegistered?: () => void;
  balance?: number;
}

export const NameRegistrationForm: React.FC<NameRegistrationFormProps> = ({
  initialOwner = '',
  initialAddress = '',
  onRegistered,
  balance = 0,
}) => {
  const [owner, setOwner] = useState(initialOwner);
  const [address, setAddress] = useState(initialAddress);
  const [name, setName] = useState('');
  const [registrationPeriod, setRegistrationPeriod] = useState<1 | 2>(1);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [availabilityLoading, setAvailabilityLoading] =
    useState<boolean>(false);
  const [priceLoading, setPriceLoading] = useState<boolean>(false);
  const [registering, setRegistering] = useState<boolean>(false);
  const [price, setPrice] = useState<number | null>(null);
  const [chains, setChains] = useState<ChainId[]>(
    Array.from({ length: 20 }, (_, i) => `${i}` as ChainId), // Default to 20 chains
  );

  const wallet = useWalletState();
  const { selectChain, selectedChain } = wallet;

  // Debounce the name input to prevent rapid calls
  const debouncedName = useDebounce(name, 500);

  // Fetch chains from the network and overwrite default if successful
  useEffect(() => {
    const fetchChains = async () => {
      try {
        const chainList = await walletSdk.getChains(wallet.selectedNetwork);
        setChains(chainList.map((chain) => chain.id));
      } catch (err) {
        console.error('Error fetching chains:', err);
      }
    };
    fetchChains();
  }, [wallet.selectedNetwork]);

  const checkAvailabilityAndSetPrice = useCallback(async () => {
    if (!debouncedName) return;

    try {
      setAvailabilityLoading(true);
      setError('');
      setStatus('');

      const nameInfo = await fetchNameInfo(
        debouncedName,
        wallet.selectedNetwork,
        owner,
      );
      if (!nameInfo.isAvailable) {
        setError(
          'This name is already registered. Please choose a different name.',
        );
        setPrice(null);
        setAvailabilityLoading(false);
        return;
      }

      setAvailabilityLoading(false);
      setPriceLoading(true);

      const priceForPeriod = await fetchPriceByPeriod(
        registrationPeriod,
        wallet.selectedNetwork,
        owner,
      );
      setPrice(priceForPeriod);
      setStatus(
        `The name is available. Price: ${priceForPeriod} KDA for ${registrationPeriod} year(s).`,
      );
    } catch (err) {
      console.error(err);
      setError(
        `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
      setPrice(null);
    } finally {
      setAvailabilityLoading(false);
      setPriceLoading(false);
    }
  }, [debouncedName, registrationPeriod, wallet.selectedNetwork, owner]);

  useEffect(() => {
    checkAvailabilityAndSetPrice();
  }, [checkAvailabilityAndSetPrice]);

  const handleRegister = async () => {
    if (price === null || balance < price) {
      setError(
        'Please verify the availability and price of the name before registering, or ensure sufficient funds.',
      );
      return;
    }

    setRegistering(true);
    setStatus('Registering name...');
    setError('');

    try {
      const transaction = await executeCreateRegisterNameTransaction(
        owner,
        address,
        name,
        registrationPeriod,
        wallet.selectedNetwork,
      );

      if (transaction) {
        const signedTransaction = await wallet.signTransaction(transaction);
        const final = await walletSdk.sendTransaction(
          signedTransaction,
          wallet.selectedNetwork,
          selectedChain ?? getChainIdByNetwork(wallet.selectedNetwork),
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
      setRegistering(false);
    }
  };

  const getButtonText = () => {
    if (registering) return 'Registering...';
    if (availabilityLoading) return 'Checking availability...';
    if (priceLoading) return 'Checking price...';
    if (price !== null && balance < price) return 'Insufficient funds';
    return 'Confirm Registration';
  };

  return (
    <div>
      <p className="text-error-color mt-4">
        <strong>Network: {wallet.selectedNetwork}</strong>
      </p>
      <p className="text-white mb-4">
        <strong>Current Balance:</strong> {balance} KDA
      </p>
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
        <label className="text-white">Chain:</label>
        <select
          value={selectedChain ?? ''}
          onChange={(e) => selectChain(e.target.value as ChainId)}
          className="bg-medium-slate border border-border-gray rounded-md py-2 px-3 text-white w-full"
        >
          <option value="">Select a chain</option>
          {chains.map((chain) => (
            <option key={chain} value={chain}>
              Chain {chain}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="text-white">Registration Period:</label>
        <select
          value={registrationPeriod}
          onChange={(e) =>
            setRegistrationPeriod(parseInt(e.target.value) as 1 | 2)
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
      {price !== null && (
        <div className="mb-4 text-white">
          <strong>Price:</strong> {price} KDA for {registrationPeriod} year(s)
        </div>
      )}
      <button
        onClick={handleRegister}
        disabled={
          availabilityLoading ||
          priceLoading ||
          registering ||
          price === null ||
          (price !== null && balance < price)
        }
        className="bg-primary-green hover:bg-secondary-green text-white font-bold py-2 px-4 rounded w-full"
      >
        {getButtonText()}
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
