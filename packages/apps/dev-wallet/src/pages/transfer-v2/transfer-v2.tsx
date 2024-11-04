import { useWallet } from '@/modules/wallet/wallet.hook';

import { ISigner } from '@kadena/client';

import { MonoSwapHoriz } from '@kadena/kode-icons/system';
import { Divider, Heading, Stack, Step, Stepper, Text } from '@kadena/kode-ui';
import { useCallback, useEffect, useState } from 'react';

import { activityRepository } from '@/modules/activity/activity.repository';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { useLayout } from '@kadena/kode-ui/patterns';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReviewTransaction } from '../transaction/components/ReviewTransaction';
import { TxList } from '../transaction/components/TxList';
import { statusPassed } from '../transaction/components/TxPipeLine';
import {
  Redistribution,
  TrG,
  Transfer,
  TransferForm,
} from './Steps/TransferForm';
import { createRedistributionTxs, createTransactions } from './utils';

export function TransferV2() {
  useLayout({
    appContext: undefined,
    breadCrumbs: [
      {
        label: 'Transfer',
        visual: <MonoSwapHoriz />,
        url: '/transfer',
      },
    ],
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get('accountId');
  const urlActivityId = searchParams.get('activityId');

  useEffect(() => {
    const run = async () => {
      if (urlActivityId) {
        const activity = await activityRepository.getActivity(urlActivityId);
        if (activity) {
          const loadedTxGroups = {
            redistribution: {
              groupId: activity.data.txGroups.redistribution.groupId,
              txs: await transactionRepository.getTransactionsByGroup(
                activity.data.txGroups.redistribution.groupId,
              ),
            },
            transfer: {
              groupId: activity.data.txGroups.transfer.groupId,
              txs: await transactionRepository.getTransactionsByGroup(
                activity.data.txGroups.transfer.groupId,
              ),
            },
          };
          setTxGroups(loadedTxGroups);
          const transferIsDone = loadedTxGroups.transfer.txs.every(
            (tx) =>
              statusPassed(tx.status, 'success') ||
              statusPassed(tx.status, 'failure'),
          );
          if (transferIsDone) {
            setStep('summary');
          } else {
            setStep('sign');
          }
        }
      }
    };
    run();
  }, [accountId, urlActivityId]);

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
      contract: data.fungible,
      gasLimit: +data.gasLimit,
      gasPrice: +data.gasPrice,
      receivers: data.receivers,
      isSafeTransfer: data.type === 'safeTransfer',
      network: activeNetwork!,
      profileId: profile.uuid,
      mapKeys,
    });
  }

  const reloadTxs = async () => {
    const upd: {
      redistribution: TrG;
      transfer: TrG;
    } = {
      redistribution: { groupId: '', txs: [] },
      transfer: { groupId: '', txs: [] },
    };
    if (txGroups.redistribution.groupId) {
      const txs = await transactionRepository.getTransactionsByGroup(
        txGroups.redistribution.groupId,
      );
      upd.redistribution = { groupId: txGroups.redistribution.groupId, txs };
    }
    if (txGroups.transfer.groupId) {
      const txs = await transactionRepository.getTransactionsByGroup(
        txGroups.transfer.groupId,
      );
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
        network: activeNetwork!,
        mapKeys,
      });
    }
  }

  const renderSignStep = () => {
    if (
      txGroups.redistribution.txs.length === 0 &&
      txGroups.transfer.txs.length === 1 &&
      null === undefined // bypass for now
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

    const onlyOneTx = txGroups.transfer.txs.length === 1 && reTxs.length === 0;
    return (
      <Stack gap={'md'} flexDirection={'column'}>
        {onlyOneTx && (
          <TxList
            onDone={() => {
              console.log('update');
              reloadTxs();
            }}
            txIds={txGroups.transfer.txs.map(({ uuid }) => uuid)}
            showExpanded={true}
          />
        )}
        {!onlyOneTx && reTxs.length > 0 && (
          <>
            <Stack flexDirection={'column'} gap={'lg'}>
              <Stack flexDirection={'column'} gap={'xs'}>
                <Heading variant="h4">Redistribution Transactions</Heading>
                <Text>First we send required tokens to the target chains</Text>
              </Stack>
              <TxList
                onDone={() => {
                  console.log('update');
                  reloadTxs();
                }}
                txIds={reTxs.map(({ uuid }) => uuid)}
              />
            </Stack>
            <Divider />
          </>
        )}
        {!onlyOneTx && txGroups.transfer.txs.length > 0 && (
          <Stack flexDirection={'column'} gap={'lg'}>
            <Stack flexDirection={'column'} gap={'xxs'}>
              <Heading variant="h4">Transfer Transactions</Heading>
              <Text>These are the transactions for the final transfers</Text>
            </Stack>
            <TxList
              onDone={() => {
                console.log('update');
                reloadTxs();
              }}
              txIds={txGroups.transfer.txs.map(({ uuid }) => uuid)}
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
        <Stack justifyContent={'center'}>
          <Stack gap={'lg'} flexDirection={'column'} style={{ width: '670px' }}>
            <TransferForm
              accountId={accountId}
              activityId={urlActivityId}
              onSubmit={async (data, redistribution) => {
                const senderAccount = allAccounts.find(
                  (acc) => acc.uuid === data.accountId,
                );
                if (!senderAccount?.keyset?.uuid) return;
                const formData = { ...data, senderAccount };
                const getEmpty = () => ['', []] as [string, ITransaction[]];
                let redistributionGroup = getEmpty();

                if (redistribution.length > 0) {
                  redistributionGroup =
                    (await createRedistribution(formData, redistribution)) ??
                    getEmpty();
                }
                const txGroup =
                  (await createTransaction(formData)) ?? getEmpty();
                const updatedTxGroups = {
                  redistribution: {
                    groupId: redistributionGroup[0] ?? '',
                    txs: redistributionGroup[1] ?? [],
                  },
                  transfer: {
                    groupId: txGroup[0] ?? '',
                    txs: txGroup[1] ?? [],
                  },
                };
                setTxGroups(updatedTxGroups);
                const activityId = crypto.randomUUID();
                await activityRepository.addActivity({
                  data: {
                    transferData: data,
                    txGroups: {
                      transfer: {
                        groupId: updatedTxGroups.transfer.groupId,
                      },
                      redistribution: {
                        groupId: updatedTxGroups.redistribution.groupId,
                      },
                    },
                  },
                  keysetId: senderAccount.keyset?.uuid,
                  networkUUID: activeNetwork!.uuid,
                  profileId: profile?.uuid ?? '',
                  status: 'Initiated',
                  type: 'Transfer',
                  uuid: activityId,
                });
                setStep('sign');
                // then the page will stay on the sign step if refresh
                navigate(`/transfer?activityId=${activityId}`);
              }}
            />
          </Stack>
        </Stack>
      )}
      {(step === 'sign' || step === 'result' || step === 'summary') &&
        renderSignStep()}
    </Stack>
  );
}
