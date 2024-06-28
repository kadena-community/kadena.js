import {
  IAccount,
  IKeySet,
  accountRepository,
} from '@/modules/account/account.repository.ts';
import { useHDWallet } from '@/modules/key-source/hd-wallet/hd-wallet.tsx';
import { keySourceManager } from '@/modules/key-source/key-source-manager.ts';
import { WebAuthnService } from '@/modules/key-source/web-authn/webauthn.ts';
import { useNetwork } from '@/modules/network/network.hook.ts';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { KeySourceType } from '@/modules/wallet/wallet.repository.ts';
import { createPrincipal } from '@kadena/client-utils/built-in';
import { kadenaGenMnemonic } from '@kadena/hd-wallet';
import {
  Button,
  Heading,
  Select,
  SelectItem,
  Stack,
  Text,
  TextareaField,
} from '@kadena/react-ui';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  advanceOptions,
  cardClass,
  keyInput,
  selectedClass,
} from './style.css.ts';

export function CreateAccount() {
  const [created, setCreated] = useState(false);
  const { keySources, createKey, profile, askForPassword } = useWallet();
  const { activeNetwork } = useNetwork();
  const [selectedPred, setSelectedPred] = useState<
    'keys-all' | 'keys-any' | 'keys-2'
  >('keys-all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [externalKeys, setExternalKeys] = useState('');
  const [selectedKeySources, setSelectedKeySources] = useState<string[]>([]);

  const { createHDWallet } = useHDWallet();
  async function createWebAuthn() {
    if (!profile) {
      throw new Error('No profile found');
    }
    if (keySources.find((keySource) => keySource.source === 'web-authn')) {
      // basically its possible to have multiple web-authn sources
      // but for now just for simplicity we will only allow one
      alert('WebAuthn already created');
      throw new Error('WebAuthn already created');
    }
    const service = (await keySourceManager.get(
      'web-authn',
    )) as WebAuthnService;

    const { uuid } = await service.register(profile.uuid);
    setSelectedKeySources([...selectedKeySources, uuid]);
  }

  const registerWallet = (type: KeySourceType) => async () => {
    if (type === 'web-authn') {
      return createWebAuthn();
    }
    if (!profile) {
      return;
    }
    const password = await askForPassword();
    if (!password) {
      return;
    }
    const mnemonic = kadenaGenMnemonic();
    const { uuid } = await createHDWallet(
      profile?.uuid,
      type,
      password,
      mnemonic,
    );
    setSelectedKeySources([...selectedKeySources, uuid]);
  };

  const create = async () => {
    if (!profile || !activeNetwork) {
      throw new Error('Profile or active network not found');
    }
    const keys = showAdvanced
      ? externalKeys.split(/\r?\n/).filter((key) => key.length > 0)
      : [];
    for (const keySource of keySources.filter((keySource) =>
      selectedKeySources.includes(keySource.uuid),
    )) {
      const key = await createKey(keySource);
      keys.push(key.publicKey);
    }

    const guard = {
      keys: keys,
      pred: showAdvanced ? selectedPred : 'keys-all',
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
      networkId: activeNetwork.networkId,
      contract: 'coin',
      chains: [],
      overallBalance: '0',
    };

    await accountRepository.addKeyset(keySet);
    await accountRepository.addAccount(account);

    setCreated(true);
  };
  if (created) {
    return <Navigate to="/" />;
  }

  const keysCount = showAdvanced
    ? externalKeys.split(/\r?\n/).filter((key) => key.length > 0).length +
      selectedKeySources.length
    : selectedKeySources.length;

  return (
    <Stack
      flexDirection={'column'}
      gap={'md'}
      justifyContent={'flex-start'}
      alignItems={'flex-start'}
    >
      <Heading variant="h3">Create Account</Heading>
      <Text>You can guard an account with keys from the following sources</Text>
      <Stack flexDirection={'row'} flex={1} gap={'lg'}>
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
            <Text>{keySource.source}</Text>
          </button>
        ))}
        {['HD-BIP44', 'HD-chainweaver', 'web-authn']
          .filter((type) => !keySources.find((k) => k.source === type))
          .map((type) => (
            <button
              key={type}
              className={cardClass}
              onClick={registerWallet(type as KeySourceType)}
            >
              <Stack flexDirection={'column'}>
                <Text>{type}</Text>
                <Text size="smallest">Not installed yet </Text>
              </Stack>
            </button>
          ))}
      </Stack>
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
          <Stack flexDirection={'column'}>
            <Heading variant="h6">External keys</Heading>
            <Text variant="body" size="small">
              Press <Text bold>Enter</Text> to separate each key
            </Text>
          </Stack>
          <Stack width="100%">
            <TextareaField
              className={` ${keyInput}`}
              name="externalKey"
              value={externalKeys}
              onChange={(e) => setExternalKeys(e.target.value)}
            />
          </Stack>
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
      <Text>
        {!keysCount
          ? 'Select at least one key source to create an account'
          : `The account will be guarded by ${keysCount} keys`}
      </Text>
      <Button onClick={create} isDisabled={!keysCount}>
        Create
      </Button>
    </Stack>
  );
}
