import { useRightAside } from '@/App/Layout/useRightAside';
import {
  accountRepository,
  IOwnedAccount,
  IWatchedAccount,
} from '@/modules/account/account.repository';
import { IRetrievedAccount } from '@/modules/account/IRetrievedAccount';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { MonoMoreVert } from '@kadena/kode-icons/system';
import {
  Button,
  ButtonGroup,
  ContextMenu,
  ContextMenuItem,
  Notification,
  NotificationHeading,
} from '@kadena/kode-ui';
import {
  SectionCard,
  SectionCardBody,
  SectionCardContentBlock,
  SectionCardHeader,
} from '@kadena/kode-ui/patterns';
import { AccountItem } from '../AccountItem/AccountItem';
import { MultiSigForm } from './MultiSigForm';
import { listClass } from './style.css';
import { WatchAccountsForm } from './WatchAccountForm';

export function Accounts({
  accounts,
  contract = 'coin',
  label,
  show,
}: {
  accounts: Array<IOwnedAccount | IWatchedAccount>;
  contract: string;
  label: string;
  show: 'owned' | 'watched';
}) {
  const { createNextAccount, activeNetwork, profile } = useWallet();
  const [isWatchAccountExpanded, expandWatchAccount, closeWatchAccount] =
    useRightAside();
  const [isMultiSigExpanded, expandMultiSig, closeMultiSig] = useRightAside();
  const accountsToShow = accounts; // show === 'owned' ? accounts : watchedAccounts;

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
    <>
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

      <SectionCard stack="vertical">
        <SectionCardContentBlock>
          <SectionCardHeader
            title={label}
            description={<></>}
            actions={
              show === 'owned' ? (
                <ButtonGroup>
                  <Button
                    isCompact
                    variant="outlined"
                    onClick={() => createNextAccount({ contract })}
                  >
                    New Account
                  </Button>
                  <ContextMenu
                    placement="bottom end"
                    trigger={
                      <Button
                        endVisual={<MonoMoreVert />}
                        variant="outlined"
                        isCompact
                      ></Button>
                    }
                  >
                    <ContextMenuItem
                      label="Create Account"
                      onClick={() => createNextAccount({ contract })}
                    />

                    <ContextMenuItem
                      label="create Multi-Sig"
                      onClick={() => expandMultiSig()}
                    />
                  </ContextMenu>
                </ButtonGroup>
              ) : (
                <Button
                  isCompact
                  variant="outlined"
                  onPress={() => expandWatchAccount()}
                >
                  Add account
                </Button>
              )
            }
          />
          {
            accountsToShow.length ? (
              <SectionCardBody>
                <ul className={listClass} data-testid="assetList">
                  {accountsToShow.map((account) => (
                    <li key={account.uuid} data-account={account.address}>
                      <AccountItem account={account} profile={profile} />
                    </li>
                  ))}
                </ul>
              </SectionCardBody>
            ) : (<SectionCardBody>
              <Notification
                intent='info'
                isDismissable={false}
                role='alert'
                type='inlineStacked'
              >
                <NotificationHeading>
                  {show === 'owned'
                    ? 'No accounts created yet!'
                    : 'No accounts watched yet'}
                </NotificationHeading>
              </Notification>
            </SectionCardBody>)
          }
        </SectionCardContentBlock>
      </SectionCard>
    </>
  );
}
