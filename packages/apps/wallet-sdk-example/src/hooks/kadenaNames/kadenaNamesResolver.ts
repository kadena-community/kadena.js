import { walletSdk } from '@kadena/wallet-sdk';
import { useEffect, useState } from 'react';
import { useDebounce } from '../../utils/useDebounce';
import { useFunctionTracker } from '../functionTracker';

export const useAddressToName = (refreshKey = 0, selectedNetwork: string) => {
  const [address, setAddress] = useState<string>('');
  const debouncedAddress = useDebounce(address, 500);

  const [name, setName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const trackAddressToName = useFunctionTracker(
    'walletSdk.kadenaNames.addressToName',
  );

  useEffect(() => {
    setName(null);
    setError(null);

    if (!debouncedAddress) {
      setLoading(false);
      return;
    }

    let isCurrent = true;

    const getName = async () => {
      setLoading(true);
      try {
        const result = await trackAddressToName.wrap(
          walletSdk.kadenaNames.addressToName,
        )(debouncedAddress, selectedNetwork);

        if (isCurrent) {
          if (result !== null) {
            setName(result);
          } else {
            setError('Address cannot be found');
          }
        }
      } catch (err) {
        console.error(err);
        if (isCurrent) {
          setError('An error occurred while fetching the name');
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };
    getName();

    return () => {
      isCurrent = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAddress, refreshKey, selectedNetwork]);

  return {
    name,
    error,
    loading,
    setAddress,
    address,
    trackAddressToName: trackAddressToName.data,
  };
};

export const useNameToAddress = (refreshKey = 0, selectedNetwork: string) => {
  const [name, setName] = useState<string>('');
  const debouncedName = useDebounce(name, 500);

  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const trackNameToAddress = useFunctionTracker(
    'walletSdk.kadenaNames.nameToAddress',
  );

  useEffect(() => {
    setAddress(null);
    setError(null);

    if (!debouncedName) {
      setLoading(false);
      return;
    }

    let isCurrent = true;

    const getAddress = async () => {
      setLoading(true);
      try {
        const result = await trackNameToAddress.wrap(
          walletSdk.kadenaNames.nameToAddress,
        )(debouncedName, selectedNetwork);

        if (isCurrent) {
          if (result !== null) {
            setAddress(result);
          } else {
            setError('Name cannot be found');
          }
        }
      } catch (err) {
        console.error(err);
        if (isCurrent) {
          setError('An error occurred while fetching the address');
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };
    getAddress();

    return () => {
      isCurrent = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName, refreshKey, selectedNetwork]);

  return {
    address,
    error,
    loading,
    setName,
    name,
    trackNameToAddress: trackNameToAddress.data,
  };
};
