import { useWallet } from '@/modules/wallet/wallet.hook';

import { fundAccount, syncAccount } from '@/modules/account/account.service';

import { AccountBalanceDistribution } from '@/Components/AccountBalanceDistribution/AccountBalanceDistribution';
import { ConfirmDeletion } from '@/Components/ConfirmDeletion/ConfirmDeletion';
import { FundOnTestnetButton } from '@/Components/FundOnTestnet/FundOnTestnet';
import { usePrompt } from '@/Components/PromptProvider/Prompt';
import { QRCode } from '@/Components/QRCode/QRCode';
import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { accountRepository } from '@/modules/account/account.repository';
import { isKeysetGuard } from '@/modules/account/guards';
import { getTransferActivities } from '@/modules/activity/activity.service';
import * as transactionService from '@/modules/transaction/transaction.service';
import { useAsync } from '@/utils/useAsync';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { ChainId } from '@kadena/client';
import {
  MonoCopyAll,
  MonoCreate,
  MonoKey,
  MonoOpenInNew,
  MonoRemoveRedEye,
  MonoWallet,
} from '@kadena/kode-icons/system';
import {
  Badge,
  Button,
  Heading,
  Stack,
  TabItem,
  Tabs,
  Text,
  TextLink,
  Link as UiLink,
} from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem, useLayout } from '@kadena/kode-ui/patterns';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getGuardInfo } from '../../Components/Guard/Guard';
import { linkClass, noStyleLinkClass, panelClass } from '../home/style.css';
import { ActivityTable } from './Components/ActivityTable';
import { AliasForm } from './Components/AliasForm';
import { Redistribute } from './Components/Redistribute';
import { addressBreakClass } from './style.css';

export function AccountPage() {
  const { accountId } = useParams();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const prompt = usePrompt();
  const {
    activeNetwork,
    fungibles,
    accounts,
    watchAccounts,
    client,
    isOwnedAccount,
    getKeyAlias,
  } = useWallet();
  const [redistributionGroupId, setRedistributionGroupId] = useState<string>();
  const account =
    accounts.find((account) => account.uuid === accountId) ??
    watchAccounts.find((account) => account.uuid === accountId);

  const navigate = usePatchedNavigate();

  useEffect(() => {
    if (account) {
      console.log('syncing account', account?.uuid);
      syncAccount(account);
    }
  }, [account?.uuid]);

  const accountGuard = account?.guard;
  const asset = fungibles.find((f) => f.contract === account?.contract);
  const [activities = []] = useAsync(getTransferActivities, [
    account?.profileId,
    accountGuard,
    activeNetwork?.uuid,
  ]);

  const chains = account?.chains;
  const chainsBalance = useMemo(
    () =>
      (chains ?? []).map(({ balance, chainId }) => ({
        chainId,
        balance: +balance,
      })),
    [chains],
  );
  if (!account || !accountGuard || !asset) {
    return <Navigate to="/" />;
  }

  const fundAccountHandler = async (chainId: ChainId) => {
    if (!isKeysetGuard(account.guard)) {
      throw new Error('No keyset found');
    }
    if (!activeNetwork) {
      throw new Error('No active network found');
    }
    const fundTx = await fundAccount({
      address: account?.address ?? account.guard.principal,
      chainId,
      guard: account.guard,
      profileId: account.profileId,
      network: activeNetwork,
    });

    transactionService
      .submitTransaction(fundTx, client)
      .then((tx) => {
        if (tx.result?.result.status === 'success') {
          syncAccount(account);
        }
      })
      .catch((e) => {
        console.error(e);
      });

    return fundTx;
  };
  const ownedAccount = isOwnedAccount(account);

  const guardInfo = getGuardInfo(accountGuard);

  const explorerLink =
    account.chains.length > 0
      ? `https://explorer.kadena.io/account/${account.address}?networkId=${activeNetwork?.networkId}`
      : '';

  return (
    <Stack flexDirection={'column'} gap={'lg'}>
      <SideBarBreadcrumbs icon={<MonoWallet />}>
        <SideBarBreadcrumbsItem href="/">Your Assets</SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href="/">
          {account.contract}
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href={`/account/${accountId}`}>
          {account.alias
            ? `${account.alias} (${account.address})`
            : account.address}
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
      <AliasForm show={isRightAsideExpanded} account={account} />
      <Stack flexDirection={'column'} gap={'sm'}>
        <Stack gap={'sm'} alignItems={'center'}>
          <Heading variant="h3">{account.alias}</Heading>
        </Stack>

        <Stack justifyContent={'space-between'}>
          <Heading variant="h5" className={addressBreakClass}>
            {account.address}
          </Heading>
        </Stack>

        <Stack flexDirection={'row'} gap="sm" alignItems={'center'}>
          <Heading variant="h3">
            {account.overallBalance} {asset.symbol}
          </Heading>
        </Stack>
        {!ownedAccount && (
          <Stack alignItems={'center'} gap={'sm'}>
            <MonoRemoveRedEye />
            <Heading variant="h6">Watched Account</Heading>
          </Stack>
        )}
      </Stack>
      <Stack gap="md" alignItems={'center'} flexWrap="wrap">
        <Link
          to={`/transfer?accountId=${account.uuid}`}
          className={noStyleLinkClass}
        >
          <Button
            isDisabled={+account.overallBalance === 0}
            onPress={(e: any) => {
              e.preventDefault();
            }}
          >
            Transfer
          </Button>
        </Link>
        {asset.contract === 'coin' && activeNetwork?.faucetContract && (
          <FundOnTestnetButton
            account={account}
            fundAccountHandler={fundAccountHandler}
          />
        )}
        {asset.contract === 'coin' && (
          <a
            className={linkClass}
            href="https://www.kadena.io/kda-token#:~:text=activities%2C%20and%20events.-,Where%20to%20Buy%20KDA,-Buy"
            target="_blank"
          >
            <Button variant="outlined" endVisual={<MonoOpenInNew />}>
              Buy KDA
            </Button>
          </a>
        )}

        <a
          className={linkClass}
          target="_blank"
          title={
            !account.chains.length
              ? 'This account has not been mined on-chain yet'
              : ''
          }
          href={explorerLink ? `${explorerLink}#Transfers` : ''}
        >
          <Button
            variant="outlined"
            endVisual={<MonoOpenInNew />}
            isDisabled={!account.chains.length}
          >
            Open in explorer
          </Button>
        </a>
        <Button
          variant="outlined"
          endVisual={<MonoCopyAll />}
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { principal, ...guard } = account.guard;
            if (account.address.startsWith('w:') && isKeysetGuard(guard)) {
              navigator.clipboard.writeText(
                `${account.address}:${guard.keys.join(':')}`,
              );
              return;
            }
            navigator.clipboard.writeText(account.address);
          }}
        >
          Copy Account
        </Button>
      </Stack>

      <Stack gap="md" alignItems={'center'} flexWrap="wrap"></Stack>
      <Tabs>
        <TabItem key="guard" title="Details">
          <Stack gap="lg" width="100%">
            <QRCode
              ecLevel="L"
              size={150}
              value={JSON.stringify({
                address: account.address,
                contract: account.contract,
                guard: account.guard,
              })}
            />
            <Stack
              flexWrap="wrap"
              flexDirection={'column'}
              paddingBlockStart={'sm'}
              gap={'lg'}
            >
              <Stack flexDirection={'column'} gap={'sm'}>
                <Text>Contract</Text>
                <Text
                  color="emphasize"
                  variant="code"
                  className={addressBreakClass}
                >
                  {account.contract}
                </Text>
              </Stack>
              <Stack
                flexDirection={'column'}
                gap={'sm'}
                className={addressBreakClass}
              >
                <Text>Address</Text>
                <Text color="emphasize" variant="code">
                  {account.address}
                </Text>
              </Stack>
              <Stack flexDirection={'column'} gap={'sm'}>
                <Text>GuardType</Text>
                <Text color="emphasize" variant="code">
                  {guardInfo.type}
                </Text>
              </Stack>

              <Stack flexDirection={'column'} gap={'sm'}>
                <Text>Guard Principal</Text>
                <Text color="emphasize" variant="code">
                  {account.guard.principal}
                </Text>
              </Stack>

              {isKeysetGuard(account.guard) && (
                <>
                  <Stack flexDirection={'column'} gap={'sm'}>
                    <Text>Predicate</Text>
                    <Text color="emphasize" variant="code">
                      {account.guard.pred}
                    </Text>
                  </Stack>
                  <Stack flexDirection={'column'} gap={'md'}>
                    <Text>Keys</Text>
                    {account.guard.keys.map((key) => (
                      <Stack key={key} gap="sm" flexDirection={'column'}>
                        <Stack key={key} gap="sm" alignItems={'center'}>
                          {isKeysetGuard(account.guard) &&
                            account.guard.keys.length > 1 && (
                              <Badge size="sm">
                                {getKeyAlias(key, account.contract)}
                              </Badge>
                            )}
                        </Stack>
                        <Stack gap="sm" alignItems={'center'}>
                          <Text>
                            <MonoKey />
                          </Text>
                          <Text
                            variant="code"
                            color="emphasize"
                            className={addressBreakClass}
                          >
                            {key}
                          </Text>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                </>
              )}
            </Stack>
          </Stack>
        </TabItem>
        <TabItem key={'chain-distribution'} title="Chain Distribution">
          <Stack gap={'sm'} flexWrap={'wrap'}>
            {!redistributionGroupId ? (
              <AccountBalanceDistribution
                chains={chainsBalance}
                overallBalance={account.overallBalance}
                fundAccount={fundAccountHandler}
                account={account}
                onRedistribution={(groupId) =>
                  setRedistributionGroupId(groupId)
                }
              />
            ) : (
              <Redistribute
                groupId={redistributionGroupId}
                onDone={() => {
                  setRedistributionGroupId(undefined);
                  syncAccount(account);
                }}
              />
            )}
          </Stack>
        </TabItem>
        <TabItem key="account-activity" title="Account Activity">
          {!activities.length && (
            <Stack flexDirection={'column'} gap={'sm'}>
              <Text color="emphasize">No activities yet</Text>
              <Text>The transfers from this account will be listed here</Text>
            </Stack>
          )}
          {activities.length > 0 && <ActivityTable activities={activities} />}
        </TabItem>
        <TabItem key="transfers" title="Transfers ↗">
          {explorerLink && (
            <>
              <WindowOpen link={`${explorerLink}#Transfers`} />
              View transfers on{' '}
              <TextLink
                href={`${explorerLink}#Transfers`}
                target="_blank"
                style={{ wordBreak: 'break-all' }}
              >
                {`${explorerLink}#Transfers`}
              </TextLink>
            </>
          )}
          {!explorerLink && <Text>No transfers yet</Text>}
        </TabItem>
        <TabItem key="settings" title="Settings">
          <Stack flexDirection={'column'} gap={'xxl'}>
            <Stack
              flexDirection={'column'}
              gap={'md'}
              className={panelClass}
              alignItems={'flex-start'}
            >
              <Heading variant="h4">Account Alias</Heading>
              <Text>
                You can set or change the alias for this account. This will help
                you to identify this account easily.
              </Text>
              <Button
                variant="outlined"
                startVisual={<MonoCreate />}
                onPress={() => {
                  setIsRightAsideExpanded(!isRightAsideExpanded);
                }}
              >
                Edit Alias
              </Button>
            </Stack>
            {ownedAccount && (
              <Stack
                flexDirection={'column'}
                gap={'md'}
                className={panelClass}
                alignItems={'flex-start'}
              >
                <Heading variant="h4">Migrate Account</Heading>
                <Text>
                  You can use account migration to transfer all balances to a
                  newly created account with a new keyset, even though the
                  keyset guard for this account cannot be changed.
                </Text>
                <UiLink
                  variant="outlined"
                  href={`/account/${accountId}/migrate`}
                  component={Link}
                >
                  Migrate
                </UiLink>
              </Stack>
            )}
            <Stack
              flexDirection={'column'}
              gap={'md'}
              className={panelClass}
              alignItems={'flex-start'}
            >
              <Heading variant="h4">Delete Account</Heading>
              <Text>
                You don't want to use this account anymore? You can delete it
                from your wallet. This will be deleted locally not from the
                blockchain.
              </Text>
              <Button
                variant="negative"
                onClick={async () => {
                  const confirm = await prompt((resolve) => {
                    return (
                      <ConfirmDeletion
                        onCancel={() => resolve(false)}
                        onDelete={() => resolve(true)}
                        title="Delete Account"
                        description=" Are you sure you want to delete this account? If you need to add it again you will need to use account creation process."
                      />
                    );
                  });
                  if (confirm) {
                    await accountRepository.deleteAccount(account.uuid);
                    navigate('/');
                  }
                }}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </TabItem>
      </Tabs>
    </Stack>
  );
}

const WindowOpen: React.FC<{ link: string }> = ({ link }) => {
  window.open(link, '_blank');
  return null;
};
