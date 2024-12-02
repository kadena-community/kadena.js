import { ButtonItem } from '@/Components/ButtonItem/ButtonItem';
import { ComboField } from '@/Components/ComboField/ComboField';
import { KeySetDialog } from '@/Components/KeysetDialog/KeySetDialog';
import { ListItem } from '@/Components/ListItem/ListItem';
import { usePrompt } from '@/Components/PromptProvider/Prompt';
import {
  IAccount,
  IKeySet,
  IWatchedAccount,
} from '@/modules/account/account.repository';
import { hasSameGuard } from '@/modules/account/account.service';
import { IContact } from '@/modules/contact/contact.repository';
import { INetwork } from '@/modules/network/network.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { withRaceGuard } from '@/utils/promise-utils';
import { debounce } from '@/utils/session';
import { ISigner } from '@kadena/client';
import { MonoClose, MonoInfo } from '@kadena/kode-icons/system';
import { Button, Divider, Heading, Stack, Text } from '@kadena/kode-ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { labelClass } from '../Steps/style.css';
import { discoverReceiver, IReceiverAccount } from '../utils';
import { AccountItem } from './AccountItem';
import { Keyset } from './keyset';
import { createAccountBoxClass, popoverClass } from './style.css';

const Label = ({ children }: { children: React.ReactNode }) => (
  <Text size="small" className={labelClass}>
    {children}
  </Text>
);

const discover = withRaceGuard(debounce(discoverReceiver, 500));

export function AccountSearchBox({
  accounts = [],
  watchedAccounts = [],
  contacts = [],
  network,
  contract,
  onSelect,
  selectedAccount,
  onDiscoveryChange,
}: {
  accounts?: IAccount[];
  contacts?: IContact[];
  watchedAccounts?: IWatchedAccount[];
  network: INetwork;
  contract: string;
  onSelect: (account?: IReceiverAccount) => void;
  selectedAccount?: IReceiverAccount;
  onDiscoveryChange?: (discovering: boolean) => void;
}) {
  const prompt = usePrompt();
  const [value, setValue] = useState<string>(selectedAccount?.address || '');
  const { getPublicKeyData } = useWallet();
  const [discovering, setDiscoveringValue] = useState(false);
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);
  const liveIsOpen = useRef(popoverIsOpen);
  liveIsOpen.current = popoverIsOpen;
  const [discoverdAccount, setDiscoveredAccounts] =
    useState<IReceiverAccount[]>();

  useEffect(() => {
    if (selectedAccount) {
      setValue(selectedAccount.address);
    }
  }, [selectedAccount]);

  function setDiscovering(value: boolean) {
    setDiscoveringValue(value);
    if (onDiscoveryChange) {
      onDiscoveryChange(value);
    }
  }

  const mapKeys = useCallback(
    (key: ISigner) => {
      if (typeof key === 'object') return key;
      const info = getPublicKeyData(key);
      if (info && info.scheme) {
        return {
          pubKey: key,
          scheme: info.scheme,
        };
      }
      if (key.startsWith('WEBAUTHN')) {
        return {
          pubKey: key,
          scheme: 'WebAuthn' as const,
        };
      }
      return key;
    },
    [getPublicKeyData],
  );

  function onSelectHandel(account?: IReceiverAccount) {
    onSelect(account);
    if (account) {
      setValue(account.address);
      if (
        !discoverdAccount?.find((acc) =>
          hasSameGuard(acc.keyset.guard, account.keyset.guard),
        )
      ) {
        const address = account.address;

        setDiscoveredAccounts([]);
        discover(address, network.networkId, contract, mapKeys)
          .then((discovered) => {
            setDiscoveredAccounts(discovered);
          })
          .catch(() => {
            setDiscoveredAccounts([]);
          });
      }
    }
  }

  function getFilteredAccounts(search: string, extra: IReceiverAccount[] = []) {
    // if (discovering) return [];
    const hasTerm = searchAccount(search);
    const myAccounts = accounts
      .filter((account) =>
        searchAccount(search)({
          address: account.address,
          alias: account.alias,
          keysetAlias: account.keyset?.alias,
          keys: account.keyset?.guard?.keys,
        }),
      )
      .map((account) => ({
        address: account.address,
        alias: account.alias,
        overallBalance: account.overallBalance,
        keyset: account.keyset!,
        chains: account.chains,
      }));

    const filteredWatchedAccounts = watchedAccounts
      .filter((account) =>
        hasTerm({
          address: account.address,
          alias: account.alias,
          keys: account.keyset?.guard?.keys,
        }),
      )
      .map((account) => ({
        address: account.address,
        alias: account.alias,
        overallBalance: account.overallBalance,
        keyset: account.keyset!,
        chains: account.chains,
      }));

    const filteredContacts = contacts
      .filter((contact) => {
        return hasTerm({
          address: contact.account.address,
          alias: contact.name,
          keys: contact.account.keyset?.keys,
        });
      })
      .map((account) => ({
        address: account.account.address,
        alias: account.name,
        overallBalance: '0',
        chains: [],
        keyset: { guard: account.account.keyset! },
      }));

    const filteredDiscoveredAccounts =
      discoverdAccount?.filter((account) => account.address === search) ?? [];

    const uniqueAccounts = [
      ...myAccounts,
      ...filteredWatchedAccounts,
      ...filteredContacts,
      ...filteredDiscoveredAccounts,
      ...extra,
    ].filter(
      (account, index, allAccounts) =>
        allAccounts.findIndex(
          (t) =>
            t.address === account.address &&
            hasSameGuard(account.keyset.guard, t.keyset.guard),
        ) === index,
    );

    console.log('uniqueAccounts', uniqueAccounts);

    return uniqueAccounts;
  }

  function checkAccount(
    search: string,
    accounts: IReceiverAccount[] = getFilteredAccounts(search),
  ) {
    if (accounts.length === 1) {
      const account = accounts[0];
      onSelectHandel(account);
    }
    if (accounts.length === 0) {
      onSelectHandel(undefined);
    }
    if (accounts.length > 1 && selectedAccount) {
      const result = accounts.find((account) => {
        selectedAccount.address === account.address &&
          hasSameGuard(selectedAccount.keyset.guard, account.keyset.guard);
      });
      if (!result) {
        onSelectHandel(undefined);
      }
    }
  }

  function getDescription() {
    if (selectedAccount) return undefined;
    if (discovering) return undefined;
    const discovered = discoverdAccount?.length ?? 0;
    console.log('discovered', discoverdAccount);
    if (value && !popoverIsOpen) {
      if (!discovered)
        return (
          <Text size="smallest">
            No account found for{' '}
            {
              <Text size="smallest" bold>
                {value}
              </Text>
            }
          </Text>
        );

      if (discovered > 1)
        return (
          <Text size="smallest">
            There are {discovered} accounts associated with the address{' '}
            <strong>{value}</strong> on the Blockchain.
          </Text>
        );
    }
  }

  return (
    <Stack flexDirection={'column'}>
      <ComboField
        aria-label="Receiver Address"
        placeholder="Select ot enter an address"
        startVisual={<Label>Address:</Label>}
        description={getDescription()}
        type="text"
        size="sm"
        info={selectedAccount?.alias ? `Alias: ${selectedAccount.alias}` : ''}
        onOpen={() => {
          setPopoverIsOpen(true);
        }}
        clear={
          (value || selectedAccount) && (
            <Button
              variant="transparent"
              isCompact
              onClick={() => {
                setValue('');
                onSelectHandel(undefined);
              }}
            >
              <Text size="smallest">
                <MonoClose />
              </Text>
            </Button>
          )
        }
        onClose={() => {
          setPopoverIsOpen(false);
          if (discovering) return;
          checkAccount(value);
        }}
        onChange={(e) => {
          const address = e.target.value;
          setValue(address);
          setDiscovering(true);
          setDiscoveredAccounts([]);
          discover(address, network.networkId, contract, mapKeys)
            .then((discovered) => {
              setDiscovering(false);
              setDiscoveredAccounts(discovered);
              if (liveIsOpen.current) return;
              const filteredAccounts = getFilteredAccounts(address, discovered);
              checkAccount(address, filteredAccounts);
            })
            .catch(() => {
              setDiscovering(false);
              setDiscoveredAccounts([]);
            });
        }}
        value={value}
      >
        {({ value: search, close }) => {
          const hasTerm = searchAccount(search);
          const myAccount = accounts
            .filter((account) =>
              hasTerm({
                address: account.address,
                alias: account.alias,
                keysetAlias: account.keyset?.alias,
                keys: account.keyset?.guard?.keys,
              }),
            )
            .map((account) => (
              <ButtonItem
                onClick={() => {
                  onSelectHandel({
                    address: account.address,
                    alias: account.alias,
                    overallBalance: account.overallBalance,
                    keyset: account.keyset!,
                    chains: account.chains,
                  });
                  close();
                }}
              >
                <Text>
                  <Stack
                    textAlign="left"
                    gap={'sm'}
                    alignItems={'center'}
                    width="100%"
                  >
                    <AccountItem
                      account={account}
                      keyset={account.keyset?.guard}
                    />
                  </Stack>
                </Text>
              </ButtonItem>
            ));

          const filteredWatchedAccounts = watchedAccounts
            .filter((account) =>
              hasTerm({
                address: account.address,
                alias: account.alias,
                keys: account.keyset?.guard?.keys,
              }),
            )
            .map((account) => (
              <ButtonItem
                onClick={() => {
                  onSelectHandel({
                    address: account.address,
                    alias: account.alias,
                    overallBalance: account.overallBalance,
                    keyset: account.keyset,
                    chains: account.chains,
                  });
                  close();
                }}
              >
                <Text>
                  <Stack
                    textAlign="left"
                    gap={'sm'}
                    alignItems={'center'}
                    width="100%"
                  >
                    <AccountItem
                      account={account}
                      keyset={account.keyset.guard}
                    />
                  </Stack>
                </Text>
              </ButtonItem>
            ));

          const filteredContacts = contacts
            .filter((contact) => {
              return hasTerm({
                address: contact.account.address,
                alias: contact.name,
                keys: contact.account.keyset?.keys,
              });
            })
            .map((account) => (
              <ButtonItem
                onClick={() => {
                  onSelectHandel({
                    address: account.account.address,
                    alias: account.name,
                    overallBalance: '0',
                    chains: [],
                    keyset: { guard: account.account.keyset! },
                  });
                  close();
                }}
              >
                <Text>
                  <Stack
                    textAlign="left"
                    gap={'sm'}
                    alignItems={'center'}
                    width="100%"
                  >
                    <AccountItem
                      account={{
                        address: account.account.address,
                        alias: account.name,
                        overallBalance: 'N/A',
                      }}
                      keyset={account.account.keyset}
                    />
                  </Stack>
                </Text>
              </ButtonItem>
            ));

          const discoverdAccountsElement = discoverdAccount?.map((account) => (
            <ButtonItem
              onClick={() => {
                onSelectHandel(account);
                close();
              }}
            >
              <Text>
                <Stack
                  textAlign="left"
                  gap={'sm'}
                  alignItems={'center'}
                  width="100%"
                >
                  <AccountItem
                    account={account}
                    keyset={account.keyset.guard}
                    chains={account.chains}
                  />
                </Stack>
              </Text>
            </ButtonItem>
          ));

          const createNewAccount =
            !discovering && !discoverdAccountsElement?.length && value ? (
              <Stack
                className={createAccountBoxClass}
                marginBlockStart={'sm'}
                gap="sm"
                padding={'xs'}
                paddingInline={'md'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Stack alignItems={'center'} gap={'sm'}>
                  <MonoInfo />
                  <Text size="smallest" color="inherit">
                    Address{' '}
                    <Text color="inherit" bold size="smallest">
                      {shorten(search)}
                    </Text>{' '}
                    is not found on the blockchain
                  </Text>
                </Stack>

                <Button
                  variant="outlined"
                  isCompact
                  onClick={async (e) => {
                    e.preventDefault();
                    close();
                    const guard = (await prompt((resolve, reject) => (
                      <KeySetDialog close={reject} onDone={resolve} isOpen />
                    ))) as IKeySet['guard'];
                    if (guard) {
                      onSelectHandel({
                        address: value,
                        keyset: { guard },
                        chains: [],
                        overallBalance: '0.0',
                      });
                    }
                  }}
                >
                  Add account guard
                </Button>
              </Stack>
            ) : undefined;

          const sections = [
            {
              title: 'My Accounts',
              items: myAccount,
            },
            {
              title: 'Watched Accounts',
              items: filteredWatchedAccounts,
            },
            {
              title: 'Contacts',
              items: filteredContacts,
            },
            {
              title: 'Discovered From Blockchain',
              items: discovering
                ? [
                    <Text key="discovered" size="smallest">
                      <ListItem>{'Discovering...'}</ListItem>
                    </Text>,
                  ]
                : discoverdAccountsElement || [],
            },
            {
              title: 'Discovered From Blockchain',
              items: createNewAccount ? [createNewAccount] : [],
            },
          ]
            .filter(({ items: { length } }) => length > 0)
            .flatMap((section, i, list) => [
              <Stack key={section.title} flexDirection={'column'}>
                <Heading variant="h6">{section.title}</Heading>
                {section.items}
              </Stack>,
              i !== list.length - 1 && <Divider />,
            ]);

          return sections.length ? (
            <Stack
              flexDirection={'column'}
              padding={'sm'}
              className={popoverClass}
            >
              {sections}
            </Stack>
          ) : null;
        }}
      </ComboField>
      {!discovering && selectedAccount && (
        <Stack gap={'sm'} alignItems={'center'} paddingInlineStart={'sm'}>
          {selectedAccount?.alias ? (
            <Text size="smallest" bold color="emphasize">
              {selectedAccount.alias}
            </Text>
          ) : (
            ''
          )}
          <Keyset guard={selectedAccount.keyset.guard} />
        </Stack>
      )}
      {discovering && (
        <Stack padding={'xs'} paddingInlineStart={'md'}>
          <Text size="smallest">Discovering...</Text>
        </Stack>
      )}
    </Stack>
  );
}

const searchAccount =
  (search: string) =>
  ({
    address,
    alias,
    keysetAlias,
    keys = [],
  }: {
    address: string;
    alias?: string;
    keysetAlias?: string;
    keys?: string[];
  }) => {
    const term = search.toLowerCase().trim().replace(/\s+/g, '');

    if (
      [address, alias, keysetAlias, ...keys].find((value) =>
        value?.toLocaleLowerCase().replace(/\s+/g, '').includes(term),
      )
    ) {
      return true;
    }
    return false;
  };
