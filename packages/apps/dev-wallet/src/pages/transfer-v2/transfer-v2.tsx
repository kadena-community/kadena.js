import { useWallet } from '@/modules/wallet/wallet.hook';

import { ChainId, ISigner } from '@kadena/client';

import { MonoSwapHoriz } from '@kadena/kode-icons/system';
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  Divider,
  Heading,
  Stack,
  Step,
  Stepper,
  Text,
} from '@kadena/kode-ui';
import { useCallback, useState } from 'react';

import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { useSearchParams } from 'react-router-dom';
import { ReviewTransaction } from '../transaction/components/ReviewTransaction';
import { TxList } from '../transaction/components/TxList';
import { statusPassed } from '../transaction/components/TxTile';
import { Result } from './Steps/Result';
import {
  Redistribution,
  TrG,
  Transfer,
  TransferForm,
} from './Steps/TransferForm';
import { createRedistributionTxs, createTransactions } from './utils';

const sortById = (a: { uuid: string }, b: { uuid: string }) =>
  a.uuid > b.uuid ? 1 : -1;

export function TransferV2() {
  const accountId = useSearchParams()[0].get('accountId');
  const [step, setStep] = useState<'transfer' | 'sign' | 'result' | 'summary'>(
    'transfer',
  );
  const [txGroups, setTxGroups] = useState<{
    redistribution: TrG;
    transfer: TrG;
  }>({
    redistribution: { groupId: '', txs: [] },
    transfer: { groupId: '', txs: [] },
  });

  const reloadTxs = async () => {
    const upd: {
      redistribution: TrG;
      transfer: TrG;
    } = {
      redistribution: { groupId: '', txs: [] },
      transfer: { groupId: '', txs: [] },
    };
    if (txGroups.redistribution.groupId) {
      const txs = (
        await transactionRepository.getTransactionsByGroup(
          txGroups.redistribution.groupId,
        )
      ).sort(sortById);
      upd.redistribution = { groupId: txGroups.redistribution.groupId, txs };
    }
    if (txGroups.transfer.groupId) {
      const txs = (
        await transactionRepository.getTransactionsByGroup(
          txGroups.transfer.groupId,
        )
      ).sort(sortById);
      upd.transfer = { groupId: txGroups.transfer.groupId, txs };
    }
    const transferIsDone = upd.transfer.txs.every(
      (tx) =>
        statusPassed(tx.status, 'success') ||
        statusPassed(tx.status, 'failure'),
    );
    if (transferIsDone) {
      setStep('result');
    }
    setTxGroups(upd);
  };

  const {
    accounts: allAccounts,
    getPublicKeyData,
    activeNetwork,
    profile,
  } = useWallet();
  function createTransaction(data: Required<Transfer>) {
    if (!data.senderAccount || !profile) return;
    return createTransactions({
      account: data.senderAccount,
      contract: data.fungibleType,
      gasLimit: +data.gasLimit,
      gasPrice: +data.gasPrice,
      receivers: data.receivers,
      isSafeTransfer: data.type === 'safeTransfer',
      networkId: activeNetwork?.networkId ?? 'mainnet01',
      profileId: profile.uuid,
      mapKeys,
    });
  }

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

  function createRedistribution(
    formData: Required<Transfer>,
    redistribution: Redistribution[],
  ) {
    if (redistribution.length > 0) {
      if (!formData.senderAccount || !formData.senderAccount.keyset) return;
      return createRedistributionTxs({
        account: formData.senderAccount,
        redistribution,
        gasLimit: +formData.gasLimit,
        gasPrice: +formData.gasPrice,
        networkId: activeNetwork?.networkId ?? 'mainnet01',
        mapKeys,
      });
    }
  }

  const renderSignStep = () => {
    if (
      txGroups.redistribution.txs.length === 0 &&
      txGroups.transfer.txs.length === 1
    ) {
      const selectedTx = txGroups.transfer.txs[0];
      return (
        <ReviewTransaction
          transaction={selectedTx}
          onSign={async (sigs) => {
            const updated = {
              ...selectedTx,
              sigs,
              status: sigs.every((data) => data?.sig)
                ? !statusPassed(selectedTx.status, 'signed')
                  ? 'signed'
                  : selectedTx.status
                : selectedTx.status,
            } as ITransaction;
            await transactionRepository.updateTransaction(updated);
            reloadTxs();
          }}
        />
      );
    }
    const reTxs = txGroups.redistribution.txs;
    const submitIsDisabled =
      reTxs.length > 0 && reTxs.some((tx) => !tx.continuation?.done);
    return (
      <Stack gap={'md'} flexDirection={'column'}>
        {reTxs.length > 0 && (
          <>
            <Stack flexDirection={'column'} gap={'lg'}>
              <Stack flexDirection={'column'} gap={'xs'}>
                <Heading variant="h4">Redistribution Transactions</Heading>
                <Text>First we send required tokens to the target chains</Text>
              </Stack>
              <TxList
                onUpdate={() => {
                  console.log('update');
                  reloadTxs();
                }}
                txs={reTxs}
              />
            </Stack>
            <Divider />
          </>
        )}
        {txGroups.transfer.txs.length > 0 && (
          <Stack flexDirection={'column'} gap={'lg'}>
            <Stack flexDirection={'column'} gap={'xxs'}>
              <Heading variant="h4">Transfer Transactions</Heading>
              <Text>These are the transactions for the final transfers</Text>
            </Stack>
            <TxList
              onUpdate={() => {
                console.log('update');
                reloadTxs();
              }}
              txs={txGroups.transfer.txs}
              sendDisabled={submitIsDisabled}
            />
            {submitIsDisabled && (
              <Text>
                You can only send this transactions after redistribute is done!
              </Text>
            )}
          </Stack>
        )}
      </Stack>
    );
  };

  return (
    <Stack flexDirection={'column'}>
      {step === 'result' && (
        <Dialog size="sm" isOpen>
          <DialogHeader>Process is done!</DialogHeader>
          <DialogFooter>
            <Button onClick={() => setStep('summary')}>View result page</Button>
          </DialogFooter>
        </Dialog>
      )}
      <Stepper direction="horizontal">
        <Step
          icon={<MonoSwapHoriz />}
          onClick={() => {
            setStep('transfer');
          }}
          active={step === 'transfer'}
        >
          Transfer
        </Step>
        <Step active={step === 'sign'}>Transactions</Step>
        <Step active={step === 'result'}>Result</Step>
      </Stepper>
      {step === 'transfer' && (
        <TransferForm
          accountId={accountId}
          onSubmit={async (data, redistribution) => {
            const senderAccount = allAccounts.find(
              (acc) => acc.uuid === data.account,
            );
            if (!senderAccount) return;
            const formData = { ...data, senderAccount };
            const getEmpty = () => ['', []] as [string, ITransaction[]];
            let redistributionGroup = getEmpty();

            if (redistribution.length > 0) {
              redistributionGroup =
                (await createRedistribution(formData, redistribution)) ??
                getEmpty();
            }
            const txGroup = (await createTransaction(formData)) ?? getEmpty();
            setTxGroups({
              redistribution: {
                groupId: redistributionGroup[0] ?? '',
                txs: redistributionGroup[1].sort(sortById) ?? [],
              },
              transfer: {
                groupId: txGroup[0] ?? '',
                txs: txGroup[1].sort(sortById) ?? [],
              },
            });
            setStep('sign');
          }}
        />
      )}
      {(step === 'sign' || step === 'result') && renderSignStep()}
      {step === 'summary' && <Result {...txGroups} />}
    </Stack>
  );
}
