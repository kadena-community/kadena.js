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
import { IContact } from '@/modules/contact/contact.repository';
import { INetwork } from '@/modules/network/network.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { withRaceGuard } from '@/utils/promise-utils';
import { debounce } from '@/utils/session';
import { ISigner } from '@kadena/client';
import { MonoClose } from '@kadena/kode-icons/system';
import {
  Button,
  Divider,
  Heading,
  Notification,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { useCallback, useEffect, useState } from 'react';
import { labelClass } from '../Steps/style.css';
import { discoverReceiver, IReceiverAccount } from '../utils';
import { AccountItem } from './AccountItem';
import { Keyset } from './keyset';
import { popoverClass } from './style.css';

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
}: {
  accounts?: IAccount[];
  contacts?: IContact[];
  watchedAccounts?: IWatchedAccount[];
  network: INetwork;
  contract: string;
  onSelect: (account?: IReceiverAccount) => void;
  selectedAccount?: IReceiverAccount;
}) {
  const prompt = usePrompt();
  const [value, setValue] = useState<string>(selectedAccount?.address || '');
  const { getPublicKeyData } = useWallet();
  const [discovering, setDiscovering] = useState(false);
  const [discoverdAccount, setDiscoveredAccounts] =
    useState<IReceiverAccount[]>();

  useEffect(() => {
    if (selectedAccount) {
      setValue(selectedAccount.address);
    }
  }, [selectedAccount]);

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

  function onSelectHandel(account: IReceiverAccount) {
    setValue(account.address);
    onSelect(account);
  }

  return (
    <Stack flexDirection={'column'}>
      <ComboField
        aria-label="Receiver Address"
        placeholder="Select ot enter an address"
        startVisual={<Label>Address:</Label>}
        type="text"
        size="sm"
        clear={
          (value || selectedAccount) && (
            <Button
              variant="transparent"
              isCompact
              onClick={() => {
                setValue('');
                onSelect(undefined);
              }}
            >
              <Text size="smallest">
                <MonoClose />
              </Text>
            </Button>
          )
        }
        onChange={(e) => {
          const address = e.target.value;
          setValue(address);
          setDiscovering(true);
          discover(address, network.networkId, contract, mapKeys)
            .then((data) => {
              setDiscovering(false);
              setDiscoveredAccounts(data);
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
              <Stack marginBlockStart={'sm'}>
                <Notification role="alert" intent="warning">
                  <Stack gap="sm" flexDirection={'column'}>
                    <Text size="smallest">
                      This account is not found on the blockchain; Please check
                      the address again; You still can select
                    </Text>
                    <Text size="smallest">
                      the filtered items form the above addresses or add the
                      missing information
                    </Text>
                    <Stack>
                      <Button
                        variant="outlined"
                        isCompact
                        onClick={async (e) => {
                          e.preventDefault();
                          close();
                          const guard = (await prompt((resolve, reject) => (
                            <KeySetDialog
                              close={reject}
                              onDone={resolve}
                              isOpen
                            />
                          ))) as IKeySet['guard'];
                          if (guard) {
                            onSelect({
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
                  </Stack>
                </Notification>
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
      {selectedAccount && <Keyset guard={selectedAccount.keyset.guard} />}
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
