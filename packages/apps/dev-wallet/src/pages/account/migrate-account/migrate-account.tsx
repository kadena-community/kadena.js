import {
  accountRepository,
  IAccount,
  IKeysetGuard,
} from '@/modules/account/account.repository.ts';

import { useWallet } from '@/modules/wallet/wallet.hook';

import { KeySetForm } from '@/Components/KeySetForm/KeySetForm.tsx';

import { Button, Card, Heading, Stack, Text, TextField } from '@kadena/kode-ui';

import { Chain } from '@/Components/Badge/Badge';
import {
  createMigrateAccountTransactions,
  hasSameGuard,
} from '@/modules/account/account.service';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { panelClass } from '@/pages/home/style.css';
import { TxList } from '@/pages/transaction/components/TxList';
import { formatList, shorten } from '@/utils/helpers';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Label } from '../../transaction/components/helpers';

export function MigrateAccount() {
  const { accountId } = useParams();
  const [sourceAccount, setSourceAccount] = useState<IAccount | null>(null);
  const [targetAccount, setTargetAccount] = useState<IAccount | null>(null);
  const [keysetGuard, setKeysetGuard] = useState<IKeysetGuard>();
  const [alias, setAlias] = useState<string | null>(null);
  const {
    profile,
    activeNetwork,
    fungibles,
    keysets,
    accounts,
    getPublicKeyData,
  } = useWallet();
  const [loading, setLoading] = useState(false);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [txs, setTxs] = useState<ITransaction[]>([]);
  const navigate = usePatchedNavigate();
  const contract = sourceAccount?.contract;

  useEffect(() => {
    if (accountId) {
      const account = accounts.find((a) => a.uuid === accountId);
      if (account && !sourceAccount) {
        setSourceAccount(account);
        setKeysetGuard(account.guard);
        setAlias(account.alias ? `Migrated ${account.alias}` : '');
      }
    }
  }, [accountId, accounts, sourceAccount]);

  const filteredAccounts = accounts.filter(
    (account) => account.contract === contract,
  );

  const symbol =
    fungibles.find((f) => f.contract === contract)?.symbol ?? contract;

  const aliasDefaultValue = contract
    ? `${contract === 'coin' ? '' : `${symbol} `}Account ${filteredAccounts.length + 1}`
    : '';

  const createAccountByKeyset = async (keyset: IKeysetGuard) => {
    if (!profile || !activeNetwork || !contract) {
      throw new Error('Profile or active network not found');
    }
    const account: IAccount = {
      uuid: crypto.randomUUID(),
      alias: alias || aliasDefaultValue,
      profileId: profile.uuid,
      address: keyset.principal,
      guard: keyset,
      networkUUID: activeNetwork.uuid,
      contract,
      chains: [],
      overallBalance: '0',
    };

    await accountRepository.addAccount(account);
    setTargetAccount(account);
    return account;
  };

  const migrateTo = async (target: IAccount) => {
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

  const filteredKeysets = keysets
    .filter((keyset) => keyset.guard.keys.length >= 2)
    .map((keyset) => ({
      ...keyset,
      used: Boolean(
        filteredAccounts.find((account) => account.keysetId === keyset.uuid),
      ),
    }))
    .sort((a) => (a.used ? 1 : -1));

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

              <Stack flexDirection={'column'} gap={'sm'}>
                <Heading variant="h4">Create Target Account</Heading>
                <Text>
                  You can modify the guard and create a new account to transfer
                  all {symbol} to that
                </Text>
              </Stack>
              <Stack flexDirection={'column'} gap={'xxl'}>
                <TextField
                  label="Alias"
                  defaultValue={aliasDefaultValue}
                  value={alias || aliasDefaultValue}
                  onChange={(e) => setAlias(e.target.value)}
                />

                <KeySetForm
                  isOpen
                  close={() => {}}
                  variant="inline"
                  keyset={keysetGuard}
                  onChange={(data) => {
                    if (!data) {
                      setKeysetGuard(undefined);
                      return;
                    }
                    const { alias: keysetAlias, ...keyset } = data;
                    setKeysetGuard(keyset);
                    if (keysetAlias && !alias) {
                      setAlias(keysetAlias);
                    }
                  }}
                  filteredKeysets={filteredKeysets}
                  LiveForm
                />
              </Stack>
              {keysetGuard && (
                <Stack gap={'sm'} flexDirection={'column'}>
                  <Label bold>Address:</Label>
                  <Text variant="code">
                    {shorten(keysetGuard.principal, 26)}
                  </Text>
                </Stack>
              )}
            </Stack>
          </Card>
          <Stack gap="sm">
            <Button variant="transparent" isDisabled={loading}>
              Cancel
            </Button>
            <Button
              isDisabled={
                !keysetGuard || hasSameGuard(sourceAccount.guard, keysetGuard)
              }
              isLoading={loading}
              onClick={async () => {
                if (keysetGuard) {
                  setLoading(true);
                  const target = await createAccountByKeyset(keysetGuard);
                  await migrateTo(target);
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
              navigate(`/account/${targetAccount.uuid}`);
            }}
            txIds={txs.map((tx) => tx.uuid)}
            showExpanded={txs.length === 1}
          />
        </Stack>
      )}
    </Stack>
  );
}
