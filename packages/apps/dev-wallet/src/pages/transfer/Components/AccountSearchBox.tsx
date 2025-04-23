import { ButtonItem } from '@/Components/ButtonItem/ButtonItem';
import { ComboField } from '@/Components/ComboField/ComboField';
import { KeySetForm } from '@/Components/KeySetForm/KeySetForm';
import { ListItem } from '@/Components/ListItem/ListItem';
import { usePrompt } from '@/Components/PromptProvider/Prompt';
import {
  IGuard,
  IOwnedAccount,
  IWatchedAccount,
} from '@/modules/account/account.repository';
import { hasSameGuard } from '@/modules/account/account.service';
import { isKeysetGuard } from '@/modules/account/guards';
import { IContact } from '@/modules/contact/contact.repository';
import { INetwork } from '@/modules/network/network.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { withRaceGuard } from '@/utils/promise-utils';
import { debounce } from '@/utils/session';
import { MonoClose, MonoInfo } from '@kadena/kode-icons/system';
import { Button, Divider, Heading, Stack, Text } from '@kadena/kode-ui';
import { PactNumber } from '@kadena/pactjs';
import { useEffect, useRef, useState } from 'react';
import { IRetrievedAccount } from '../../../modules/account/IRetrievedAccount';
import { discoverReceiver } from '../utils';
import { AccountItem } from './AccountItem';
import { DiscoveredAccount } from './DiscoveredAccount/DiscoveredAccount';
import { createAccountBoxClass, popoverClass } from './style.css';

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
  isSenderAccount,
  errorMessage,
  isInvalid,
  hideKeySelector,
  label,
}: {
  accounts?: IOwnedAccount[];
  contacts?: IContact[];
  watchedAccounts?: IWatchedAccount[];
  network: INetwork;
  contract: string;
  onSelect: (account?: IRetrievedAccount) => void;
  selectedAccount?: IRetrievedAccount;
  onDiscoveryChange?: (discovering: boolean) => void;
  isSenderAccount?: boolean;
  errorMessage?: string;
  isInvalid?: boolean;
  hideKeySelector?: boolean;
  label: string;
}) {
  const prompt = usePrompt();
  const [showDisabled, setShowDisabled] = useState(false);
  const [value, setValue] = useState<string>(selectedAccount?.address || '');
  const [discovering, setDiscoveringValue] = useState(false);
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);
  const liveIsOpen = useRef(popoverIsOpen);
  liveIsOpen.current = popoverIsOpen;
  const [discoverdAccount, setDiscoveredAccounts] =
    useState<IRetrievedAccount[]>();

  const { fungibles } = useWallet();
  const asset = fungibles.find((f) => f.contract === contract);

  useEffect(() => {
    setValue(selectedAccount?.address ?? '');
    if (!selectedAccount) {
      setDiscoveredAccounts([]);
    }
  }, [selectedAccount]);

  function setDiscovering(value: boolean) {
    setDiscoveringValue(value);
    if (onDiscoveryChange) {
      onDiscoveryChange(value);
    }
  }

  const isDisabledAccount = (account?: IRetrievedAccount) => {
    if (isSenderAccount && account) {
      if (!isKeysetGuard(account?.guard)) {
        return true;
      }
      if (
        !account?.overallBalance ||
        new PactNumber(account.overallBalance).lte(0)
      ) {
        return true;
      }
    }
    return false;
  };

  function onSelectHandle(account?: IRetrievedAccount) {
    if (isDisabledAccount(account)) return;

    onSelect(account);
    if (account) {
      setValue(account.address);
      if (
        !discoverdAccount?.find((acc) => hasSameGuard(acc.guard, account.guard))
      ) {
        const address = account.address;

        setDiscoveredAccounts([]);
        discover(address, network.networkId, contract)
          .then((discovered) => {
            setDiscoveredAccounts(discovered);
          })
          .catch(() => {
            setDiscoveredAccounts([]);
          });
      }
    }
  }

  function getFilteredAccounts(
    search: string,
    extra: IRetrievedAccount[] = [],
  ) {
    // if (discovering) return [];
    const hasTerm = searchAccount(search);
    const myAccounts = accounts
      .filter((account) =>
        searchAccount(search)(
          account.address,
          account.alias,
          account.guard.principal,
          ...(isKeysetGuard(account.guard) ? account.guard.keys : []),
        ),
      )
      .map((account) => ({
        address: account.address,
        alias: account.alias,
        overallBalance: account.overallBalance,
        guard: account.guard,
        chains: account.chains,
      }));

    const filteredWatchedAccounts = watchedAccounts
      .filter((account) =>
        hasTerm(
          account.address,
          account.alias,
          ...(isKeysetGuard(account.guard) ? account.guard.keys : []),
        ),
      )
      .map((account) => ({
        address: account.address,
        alias: account.alias,
        overallBalance: account.overallBalance,
        guard: account.guard,
        chains: account.chains,
      }));

    const filteredContacts = contacts
      .filter((contact) => {
        return hasTerm(
          contact.account.address,
          contact.name,
          contact.account.guard.principal,
          ...(isKeysetGuard(contact.account.guard)
            ? contact.account.guard.keys
            : []),
        );
      })
      .map((account) => ({
        address: account.account.address,
        alias: account.name,
        overallBalance: '0',
        chains: [],
        guard: account.account.guard,
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
            hasSameGuard(account.guard, t.guard),
        ) === index,
    );

    console.log('uniqueAccounts', uniqueAccounts);

    return uniqueAccounts;
  }

  function checkAccount(
    search: string,
    accounts: IRetrievedAccount[] = getFilteredAccounts(search),
  ) {
    if (accounts.length === 1) {
      const account = accounts[0];
      onSelectHandle(account);
    }
    if (accounts.length === 0) {
      onSelectHandle(undefined);
    }
    if (accounts.length > 1 && selectedAccount) {
      const result = accounts.find((account) => {
        selectedAccount.address === account.address &&
          hasSameGuard(selectedAccount.guard, account.guard);
      });
      if (!result) {
        onSelectHandle(undefined);
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
        fontType="code"
        label={label}
        aria-label={label}
        placeholder="Select or Enter an address"
        description={getDescription()}
        type="text"
        size="md"
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        info={selectedAccount?.alias ? `Alias: ${selectedAccount.alias}` : ''}
        onOpen={() => {
          setPopoverIsOpen(true);
        }}
        clear={
          (value || selectedAccount) && (
            <Button
              variant="transparent"
              // isCompact
              onClick={() => {
                setValue('');
                onSelectHandle(undefined);
              }}
            >
              <Text size="base">
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
          discover(address, network.networkId, contract)
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
              hasTerm(
                account.address,
                account.alias,
                account.guard.principal,
                ...(isKeysetGuard(account.guard) ? account.guard.keys : []),
              ),
            )
            .filter((account) => showDisabled || !isDisabledAccount(account))
            .map((account) => (
              <ButtonItem
                key={account?.address}
                disabled={isDisabledAccount(account)}
                onClick={() => {
                  onSelectHandle({
                    address: account.address,
                    alias: account.alias,
                    overallBalance: account.overallBalance,
                    guard: account.guard,
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
                    <AccountItem account={account} guard={account.guard} />
                  </Stack>
                </Text>
              </ButtonItem>
            ));

          const filteredWatchedAccounts = watchedAccounts
            .filter((account) =>
              hasTerm(
                account.address,
                account.alias,
                account.guard.principal,
                ...(isKeysetGuard(account.guard) ? account.guard.keys : []),
              ),
            )
            .filter((account) => showDisabled || !isDisabledAccount(account))
            .map((account) => (
              <ButtonItem
                key={account?.address}
                disabled={isDisabledAccount(account)}
                onClick={() => {
                  onSelectHandle({
                    address: account.address,
                    alias: account.alias,
                    overallBalance: account.overallBalance,
                    guard: account.guard,
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
                    <AccountItem account={account} guard={account.guard} />
                  </Stack>
                </Text>
              </ButtonItem>
            ));

          const filteredContacts = contacts
            .filter((contact) => {
              return hasTerm(
                contact.account.address,
                contact.name,
                contact.account.guard.principal,
                ...(isKeysetGuard(contact.account.guard)
                  ? contact.account.guard.keys
                  : []),
              );
            })
            .filter(() => showDisabled || !isSenderAccount)
            .map((account) => (
              <ButtonItem
                key={account?.account?.address}
                disabled={isSenderAccount}
                onClick={() => {
                  onSelectHandle({
                    address: account.account.address,
                    alias: account.name,
                    overallBalance: '0',
                    chains: [],
                    guard: account.account.guard!,
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
                      guard={account.account.guard}
                    />
                  </Stack>
                </Text>
              </ButtonItem>
            ));

          const discoverdAccountsElement = discoverdAccount?.map((account) => (
            <ButtonItem
              key={account?.address}
              onClick={() => {
                onSelectHandle(account);
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
                    guard={account.guard}
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
                  isDisabled={isSenderAccount}
                  variant="outlined"
                  isCompact
                  onClick={async (e) => {
                    e.preventDefault();
                    close();
                    const guard = (await prompt((resolve, reject) => (
                      <KeySetForm close={reject} onChange={resolve} isOpen />
                    ))) as IGuard;
                    if (guard) {
                      onSelectHandle({
                        address: value,
                        guard: guard,
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
              title: 'Discovered',
              items: discovering
                ? [
                    <Text key="discovered" size="smallest">
                      <ListItem>{'Discovering...'}</ListItem>
                    </Text>,
                  ]
                : discoverdAccountsElement || [],
            },
            {
              title: 'Discovered',
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
              gap={'md'}
            >
              <Stack
                gap={'md'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Heading variant="h6">Select one account</Heading>
                {isSenderAccount && (
                  <Button
                    onClick={() => setShowDisabled((v) => !v)}
                    variant="transparent"
                    // isCompact
                  >
                    {showDisabled ? 'hide disabled' : 'show disabled'}
                  </Button>
                )}
              </Stack>
              {sections}
            </Stack>
          ) : null;
        }}
      </ComboField>
      {!discovering && selectedAccount && (
        <Stack width="100%" marginBlockStart="sm">
          <DiscoveredAccount
            account={selectedAccount}
            hideKeySelector={hideKeySelector}
            asset={asset}
            contract={contract}
            onSelectHandle={onSelectHandle}
          />
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
  (...items: Array<string | undefined>) => {
    const term = search.toLowerCase().trim().replace(/\s+/g, '');
    if (
      items.find((value) =>
        value?.toLocaleLowerCase().replace(/\s+/g, '').includes(term),
      )
    ) {
      return true;
    }
    return false;
  };
