import {
  accountRepository,
  IAccount,
  IKeySet,
} from '@/modules/account/account.repository.ts';

import { useWallet } from '@/modules/wallet/wallet.hook';
import { IKeyItem } from '@/modules/wallet/wallet.repository.ts';
import { createPrincipal } from '@kadena/client-utils/built-in';

import { Key } from '@/Components/Key/Key.tsx';
import { Keyset } from '@/Components/Keyset/Keyset.tsx';
import { MonoAdd } from '@kadena/kode-icons/system';
import {
  Button,
  Heading,
  Select,
  SelectItem,
  Stack,
  TabItem,
  Tabs,
  Text,
  TextField,
} from '@kadena/kode-ui';
import { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { panelClass } from '../home/style.css.ts';
import { CreateKeySetDialog } from '../keys/Components/CreateKeySetDialog.tsx';
import { linkClass } from '../transfer/style.css.ts';
import { buttonListClass } from './style.css.ts';

export function CreateAccount() {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [created, setCreated] = useState<IAccount | null>(null);
  const [searchParams] = useSearchParams();
  const urlContract = searchParams.get('contract');
  const [contract, setContract] = useState<string | null>(urlContract);
  const [alias, setAlias] = useState<string | null>(null);
  const {
    keySources,
    createKey,
    profile,
    activeNetwork,
    fungibles,
    keysets,
    accounts,
  } = useWallet();

  const filteredAccounts = accounts.filter(
    (account) => account.contract === contract,
  );

  const usedKeys = filteredAccounts.map((account) => {
    const keys = account.keyset?.guard.keys;
    if (keys?.length === 1 && account.keyset?.guard.pred === 'keys-all') {
      return keys[0];
    }
  });

  const usedKeysets = filteredAccounts.map((account) => account.keyset?.uuid);

  const [showCreateKeyset, setShowCreateKeyset] = useState(false);

  const createAccountByKeyset = async (keyset: IKeySet) => {
    if (!profile || !activeNetwork || !contract) {
      throw new Error('Profile or active network not found');
    }
    const account: IAccount = {
      uuid: crypto.randomUUID(),
      alias: alias || '',
      profileId: profile.uuid,
      address: keyset.principal,
      keysetId: keyset.uuid,
      networkUUID: activeNetwork.uuid,
      contract,
      chains: [],
      overallBalance: '0',
    };

    await accountRepository.addAccount(account);

    setCreated(account);
  };

  const createAccountByKey = async (key: IKeyItem) => {
    if (!profile || !activeNetwork || !contract) {
      throw new Error('Profile or active network not found');
    }

    const guard = {
      keys: [key.publicKey],
      pred: 'keys-all' as const,
    };

    const principal = await createPrincipal({ keyset: guard }, {});

    let keyset = await accountRepository.getKeysetByPrincipal(
      principal,
      profile.uuid,
    );

    if (!keyset) {
      keyset = {
        principal: principal,
        guard: guard,
        profileId: profile.uuid,
        uuid: crypto.randomUUID(),
      };
      await accountRepository.addKeyset(keyset);
    }

    const account: IAccount = {
      uuid: crypto.randomUUID(),
      alias: alias || '',
      profileId: profile.uuid,
      address: principal,
      keysetId: keyset.uuid,
      networkUUID: activeNetwork.uuid,
      contract,
      chains: [],
      overallBalance: '0',
    };

    await accountRepository.addAccount(account);

    setCreated(account);
  };
  if (created) {
    return <Navigate to={`/account/${created.uuid}`} />;
  }

  return (
    <Stack flexDirection={'column'} gap={'xxl'}>
      <Heading variant="h3">Create Account</Heading>
      <Stack flexDirection={'column'} gap={'xxl'}>
        <Select
          label="Fungible Contract"
          selectedKey={contract}
          onSelectionChange={(key) => setContract(key as string)}
        >
          {fungibles.map((fungible) => (
            <SelectItem key={fungible.contract} textValue={fungible.contract}>
              {fungible.symbol} ({fungible.contract})
            </SelectItem>
          ))}
        </Select>
        <TextField label="Alias" onChange={(e) => setAlias(e.target.value)} />
        {
          <Stack gap={'lg'}>
            <Button
              isDisabled={!contract}
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              variant="outlined"
            >
              {showAdvancedOptions
                ? 'Switch to simple mode'
                : 'Use advanced options'}
            </Button>
            {!showAdvancedOptions && (
              <Button
                onClick={async () => {
                  const keySource = keySources[0];
                  const key = await createKey(keySource);
                  await createAccountByKey(key);
                }}
                isDisabled={!contract}
              >
                Create Account
              </Button>
            )}
          </Stack>
        }
        {contract && showAdvancedOptions && (
          <Stack flexDirection={'column'} gap={'md'}>
            <Tabs>
              <TabItem
                title={
                  <Text size="small" bold color="emphasize">
                    Create or use a key
                  </Text>
                }
              >
                <Stack flexDirection={'column'} gap={'md'}>
                  {keySources.map((keySource) => (
                    <Stack
                      key={keySource.uuid}
                      gap={'md'}
                      flexDirection={'column'}
                      className={panelClass}
                    >
                      <Stack
                        justifyContent={'space-between'}
                        alignItems={'center'}
                      >
                        <Heading variant="h4">{keySource.source}</Heading>
                        <Button
                          variant="info"
                          onPress={async () => {
                            const key = await createKey(keySource);
                            createAccountByKey(key);
                          }}
                        >
                          <Stack alignItems={'center'} gap={'sm'}>
                            <MonoAdd />
                            <span>Use a new key from {keySource.source}</span>
                          </Stack>
                        </Button>
                      </Stack>
                      <Text>
                        Select on of the following keys to create account
                      </Text>
                      <Stack flexDirection={'column'}>
                        <Stack></Stack>
                        {keySource.keys.map((key) => {
                          const disabled = usedKeys.includes(key.publicKey);
                          return (
                            <ButtonItem
                              key={key.publicKey}
                              onClick={() => createAccountByKey(key)}
                              disabled={disabled}
                            >
                              <Stack gap={'sm'} alignItems={'center'}>
                                <Stack gap={'sm'} flex={1}>
                                  <Key
                                    publicKey={key.publicKey}
                                    shortening={40}
                                  />
                                </Stack>
                                <Text size="small" color="emphasize">
                                  {disabled ? 'Already used' : 'Use'}
                                </Text>
                              </Stack>
                            </ButtonItem>
                          );
                        })}
                      </Stack>
                    </Stack>
                  ))}
                  <Link to={`/key-management/keys`} className={linkClass}>
                    Key Management
                  </Link>
                </Stack>
              </TabItem>
              <TabItem
                title={
                  <Text size="small" bold color="emphasize">
                    Create or use a keyset
                  </Text>
                }
              >
                {showCreateKeyset && (
                  <CreateKeySetDialog
                    isOpen={showCreateKeyset}
                    close={() => setShowCreateKeyset(false)}
                    onDone={(keyset) => {
                      createAccountByKeyset(keyset);
                    }}
                  />
                )}
                <Stack
                  flexDirection={'column'}
                  gap={'md'}
                  className={panelClass}
                >
                  <Stack justifyContent={'space-between'}>
                    <Heading variant="h3">Key Sets</Heading>
                    <Button
                      startVisual={<MonoAdd />}
                      onPress={() => setShowCreateKeyset(true)}
                      variant="info"
                    >
                      Use a new keyset
                    </Button>
                  </Stack>
                  <Text>
                    Select on of the following keysets to create account
                  </Text>
                  <Stack flexDirection={'column'} gap={'sm'}>
                    <Stack flexDirection={'column'}>
                      {keysets
                        .filter(({ guard }) => guard.keys.length >= 2)
                        .map((keyset) => {
                          const disabled = usedKeysets.includes(keyset.uuid);
                          return (
                            <ButtonItem
                              key={keyset.uuid}
                              onClick={() => createAccountByKeyset(keyset)}
                              disabled={disabled}
                            >
                              <Stack
                                gap={'md'}
                                justifyContent={'center'}
                                alignItems={'center'}
                              >
                                <Stack flex={1}>
                                  {<Keyset keySet={keyset} />}
                                </Stack>
                                {disabled && (
                                  <Text size="small" color="emphasize">
                                    Already used
                                  </Text>
                                )}
                              </Stack>
                            </ButtonItem>
                          );
                        })}
                    </Stack>
                  </Stack>
                </Stack>
                <Stack marginBlockStart={'md'}>
                  <Link to={`/key-management/keysets`} className={linkClass}>
                    Keyset Management
                  </Link>
                </Stack>
              </TabItem>
            </Tabs>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

function ButtonItem({
  children,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button {...props} className={buttonListClass}>
      {children}
    </button>
  );
}
