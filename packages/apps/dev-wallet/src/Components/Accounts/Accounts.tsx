import { useRightAside } from '@/App/Layout/useRightAside';
import {
  accountRepository,
  IOwnedAccount,
  IWatchedAccount,
} from '@/modules/account/account.repository';
import { IRetrievedAccount } from '@/modules/account/IRetrievedAccount';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { panelClass } from '@/pages/home/style.css';
import { MonoAdd, MonoMoreVert } from '@kadena/kode-icons/system';
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
import { AccountItem } from '../AccountItem/AccountItem';
import { MultiSigForm } from './MultiSigForm';
import { accountTypeClass, listClass } from './style.css';
import { WatchAccountsForm } from './WatchAccountForm';

export function Accounts({
  accounts,
  contract = 'coin',
  watchedAccounts,
}: {
  accounts: Array<IOwnedAccount>;
  watchedAccounts: Array<IWatchedAccount>;
  contract: string;
}) {
  const [show, setShow] = useState<'owned' | 'watched'>('owned');
  const { createNextAccount, activeNetwork, profile } = useWallet();
  const [isWatchAccountExpanded, expandWatchAccount, closeWatchAccount] =
    useRightAside();
  const [isMultiSigExpanded, expandMultiSig, closeMultiSig] = useRightAside();
  const accountsToShow = show === 'owned' ? accounts : watchedAccounts;

  const onWatch = async (accounts: IRetrievedAccount[]) => {
    const accountsToWatch: IWatchedAccount[] = accounts.map((account) => ({
      uuid: crypto.randomUUID(),
      alias: account.alias ?? '',
      profileId: profile!.uuid,
      address: account.address,
      chains: account.chains,
      overallBalance: account.overallBalance,
      guard: account.guard,
      contract,
      networkUUID: activeNetwork!.uuid,
    }));
    await Promise.all(
      accountsToWatch.map((account) => accountRepository.addAccount(account)),
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
      <MultiSigForm
        isOpen={isMultiSigExpanded}
        onClose={closeMultiSig}
        contract={contract}
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
          <ContextMenu
            placement="bottom end"
            trigger={
              <Button
                startVisual={<MonoAdd />}
                endVisual={<MonoMoreVert />}
                variant="outlined"
                isCompact
              >
                Account
              </Button>
            }
          >
            <ContextMenuItem
              label="Create Account"
              onClick={() => createNextAccount({ contract })}
            />
            <ContextMenuItem
              label="Watch/Add existing"
              onClick={() => expandWatchAccount()}
            />
            <ContextMenuItem
              label="create Multi-Sig"
              onClick={() => expandMultiSig()}
            />
          </ContextMenu>
        </Stack>
      </Stack>
      {accountsToShow.length ? (
        <ul className={listClass} data-testid="assetList">
          {accountsToShow.map((account) => (
            <li key={account.uuid}>
              <AccountItem account={account} />
            </li>
          ))}
        </ul>
      ) : (
        <Stack
          data-testid="assetList"
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
