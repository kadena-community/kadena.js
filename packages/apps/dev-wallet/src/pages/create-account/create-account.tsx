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
import {
  MonoAdd,
  MonoCheck,
  MonoOpenInBrowser,
} from '@kadena/kode-icons/system';
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
  Text,
  TextField,
  Link as UiLink,
} from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import classNames from 'classnames';
import { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { panelClass } from '../home/style.css.ts';
import { CreateKeySetForm } from '../keys/Components/CreateKeySetForm.tsx';
import { buttonListClass } from './style.css.ts';

type IKeySetType =
  | {
      item: IKeySet;
      type: 'keyset';
    }
  | {
      item: IKeyItem;
      type: 'key';
    };

type AccountType = 'multi-signatures' | 'single-key';
export function CreateAccount() {
  const [showUsedItems, setShowUsedItems] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const [selectedItem, setSelectedItem] = useState<IKeySetType>();
  const [created, setCreated] = useState<IAccount | null>(null);
  const [accountType, setAccountType] = useState<AccountType>('single-key');
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

  const getSingleKeyAccount = (key: string) =>
    filteredAccounts.find((account) => {
      const keys = account.keyset?.guard.keys;
      if (
        keys?.length === 1 &&
        keys[0] === key &&
        account.keyset?.guard.pred === 'keys-all'
      ) {
        return account;
      }
    });

  const symbol =
    fungibles.find((f) => f.contract === contract)?.symbol ?? contract;

  const aliasDefaultValue = contract
    ? `${contract === 'coin' ? '' : `${symbol} `}Account ${filteredAccounts.length + 1}`
    : '';

  const createAccountByKeyset = async (keyset: IKeySet) => {
    if (!profile || !activeNetwork || !contract) {
      throw new Error('Profile or active network not found');
    }
    const account: IAccount = {
      uuid: crypto.randomUUID(),
      alias: alias || aliasDefaultValue,
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

  const filteredKeysets = keysets
    .filter((keyset) => keyset.guard.keys.length >= 2)
    .map((keyset) => ({
      ...keyset,
      account: filteredAccounts.find(
        (account) => account.keysetId === keyset.uuid,
      ),
    }))
    .sort((a) => (a.account ? 1 : -1));

  const showUsedItemsComponent = (
    <Button
      isCompact
      variant="transparent"
      onClick={() => setShowUsedItems((prev) => !prev)}
    >
      {showUsedItems ? 'Hide used items' : 'Show used items'}
    </Button>
  );

  return (
    <>
      <CreateKeySetForm
        isOpen={isRightAsideExpanded}
        close={() => setIsRightAsideExpanded(false)}
        onDone={(keyset: IKeySet) => {
          setSelectedItem({
            item: keyset,
            type: 'keyset',
          });
        }}
      />

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
                <SelectItem
                  key={fungible.contract}
                  textValue={fungible.contract}
                >
                  {fungible.symbol} ({fungible.contract})
                </SelectItem>
              ))}
            </Select>
            <TextField
              label="Alias"
              defaultValue={aliasDefaultValue}
              value={alias || aliasDefaultValue}
              onChange={(e) => setAlias(e.target.value)}
            />

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
                  <Radio value="single-key">Single Key Account</Radio>
                  <Text size="small">
                    This account will be guarded by a single key, this is the
                    most relevant way if you are creating a personal account;
                    Also this type of account supported widely by kadena
                    ecosystem.
                  </Text>
                  <Text size="small" color="emphasize">
                    Tip: The account guard is immutable and can't be changed.
                  </Text>
                </Stack>
                <Divider />
                <Stack flexDirection={'column'} gap={'sm'}>
                  <Radio value="multi-signatures">
                    Multi Signatures Account
                  </Radio>
                  <Text size="small">
                    This account will be guarded by a keyset. This will offers a
                    way to create shared account or more secure account guarded
                    by several keys.
                  </Text>
                  <Text size="small" color="emphasize">
                    Tip: The account guard is immutable and the account address
                    is bind to the guard.
                  </Text>
                </Stack>
                <Divider />
              </Stack>
            </RadioGroup>

            {contract && (
              <Stack flexDirection={'column'} gap={'xxl'}>
                {accountType === 'multi-signatures' && (
                  <Stack flexDirection={'column'} gap={'md'}>
                    <Stack
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <Heading variant="h4">Keysets</Heading>
                      {showUsedItemsComponent}
                    </Stack>
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
                          onPress={() => setIsRightAsideExpanded(true)}
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
                          {filteredKeysets
                            .filter((ks) => showUsedItems || !ks.account)
                            .map((keyset) => {
                              return (
                                <Stack gap={'sm'} alignItems={'center'}>
                                  <ButtonItem
                                    key={keyset.uuid}
                                    disabled={Boolean(keyset.account)}
                                    selected={
                                      selectedItem?.type === 'keyset' &&
                                      selectedItem?.item.uuid === keyset.uuid
                                    }
                                    onClick={() => {
                                      if (!keyset.account) {
                                        setSelectedItem({
                                          item: keyset,
                                          type: 'keyset',
                                        });
                                      }
                                    }}
                                  >
                                    <Stack
                                      gap={'md'}
                                      justifyContent={'center'}
                                      alignItems={'center'}
                                    >
                                      <Stack flex={1} gap={'sm'}>
                                        {<Keyset keySet={keyset} />}
                                      </Stack>
                                    </Stack>
                                  </ButtonItem>
                                  {keyset.account && (
                                    <UiLink
                                      href={`/account/${keyset.account.uuid}`}
                                      component={Link}
                                    >
                                      <MonoOpenInBrowser />
                                    </UiLink>
                                  )}
                                  {!keyset.account && (
                                    <Button
                                      variant="transparent"
                                      onPress={() => {
                                        setSelectedItem({
                                          item: keyset,
                                          type: 'keyset',
                                        });
                                      }}
                                    >
                                      <MonoCheck />
                                    </Button>
                                  )}
                                </Stack>
                              );
                            })}
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                )}
                {accountType === 'single-key' && keySources.length && (
                  <Stack
                    // className={panelClass}
                    flexDirection={'column'}
                    gap={'md'}
                    flex={1}
                  >
                    <Stack
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <Heading variant="h4">Keys</Heading>
                      {showUsedItemsComponent}
                    </Stack>
                    <Stack flexDirection={'column'} gap={'md'}>
                      {keySources.map((keySource) => {
                        const filteredKeys = keySource.keys.filter((key) =>
                          getSingleKeyAccount(key.publicKey),
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
                              {keySource.keys
                                .map((key) => ({
                                  ...key,
                                  account: getSingleKeyAccount(key.publicKey),
                                }))
                                .filter((key) => showUsedItems || !key.account)
                                .sort((a) => (a.account ? 1 : -1))
                                .map((key) => {
                                  const account = key.account;
                                  return (
                                    <Stack gap={'sm'} alignItems={'center'}>
                                      <ButtonItem
                                        key={key.publicKey}
                                        selected={
                                          selectedItem?.type === 'key' &&
                                          selectedItem?.item.publicKey ===
                                            key.publicKey
                                        }
                                        disabled={Boolean(account)}
                                        onClick={() => {
                                          if (account) return;
                                          setSelectedItem({
                                            item: key,
                                            type: 'key',
                                          });
                                        }}
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
                                      {account && (
                                        <UiLink
                                          href={`/account/${account?.uuid}`}
                                          component={Link}
                                        >
                                          <MonoOpenInBrowser />
                                        </UiLink>
                                      )}
                                      {!account && (
                                        <Button
                                          variant="transparent"
                                          onPress={() => {
                                            setSelectedItem({
                                              item: key,
                                              type: 'key',
                                            });
                                          }}
                                        >
                                          <MonoCheck />
                                        </Button>
                                      )}
                                    </Stack>
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
              <>Create {accountType} account</>
            </Button>
          </Stack>
        </Stack>
      </Card>
    </>
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
