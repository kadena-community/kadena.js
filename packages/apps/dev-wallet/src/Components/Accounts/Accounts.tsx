import {
  accountRepository,
  IAccount,
  IWatchedAccount,
} from '@/modules/account/account.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { panelClass } from '@/pages/home/style.css';
import { IReceiverAccount } from '@/pages/transfer/utils';
import { MonoMoreVert } from '@kadena/kode-icons/system';
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  Heading,
  Stack,
  Text,
} from '@kadena/kode-ui';
import classNames from 'classnames';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AccountItem } from '../AccountItem/AccountItem';
import { usePrompt } from '../PromptProvider/Prompt';
import { accountTypeClass, listClass, noStyleLinkClass } from './style.css';
import { WatchAccountsDialog } from './WatchAccountDialog';

export function Accounts({
  accounts,
  contract = 'coin',
  watchedAccounts,
}: {
  accounts: Array<IAccount>;
  watchedAccounts: Array<IWatchedAccount>;
  contract: string;
}) {
  const [show, setShow] = useState<'owned' | 'watched'>('owned');
  const { createNextAccount, activeNetwork, profile } = useWallet();
  const prompt = usePrompt();
  const accountsToShow = show === 'owned' ? accounts : watchedAccounts;
  return (
    <Stack flexDirection={'column'}>
      <Stack justifyContent={'space-between'}>
        <Stack gap={'sm'}>
          <Stack
            className={classNames(
              accountTypeClass,
              show === 'owned' && 'selected',
            )}
            alignItems={'center'}
            onClick={() => setShow('owned')}
          >
            <Heading as="h6">Owned({accounts.length})</Heading>
          </Stack>
          <Stack
            onClick={() => setShow('watched')}
            className={classNames(
              accountTypeClass,
              show === 'watched' && 'selected',
            )}
            padding={'sm'}
            alignItems={'center'}
          >
            <Heading as="h6">Watched({watchedAccounts.length})</Heading>
          </Stack>
        </Stack>
        <Stack gap={'sm'}>
          {contract && (
            <Button
              variant="outlined"
              isCompact
              onClick={() => createNextAccount({ contract })}
            >
              Create Next Account
            </Button>
          )}
          <ContextMenu
            placement="bottom end"
            trigger={
              <Button
                endVisual={<MonoMoreVert />}
                variant="transparent"
                isCompact
              />
            }
          >
            <Link
              to={
                contract
                  ? `/create-account${contract ? `?contract=${contract}` : ''}`
                  : '/create-account'
              }
              className={noStyleLinkClass}
            >
              <ContextMenuItem label="Add Multisig/Advanced" />
            </Link>
            <ContextMenuItem
              label="Watch Account"
              onClick={async () => {
                const accounts = (await prompt((resolve, reject) => (
                  <WatchAccountsDialog
                    onWatch={resolve}
                    onClose={reject}
                    contract={contract}
                    networkId={activeNetwork!.networkId}
                  />
                ))) as IReceiverAccount[];
                const accountsToWatch: IWatchedAccount[] = accounts.map(
                  (account) => ({
                    uuid: crypto.randomUUID(),
                    alias: account.alias ?? '',
                    profileId: profile!.uuid,
                    address: account.address,
                    chains: account.chains,
                    overallBalance: account.overallBalance,
                    keyset: {
                      ...account.keyset,
                      guard: {
                        ...account.keyset.guard,
                        keys: account.keyset.guard.keys.map((key) =>
                          typeof key === 'string' ? key : key.pubKey,
                        ),
                      },
                    },
                    contract,
                    networkUUID: activeNetwork!.uuid,
                    watched: true,
                  }),
                );
                await Promise.all(
                  accountsToWatch.map((account) =>
                    accountRepository.addWatchedAccount(account),
                  ),
                );
              }}
            />
          </ContextMenu>
        </Stack>
      </Stack>
      {accountsToShow.length ? (
        <ul className={listClass}>
          {accountsToShow.map((account) => (
            <li key={account.uuid}>
              <AccountItem account={account} />
            </li>
          ))}
        </ul>
      ) : (
        <Stack
          padding={'sm'}
          marginBlockStart="md"
          className={classNames(panelClass)}
        >
          <Text>
            {show === 'owned'
              ? 'No accounts created yet!'
              : 'No Accounts watched yet'}
          </Text>
        </Stack>
      )}
    </Stack>
  );
}
