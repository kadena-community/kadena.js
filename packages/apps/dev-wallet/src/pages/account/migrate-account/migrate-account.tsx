import { IOwnedAccount } from '@/modules/account/account.repository.ts';
import { useWallet } from '@/modules/wallet/wallet.hook';

import {
  Button,
  Card,
  Heading,
  Notification,
  Stack,
  Text,
} from '@kadena/kode-ui';

import { Chain } from '@/Components/Badge/Badge';
import {
  createMigrateAccountTransactions,
  hasSameGuard,
} from '@/modules/account/account.service';
import { isKeysetGuard } from '@/modules/account/guards';
import { IRetrievedAccount } from '@/modules/account/IRetrievedAccount';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { panelClass } from '@/pages/home/style.css';
import { TxList } from '@/pages/transaction/components/TxList';
import { AccountSearchBox } from '@/pages/transfer/Components/AccountSearchBox';
import { formatList, shorten } from '@/utils/helpers';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Label } from '../../transaction/components/helpers';

export function MigrateAccount() {
  const { accountId } = useParams();
  const [sourceAccount, setSourceAccount] = useState<IOwnedAccount | null>(
    null,
  );
  const [targetAccount, setTargetAccount] = useState<IRetrievedAccount | null>(
    null,
  );
  const {
    profile,
    activeNetwork,
    contacts,
    accounts,
    watchAccounts,
    getPublicKeyData,
  } = useWallet();
  const [loading, setLoading] = useState(false);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [txs, setTxs] = useState<ITransaction[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (accountId) {
      const account = accounts.find((a) => a.uuid === accountId);
      if (account && !sourceAccount) {
        setSourceAccount(account);
      }
    }
  }, [accountId, accounts, sourceAccount]);

  const migrateTo = async (target: IRetrievedAccount) => {
    if (!profile) {
      throw new Error('Profile not found');
    }
    if (sourceAccount && target) {
      // transfer all funds from source
      const keysToSignWith = sourceAccount.guard.keys
        .map((k) => getPublicKeyData(k)?.publicKey)
        .filter(Boolean) as string[];
      const groupId = await createMigrateAccountTransactions(
        sourceAccount,
        target,
        keysToSignWith,
      );
      setTxs(
        await transactionRepository.getTransactionsByGroup(
          groupId,
          profile.uuid,
        ),
      );
      setGroupId(groupId);
    }
  };

  if (!sourceAccount) {
    return null;
  }

  return (
    <Stack gap={'lg'} flexDirection={'column'} marginBlockEnd={'md'}>
      {!groupId && (
        <Stack
          style={{ maxWidth: '670px', width: '100%' }}
          flexDirection={'column'}
          gap={'lg'}
        >
          <Card fullWidth>
            <Stack flexDirection={'column'} gap={'xxl'}>
              <Heading variant="h3">Migrate Account</Heading>

              <Stack flexDirection={'column'} gap={'sm'} className={panelClass}>
                <Label bold>Source Account:</Label>
                {sourceAccount.alias && <Text>{sourceAccount.alias}</Text>}
                <Text variant="code">{shorten(sourceAccount.address, 26)}</Text>
                <Text variant="code">{sourceAccount.overallBalance}</Text>
                <Chain
                  chainId={formatList(
                    sourceAccount.chains.map((c) => +c.chainId),
                  )}
                />
              </Stack>

              <AccountSearchBox
                accounts={accounts}
                watchedAccounts={watchAccounts}
                contacts={contacts}
                contract={sourceAccount.contract}
                network={activeNetwork!}
                onSelect={(account) => {
                  setTargetAccount(account ?? null);
                }}
              />
            </Stack>
            {targetAccount && !isKeysetGuard(targetAccount.guard) && (
              <Notification intent="negative" role="alert">
                Only keyset accounts are supported
              </Notification>
            )}

            {targetAccount &&
              hasSameGuard(sourceAccount.guard, targetAccount.guard) &&
              sourceAccount.address === targetAccount.address && (
                <Notification intent="negative" role="alert">
                  You need to select a different account
                </Notification>
              )}
          </Card>
          <Stack gap="sm">
            <Button variant="transparent" isDisabled={loading}>
              Cancel
            </Button>
            <Button
              isDisabled={
                !targetAccount ||
                !isKeysetGuard(targetAccount.guard) ||
                (hasSameGuard(sourceAccount.guard, targetAccount.guard) &&
                  sourceAccount.address === targetAccount.address)
              }
              isLoading={loading}
              onClick={async () => {
                if (targetAccount) {
                  setLoading(true);
                  await migrateTo(targetAccount);
                }
              }}
            >
              Migrate account
            </Button>
          </Stack>
        </Stack>
      )}
      {groupId && (
        <Stack flexDirection={'column'} gap={'lg'} overflow="auto">
          {done && (
            <Notification intent="positive" role="alert">
              All done!
            </Notification>
          )}
          <Stack flexDirection={'column'} gap={'sm'}>
            <Heading>Transactions</Heading>
            {txs.length === 0 && <Text>No transactions</Text>}
            {txs.length >= 2 && (
              <Text>This is a group of {txs.length} Transactions</Text>
            )}
          </Stack>
          <TxList
            onDone={() => {
              setLoading(false);
              if (!targetAccount) {
                throw new Error('Target account not found');
              }
              setDone(true);
            }}
            txIds={txs.map((tx) => tx.uuid)}
            showExpanded={txs.length === 1}
          />
        </Stack>
      )}
    </Stack>
  );
}
