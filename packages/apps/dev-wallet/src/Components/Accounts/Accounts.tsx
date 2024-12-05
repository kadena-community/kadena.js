import { useRightAside } from '@/App/Layout/useRightAside';
import {
  accountRepository,
  IAccount,
  IWatchedAccount,
} from '@/modules/account/account.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { panelClass } from '@/pages/home/style.css';
import { IReceiverAccount } from '@/pages/transfer-v2/utils';
import {
  MonoAdd,
  MonoMoreVert,
  MonoRemoveRedEye,
} from '@kadena/kode-icons/system';
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
import { accountTypeClass, listClass, noStyleLinkClass } from './style.css';
import { WatchAccountsForm } from './WatchAccountForm';

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
  const [isWatchAccountExpanded, expandWatchAccount, closeWatchAccount] =
    useRightAside();
  const accountsToShow = show === 'owned' ? accounts : watchedAccounts;

  const onWatch = async (accounts: IReceiverAccount[]) => {
    const accountsToWatch: IWatchedAccount[] = accounts.map((account) => ({
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
    }));
    await Promise.all(
      accountsToWatch.map((account) =>
        accountRepository.addWatchedAccount(account),
      ),
    );
  };

  return (
    <Stack flexDirection={'column'}>
      <WatchAccountsForm
        onClose={closeWatchAccount}
        isOpen={isWatchAccountExpanded}
        onWatch={onWatch}
        contract={contract}
        networkId={activeNetwork!.networkId}
      />
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
          {contract &&
            (show === 'owned' ? (
              <Button
                startVisual={<MonoAdd />}
                variant="outlined"
                isCompact
                onClick={() => createNextAccount({ contract })}
              >
                Next Account
              </Button>
            ) : (
              <Button
                startVisual={<MonoRemoveRedEye />}
                variant="outlined"
                isCompact
                onClick={() => {
                  expandWatchAccount();
                }}
              >
                Watch Account
              </Button>
            ))}
          {show === 'owned' && (
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
                <ContextMenuItem label="+ Advanced Account" />
              </Link>
            </ContextMenu>
          )}
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
