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
  Card,
  Divider,
  Heading,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Stack,
  TabItem,
  Tabs,
  Text,
  TextField,
} from '@kadena/kode-ui';
import classNames from 'classnames';
import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { panelClass } from '../home/style.css.ts';
import { CreateKeySetDialog } from '../keys/Components/CreateKeySetDialog.tsx';
import { buttonListClass } from './style.css.ts';

type AccountType = 'k:account' | 'w:account' | 'r:account';
export function CreateAccount() {
  const [selectedItem, setSelectedItem] = useState<
    | {
        item: IKeySet;
        type: 'keyset';
      }
    | {
        item: IKeyItem;
        type: 'key';
      }
  >();
  const [created, setCreated] = useState<IAccount | null>(null);
  const [accountType, setAccountType] = useState<AccountType>('k:account');
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
  if (created) {
    return <Navigate to={`/account/${created.uuid}`} />;
  }

  const filteredKeySources = keySources.filter(
    (ks) =>
      (accountType === 'k:account' && ks.source !== 'web-authn') ||
      (accountType === 'w:account' && ks.source === 'web-authn'),
  );

  const filteredKeysets = keysets.filter(
    (keyset) =>
      keyset.guard.keys.length >= 2 && !usedKeysets.includes(keyset.uuid),
  );

  return (
    <Card>
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

          <Heading variant="h3">Choose the account type</Heading>
          <RadioGroup
            direction="column"
            value={accountType}
            onChange={(type) => {
              setSelectedItem(undefined);
              setAccountType(type as AccountType);
            }}
          >
            <Stack
              flexDirection={'column'}
              gap={'sm'}
              style={{ maxWidth: 650 }}
            >
              <Stack flexDirection={'column'} gap={'sm'}>
                <Radio value="k:account">k: account</Radio>
                <Text size="small">
                  This account will be guarded by a single key, this is the most
                  relevant way if you are creating a personal account; Also this
                  type of account supposed widely by kadena ecosystem.
                </Text>
                <Text size="small" color="emphasize">
                  Tip: The account guard is immutable and can't be changed.
                </Text>
              </Stack>
              <Divider />
              <Stack flexDirection={'column'} gap={'sm'}>
                <Radio value="w:account">w: account</Radio>
                <Text size="small">
                  This account will be guarded by a keyset or (single key when
                  key type is web-authn). This will offers a way to create
                  shared account or more secure account guarded by several keys.
                </Text>
                <Text size="small" color="emphasize">
                  Tip: The account guard is immutable and can't be changed.
                </Text>
              </Stack>
              <Divider />
              <Stack flexDirection={'column'} gap={'sm'}>
                <Radio value="r:account" isDisabled>
                  r: account (not supposed yet)
                </Radio>
                <Stack
                  gap="sm"
                  style={{ opacity: 0.7 }}
                  flexDirection={'column'}
                >
                  <Text size="small">
                    This account will be guarded by a keyset reference. this is
                    more suitable if you want to change the guard later without
                    creating a new account. Creating this type of account
                    requires namespace generation so its not supported yet with
                    most of the wallets
                  </Text>
                  <Text size="small">
                    Tip: Since the guard can be changed, this type of account is
                    more flexible.
                  </Text>
                </Stack>
              </Stack>
            </Stack>
          </RadioGroup>

          {contract && (
            <Stack flexDirection={'column'} gap={'xxl'}>
              {accountType === 'w:account' && (
                <Stack flexDirection={'column'} gap={'md'}>
                  {showCreateKeyset && (
                    <CreateKeySetDialog
                      isOpen={showCreateKeyset}
                      close={() => setShowCreateKeyset(false)}
                      onDone={(keyset) => {
                        setSelectedItem({
                          item: keyset,
                          type: 'keyset',
                        });
                      }}
                    />
                  )}
                  <Heading variant="h4">Keysets</Heading>
                  <Stack
                    flexDirection={'column'}
                    gap={'md'}
                    className={panelClass}
                  >
                    <Stack justifyContent={'space-between'}>
                      <Heading variant="h4">Create or use a keyset</Heading>
                      <Button
                        isCompact
                        startVisual={<MonoAdd />}
                        onPress={() => setShowCreateKeyset(true)}
                        variant="outlined"
                      >
                        Create a new keyset
                      </Button>
                    </Stack>
                    <Text>
                      {filteredKeysets.length === 0
                        ? 'There is not keyset available to select, create a new one'
                        : 'Select on of the following keysets to create account'}
                    </Text>
                    <Stack flexDirection={'column'} gap={'sm'}>
                      <Stack flexDirection={'column'}>
                        {filteredKeysets.map((keyset) => {
                          return (
                            <ButtonItem
                              key={keyset.uuid}
                              selected={
                                selectedItem?.type === 'keyset' &&
                                selectedItem?.item.uuid === keyset.uuid
                              }
                              onClick={() =>
                                setSelectedItem({
                                  item: keyset,
                                  type: 'keyset',
                                })
                              }
                            >
                              <Stack
                                gap={'md'}
                                justifyContent={'center'}
                                alignItems={'center'}
                              >
                                <Stack flex={1}>
                                  {<Keyset keySet={keyset} />}
                                </Stack>
                              </Stack>
                            </ButtonItem>
                          );
                        })}
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              )}
              {['k:account', 'w:account'].includes(accountType) &&
                filteredKeySources.length && (
                  <Stack
                    // className={panelClass}
                    flexDirection={'column'}
                    gap={'md'}
                    flex={1}
                  >
                    <Heading variant="h4">Keys</Heading>
                    <Stack flexDirection={'column'} gap={'md'}>
                      {filteredKeySources.map((keySource) => {
                        const filteredKeys = keySource.keys.filter(
                          (key) => !usedKeys.includes(key.publicKey),
                        );
                        return (
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
                                variant="outlined"
                                isCompact
                                onPress={async () => {
                                  const key = await createKey(keySource);
                                  setSelectedItem({
                                    item: key,
                                    type: 'key',
                                  });
                                }}
                              >
                                <Stack alignItems={'center'} gap={'sm'}>
                                  <MonoAdd />
                                  <span>
                                    Create a new key from {keySource.source}
                                  </span>
                                </Stack>
                              </Button>
                            </Stack>
                            <Text>
                              {filteredKeys.length === 0
                                ? 'There is not key available to select, create a new one'
                                : 'Select on of the following keys to create account'}
                            </Text>
                            <Stack flexDirection={'column'}>
                              <Stack></Stack>
                              {keySource.keys
                                .filter(
                                  (key) => !usedKeys.includes(key.publicKey),
                                )
                                .map((key) => {
                                  return (
                                    <ButtonItem
                                      key={key.publicKey}
                                      selected={
                                        selectedItem?.type === 'key' &&
                                        selectedItem?.item.publicKey ===
                                          key.publicKey
                                      }
                                      onClick={() =>
                                        setSelectedItem({
                                          item: key,
                                          type: 'key',
                                        })
                                      }
                                    >
                                      <Stack gap={'sm'} alignItems={'center'}>
                                        <Stack gap={'sm'} flex={1}>
                                          <Key
                                            publicKey={key.publicKey}
                                            shortening={20}
                                          />
                                        </Stack>
                                      </Stack>
                                    </ButtonItem>
                                  );
                                })}
                            </Stack>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Stack>
                )}
            </Stack>
          )}
        </Stack>
        <Stack gap="sm">
          <Button variant="transparent">Cancel</Button>
          <Button
            isDisabled={!selectedItem}
            onClick={() => {
              if (selectedItem?.type === 'keyset') {
                createAccountByKeyset(selectedItem.item);
              } else if (selectedItem?.type === 'key') {
                createAccountByKey(selectedItem.item);
              }
            }}
          >
            <>
              Create {accountType}{' '}
              {selectedItem?.type ? `with ${selectedItem.type}` : ''}
            </>
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

function ButtonItem({
  children,
  selected = false,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { selected?: boolean }) {
  return (
    <button
      {...props}
      className={classNames(buttonListClass, selected && 'selected')}
    >
      {children}
    </button>
  );
}
