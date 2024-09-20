import { useWallet } from '@/modules/wallet/wallet.hook';

import { ChainId, ISigner } from '@kadena/client';

import { MonoSwapHoriz } from '@kadena/kode-icons/system';
import { Divider, Heading, Stack, Step, Stepper, Text } from '@kadena/kode-ui';
import { useCallback, useState } from 'react';

import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { useSearchParams } from 'react-router-dom';
import { ReviewTransaction } from '../transaction/components/ReviewTransaction';
import { TxList } from '../transaction/components/TxList';
import { statusPassed } from '../transaction/components/TxTile';
import { RedistributionPage } from './Steps/Redistribution';
import { Redistribution, Transfer, TransferForm } from './Steps/TransferForm';
import { createRedistributionTxs, createTransactions } from './utils';

interface TrG {
  groupId: string;
  txs: ITransaction[];
}

const sortById = (a: { uuid: string }, b: { uuid: string }) =>
  a.uuid > b.uuid ? 1 : -1;

export function TransferV2() {
  const accountId = useSearchParams()[0].get('accountId');
  const [step, setStep] = useState('transfer');
  const [txGroupId, setTxGroupId] = useState<{
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
    if (txGroupId.redistribution.groupId) {
      const txs = (
        await transactionRepository.getTransactionsByGroup(
          txGroupId.redistribution.groupId,
        )
      ).sort(sortById);
      upd.redistribution = { groupId: txGroupId.redistribution.groupId, txs };
    }
    if (txGroupId.transfer.groupId) {
      const txs = (
        await transactionRepository.getTransactionsByGroup(
          txGroupId.transfer.groupId,
        )
      ).sort(sortById);
      upd.transfer = { groupId: txGroupId.transfer.groupId, txs };
    }
    setTxGroupId(upd);
  };

  const [trForm, setTrForm] = useState<Required<Transfer>>();
  const {
    accounts: allAccounts,
    getPublicKeyData,
    activeNetwork,
    profile,
  } = useWallet();
  const [redistribution, setRedistribution] = useState(
    [] as {
      source: ChainId;
      target: ChainId;
      amount: string;
    }[],
  );

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
      txGroupId.redistribution.txs.length === 0 &&
      txGroupId.transfer.txs.length === 1
    ) {
      const selectedTx = txGroupId.transfer.txs[0];
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
    const reTxs = txGroupId.redistribution.txs;
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
        {txGroupId.transfer.txs.length > 0 && (
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
              txs={txGroupId.transfer.txs}
              sendDisabled={
                reTxs.length > 0 && reTxs.some((tx) => tx.status !== 'success')
              }
            />
            {reTxs.length > 0 &&
              reTxs.some((tx) => tx.status !== 'success') && (
                <Text>
                  You can only send this transactions after redistribute is
                  done!
                </Text>
              )}
          </Stack>
        )}
      </Stack>
    );
  };

  return (
    <Stack flexDirection={'column'}>
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
        <Step active={step === 'submit'}>Result</Step>
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
            setRedistribution(redistribution);
            setTrForm(formData);
            const getEmpty = () => ['', []] as [string, ITransaction[]];
            let redistributionGroup = getEmpty();

            if (redistribution.length > 0) {
              redistributionGroup =
                (await createRedistribution(formData, redistribution)) ??
                getEmpty();
            }
            const txGroup = (await createTransaction(formData)) ?? getEmpty();
            setTxGroupId({
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
      {step === 'redistribution' && (
        <RedistributionPage
          redistribution={redistribution}
          formData={trForm!}
        />
      )}
      {step === 'sign' && renderSignStep()}
    </Stack>
  );
}
