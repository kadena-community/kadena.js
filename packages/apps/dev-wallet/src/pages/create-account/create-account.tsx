import {
  IAccount,
  IKeySet,
  accountRepository,
} from '@/modules/account/account.repository.ts';
import { useNetwork } from '@/modules/network/network.hook.ts';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { createPrincipal } from '@kadena/client-utils';
import {
  Button,
  Heading,
  Select,
  SelectItem,
  Stack,
  Text,
} from '@kadena/react-ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  advanceOptions,
  cardClass,
  keyInput,
  selectedClass,
} from './style.css.ts';

export function CreateAccount() {
  const { keySources, createKey, profile } = useWallet();
  const { activeNetwork } = useNetwork();
  const navigate = useNavigate();
  const [selectedPred, setSelectedPred] = useState<
    'keys-all' | 'keys-any' | 'keys-2'
  >('keys-all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [externalKeys, setExternalKeys] = useState('');
  const [selectedKeySources, setSelectedKeySources] = useState<string[]>([]);
  const create = async () => {
    if (!profile || !activeNetwork) {
      throw new Error('Profile or active network not found');
    }
    const keys = externalKeys.split(',').filter((key) => key.length > 0);
    for (const keySource of keySources.filter((keySource) =>
      selectedKeySources.includes(keySource.uuid),
    )) {
      const key = await createKey(keySource);
      keys.push(key.publicKey);
    }

    const guard = {
      keys: keys,
      pred: selectedPred,
    };

    const principal = await createPrincipal(
      { keyset: guard },
      { defaults: { meta: { chainId: '0' }, networkId: 'mainnet01' } },
    );

    const keySet: IKeySet = {
      guard: {
        keys: keys,
        pred: selectedPred,
      },
      principal,
      profileId: profile.uuid,
      uuid: crypto.randomUUID(),
    };

    const account: IAccount = {
      uuid: crypto.randomUUID(),
      profileId: profile.uuid,
      address: principal,
      keysetId: keySet.uuid,
      networkId: activeNetwork.uuid,
      contract: 'coin',
      chains: [],
      overallBalance: '0',
    };

    await accountRepository.addKeyset(keySet);
    await accountRepository.addAccount(account);

    console.log('Account created: ', account);

    navigate('/');
  };
  return (
    <Stack
      flexDirection={'column'}
      gap={'md'}
      justifyContent={'flex-start'}
      alignItems={'flex-start'}
    >
      <Heading variant="h3">Create Account</Heading>
      <Text>You can guard an account with keys from the following sources</Text>
      {keySources.map((keySource) => (
        <button
          key={keySource.uuid}
          className={`${selectedKeySources.includes(keySource.uuid) ? selectedClass : cardClass}`}
          onClick={() => {
            if (selectedKeySources.includes(keySource.uuid)) {
              setSelectedKeySources(
                selectedKeySources.filter((uuid) => uuid !== keySource.uuid),
              );
            } else {
              setSelectedKeySources([...selectedKeySources, keySource.uuid]);
            }
          }}
        >
          <Stack
            flexDirection={'column'}
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
          >
            <Text>{keySource.source}</Text>
            <Text>{keySource.uuid}</Text>
          </Stack>
        </button>
      ))}
      <button
        className={advanceOptions}
        onClick={() => {
          setShowAdvanced((prev) => !prev);
        }}
      >
        {showAdvanced ? 'hide ' : 'show '} advance options
      </button>
      {showAdvanced && (
        <>
          <Heading variant="h6">External keys, comma separated</Heading>
          <input
            className={`${cardClass} ${keyInput}`}
            name="externalKey"
            type="text"
            value={externalKeys}
            onChange={(e) => setExternalKeys(e.target.value)}
          />
          <Heading variant="h6">pred function</Heading>
          <Select
            selectedKey={selectedPred}
            onSelectionChange={(opion) => {
              setSelectedPred(opion as 'keys-all' | 'keys-any' | 'keys-2');
            }}
          >
            <SelectItem key={'keys-all'}>All-keys</SelectItem>
            <SelectItem key={'keys-any'}>One-Key</SelectItem>
            <SelectItem key={'keys-two'}>two-Keys</SelectItem>
          </Select>
        </>
      )}
      <Button onClick={create} isDisabled={!selectedKeySources.length}>
        Create
      </Button>
    </Stack>
  );
}
