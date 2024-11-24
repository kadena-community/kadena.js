import { ChainId } from '@kadena/client';
import {
  Button,
  Select,
  SelectItem,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import { walletSdk } from '@kadena/wallet-sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { getChainIdByNetwork } from '../../actions/host';
import {
  executeCreateRegisterNameTransaction,
  fetchNameInfo,
  fetchPriceByPeriod,
} from '../../actions/kadenaNames/kadenaNamesActions';
import { PRICE_MAP } from '../../constants/kadenaNames/kadenaNamesConstants';
import { Account, useWalletState } from '../../state/wallet';
import { useDebounce } from '../../utils/useDebounce';

interface NameRegistrationFormProps {
  initialOwner?: string;
  initialAddress?: string;
  onRegistered?: () => void;
  balance?: number;
  onOwnerAddressChange?: (address: string) => void;
}

export const NameRegistrationForm: React.FC<NameRegistrationFormProps> = ({
  initialOwner = '',
  initialAddress = '',
  onRegistered,
  balance = 0,
  onOwnerAddressChange,
}) => {
  const [owner, setOwner] = useState(initialOwner);
  const [address, setAddress] = useState(initialAddress);
  const [name, setName] = useState('');
  const [registrationPeriod, setRegistrationPeriod] = useState<1 | 2>(1);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [price, setPrice] = useState<number | null>(null);

  const wallet = useWalletState();
  const { selectChain, selectedChain } = wallet;

  const validChain = getChainIdByNetwork(wallet.selectedNetwork);
  const debouncedName = useDebounce(name, 500);

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
        wallet.accounts.find((account: Account) => account.name === owner)
          ?.publicKey || '',
      );

      if (transaction) {
        const signedTransaction = await wallet.signTransaction(transaction);
        const final = await walletSdk.sendTransaction(
          signedTransaction,
          wallet.selectedNetwork,
          selectedChain ?? validChain,
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
    <Stack flexDirection="column" gap="md">
      {/* Network Info */}
      <Text variant="ui" color="default">
        Network: <strong>{wallet.selectedNetwork}</strong>
      </Text>
      <Text variant="ui" color="default">
        Current Balance: <strong>{balance} KDA</strong>
      </Text>

      {/* Owner Address */}
      <TextField
        label="Owner Address"
        placeholder="Enter your Kadena address"
        value={owner}
        onValueChange={(val) => {
          setOwner(val);
          onOwnerAddressChange?.(val);
        }}
        size="md"
      />

      {/* Receiver Address */}
      <TextField
        label="Receiver Address"
        placeholder="Enter the receiver address"
        value={address}
        onValueChange={setAddress}
        size="md"
      />

      {/* Chain Selector */}
      <Select
        label="Chain"
        selectedKey={selectedChain ?? validChain}
        onSelectionChange={(key) => selectChain(key as ChainId)}
        size="md"
      >
        <SelectItem key={validChain}>Chain {validChain}</SelectItem>
      </Select>

      {/* Registration Period */}
      <Select
        label="Registration Period"
        selectedKey={registrationPeriod.toString()}
        onSelectionChange={(key) =>
          setRegistrationPeriod(parseInt(key as string) as 1 | 2)
        }
        size="md"
      >
        {Object.keys(PRICE_MAP).map((period) => (
          <SelectItem key={period}>{period} Year(s)</SelectItem>
        ))}
      </Select>

      {/* Name Input */}
      <TextField
        label="Name"
        placeholder="Enter the name to register"
        value={name}
        onValueChange={setName}
        size="md"
      />

      {/* Price Info */}
      {price !== null && (
        <Text variant="body">
          <strong>Price:</strong> {price} KDA for {registrationPeriod} year(s)
        </Text>
      )}

      {/* Register Button */}
      <Button
        variant="primary"
        onPress={handleRegister}
        isDisabled={
          availabilityLoading ||
          priceLoading ||
          registering ||
          price === null ||
          (price !== null && balance < price)
        }
      >
        {getButtonText()}
      </Button>

      {/* Status/Error Messages */}
      {status && <Text variant="body">{status}</Text>}
      {error && <Text variant="body">{error}</Text>}
    </Stack>
  );
};
