import { KeySetForm } from '@/Components/KeySetForm/KeySetForm';
import {
  accountRepository,
  IAccount,
  IGuard,
  IWatchedAccount,
} from '@/modules/account/account.repository';
import { hasSameGuard } from '@/modules/account/account.service';
import { IRetrievedAccount } from '@/modules/account/IRetrievedAccount';
import { UUID } from '@/modules/types';
import { useWallet } from '@/modules/wallet/wallet.hook';
import {
  failureClass,
  pendingClass,
  successClass,
} from '@/pages/transaction/components/style.css';
import { AccountItem } from '@/pages/transfer/Components/AccountItem';
import { discoverReceiver } from '@/pages/transfer/utils';
import {
  MonoBackHand,
  MonoCheck,
  MonoLoading,
  MonoStop,
  MonoWarning,
} from '@kadena/kode-icons/system';
import { Button, Heading, Notification, Stack, Text } from '@kadena/kode-ui';
import { useCallback, useEffect, useState } from 'react';
import { accountClass, needActionClass } from '../style.css';

const parseJSON = (json: string) => {
  try {
    return JSON.parse(json);
  } catch {
    return undefined;
  }
};

interface IImportedAccount {
  uuid: UUID;
  networkUUID: UUID | undefined;
  networkId: string;
  profileId: UUID;
  contract: string;
  alias: string;
  address: string;
  guard: IGuard | undefined;
  chains: IAccount['chains'] | undefined;
  overallBalance: string;
  watched: true;
  verify:
    | 'pending'
    | 'verified'
    | 'several-accounts'
    | 'not-keyset'
    | 'not-found'
    | 'different-guard'
    | 'saved'
    | 'error';
  discoveredResult?: IRetrievedAccount[];
}

export function ImportWatchedAccounts({
  content,
}: {
  content: {
    table: string;
    header: string[];
    data: string[][];
  };
}) {
  const { profile, activeNetwork, networks } = useWallet();
  const [importedAccounts, setImportedAccounts] =
    useState<IImportedAccount[]>();

  const profileId = profile?.uuid as UUID;
  const networkId = activeNetwork?.networkId as string;

  const importData = useCallback(
    async function importData() {
      if (!content || !networkId || !profileId) return;
      const { data } = content;

      const accounts: IImportedAccount[] = data
        .map((row) => {
          const [
            networkId,
            contract,
            alias,
            address,
            guard,
            chains,
            overallBalance,
          ] = row;

          return {
            uuid: crypto.randomUUID(),
            watched: true as const,
            networkUUID: networks.find((n) => n.networkId === networkId)?.uuid,
            networkId,
            profileId,
            contract,
            alias,
            address,
            guard: parseJSON(guard),
            chains: parseJSON(chains),
            overallBalance,
            verify: 'pending' as const,
          };
        })
        .filter((account) => account.address);

      setImportedAccounts(accounts);

      for (const [index, account] of accounts.entries()) {
        const chainData = await discoverReceiver(
          account.address,
          account.networkId,
          account.contract,
        );
        account.discoveredResult = chainData;
        console.log('chainData', chainData);
        if (!chainData.length) {
          account.verify = 'not-found';
        }
        if (chainData.length === 1) {
          if (
            !account.guard ||
            !Object.keys(account.guard).length ||
            hasSameGuard(account.guard, chainData[0].guard)
          ) {
            account.verify = 'verified';
            account.guard = chainData[0].guard;
            account.overallBalance = chainData[0].overallBalance;
            account.chains = chainData[0].chains;
          } else {
            account.verify = 'different-guard';
          }
        }
        if (chainData.length > 1) {
          const correct = chainData.find((chain) =>
            hasSameGuard(account.guard, chain.guard),
          );
          if (correct) {
            account.verify = 'verified';
            account.guard = correct.guard;
            account.overallBalance = correct.overallBalance;
            account.chains = correct.chains;
          } else {
            account.verify = 'several-accounts';
          }
        }

        setImportedAccounts((acc = []) => {
          const newAccounts = [...acc];
          newAccounts[index] = account;
          return newAccounts;
        });
      }
    },
    [content, networkId, networks, profileId],
  );

  useEffect(() => {
    importData();
  }, [importData]);

  if (!profileId || !networkId) {
    return (
      <Notification intent="negative" role="alert">
        Profile or network not found
      </Notification>
    );
  }

  const allVerified = importedAccounts?.every(
    (account) => account.verify === 'verified',
  );

  function saveImportedAccounts() {
    if (!importedAccounts) return;
    const accounts: IWatchedAccount[] = importedAccounts
      .map((acc) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { discoveredResult, verify, ...account } = acc;
        return account;
      })
      .filter((acc) => acc) as IWatchedAccount[];

    accounts.map((account, index) =>
      accountRepository
        .addWatchedAccount(account)
        .then(() => {
          console.log('saved', account);
          importedAccounts[index].verify = 'saved';
          setImportedAccounts((acc = []) => {
            const newAccounts = [...acc];
            newAccounts[index] = importedAccounts[index];
            return newAccounts;
          });
        })
        .catch(() => {
          console.log('error', account);
          importedAccounts[index].verify = 'error';
          setImportedAccounts((acc = []) => {
            const newAccounts = [...acc];
            newAccounts[index] = importedAccounts[index];
            return newAccounts;
          });
        }),
    );
  }

  return (
    <Stack flexDirection={'column'} gap={'md'} alignItems={'flex-start'}>
      {!importedAccounts && <Text>Loading...</Text>}
      {importedAccounts && (
        <Stack gap="md" flexDirection={'column'}>
          <Heading variant="h5">Accounts to Discover</Heading>
          {allVerified && (
            <Notification intent="positive" role="status">
              All accounts are verified you can now save them{' '}
            </Notification>
          )}
          {!allVerified && (
            <Text>
              Please wait till we verify the account with the blockchain
            </Text>
          )}

          <Stack gap={'sm'}>
            <Button isDisabled={!allVerified} onPress={saveImportedAccounts}>
              Save
            </Button>
          </Stack>

          <Stack gap="xs" flexDirection={'column'}>
            {importedAccounts.map((account, index) => (
              <Stack
                flexDirection={'column'}
                gap={'sm'}
                key={account.address}
                className={
                  account.verify === 'several-accounts' ||
                  account.verify === 'not-found'
                    ? needActionClass
                    : ''
                }
              >
                <Stack width="100%" gap={'sm'} alignItems={'center'}>
                  <Stack
                    flex={1}
                    className={accountClass}
                    paddingBlock={'xs'}
                    paddingInline={'md'}
                  >
                    <AccountItem account={account} guard={account.guard} />
                  </Stack>

                  <Stack
                    style={{
                      minWidth: '90px',
                    }}
                    alignItems={'center'}
                  >
                    <Text size="small">
                      {account.verify === 'pending' && (
                        <Stack
                          alignItems={'center'}
                          gap={'sm'}
                          className={pendingClass}
                        >
                          <MonoLoading /> Checking
                        </Stack>
                      )}
                      {account.verify === 'verified' && (
                        <Stack
                          alignItems={'center'}
                          gap={'sm'}
                          className={successClass}
                        >
                          <MonoCheck /> verified
                        </Stack>
                      )}
                      {account.verify === 'several-accounts' && (
                        <Stack
                          alignItems={'center'}
                          gap={'sm'}
                          className={pendingClass}
                        >
                          <MonoBackHand /> Warning
                        </Stack>
                      )}
                      {account.verify === 'not-found' && (
                        <Stack
                          alignItems={'center'}
                          gap={'sm'}
                          className={pendingClass}
                        >
                          <MonoWarning /> Not Found
                        </Stack>
                      )}
                      {account.verify === 'different-guard' && (
                        <Stack
                          alignItems={'center'}
                          gap={'sm'}
                          className={failureClass}
                        >
                          <MonoStop /> Different Guard
                        </Stack>
                      )}
                      {account.verify === 'saved' && (
                        <Stack
                          alignItems={'center'}
                          gap={'sm'}
                          className={successClass}
                        >
                          <MonoCheck /> Saved!
                        </Stack>
                      )}
                      {account.verify === 'error' && (
                        <Stack
                          alignItems={'center'}
                          gap={'sm'}
                          className={failureClass}
                        >
                          <MonoWarning /> Error (duplicate)
                        </Stack>
                      )}
                    </Text>
                  </Stack>
                </Stack>
                {account.verify === 'several-accounts' && (
                  <Stack gap="xs" flexDirection={'column'}>
                    <Text>
                      {account.discoveredResult?.length} accounts found with the
                      same address; select one of them.
                    </Text>
                    <Stack gap="xs" flexDirection={'column'}>
                      {account.discoveredResult?.map((acc) => (
                        <Stack key={acc.address} gap={'xs'}>
                          <Stack
                            flex={1}
                            className={accountClass}
                            paddingBlock={'xs'}
                            paddingInline={'md'}
                          >
                            <AccountItem account={acc} guard={acc.guard} />
                          </Stack>
                          <Stack style={{ minWidth: '90px' }}>
                            <Button
                              isCompact
                              variant="outlined"
                              onClick={() => {
                                account.guard = acc.guard;
                                account.overallBalance = acc.overallBalance;
                                account.chains = acc.chains;
                                account.verify = 'verified';
                                account.discoveredResult = [acc];
                                setImportedAccounts((accounts = []) => {
                                  const newAccounts = [...accounts];
                                  newAccounts[index] = account;
                                  return newAccounts;
                                });
                              }}
                            >
                              Select
                            </Button>
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                )}
                {account.verify === 'not-found' && (
                  <Stack gap="xs" flexDirection={'column'}>
                    <Text>
                      No account found with the address; please check the
                      address and try again.
                    </Text>
                    <Text>You can manually enter the guard and</Text>
                    <KeySetForm
                      isOpen
                      close={() => {}}
                      variant="inline"
                      onChange={(keyset) => {
                        account.guard = keyset;
                        account.verify = 'verified';
                        setImportedAccounts((accounts = []) => {
                          const newAccounts = [...accounts];
                          newAccounts[index] = account;
                          return newAccounts;
                        });
                      }}
                    />
                  </Stack>
                )}
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
