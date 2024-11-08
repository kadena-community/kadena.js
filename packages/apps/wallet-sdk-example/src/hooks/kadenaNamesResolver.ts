/* work in progress */

import { walletSdk } from '@kadena/wallet-sdk';
import { useEffect, useState } from 'react';
import { useDebounce } from '../utils/useDebounce';

export const useAddressToName = (refreshKey = 0) => {
  const [address, setAddress] = useState<string>('');
  const debouncedAddress = useDebounce(address, 500);

  const [name, setName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
        const result = await walletSdk.kadenaNames.addressToName(
          debouncedAddress,
          'mainnet01',
        );
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
  }, [debouncedAddress, refreshKey]);

  return { name, error, loading, setAddress, address };
};

export const useNameToAddress = () => {
  const [name, setName] = useState<string>('');
  const debouncedName = useDebounce(name, 500);

  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
        const result = await walletSdk.kadenaNames.nameToAddress(
          debouncedName,
          'mainnet01',
        );
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
  }, [debouncedName]);

  return { address, error, loading, setName, name };
};
