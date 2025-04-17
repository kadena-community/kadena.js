import { useWallet } from '@/modules/wallet/wallet.hook';
import {
  CompactStepper,
  Divider,
  Heading,
  ICompactStepperItemProps,
  Notification,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { useEffect, useState } from 'react';

import { isKeysetGuard } from '@/modules/account/guards';
import { activityRepository } from '@/modules/activity/activity.repository';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { FocussedLayoutHeaderContent } from '@kadena/kode-ui/patterns';
import { useSearchParams } from 'react-router-dom';
import { TxList } from '../transaction/components/TxList';
import { statusPassed } from '../transaction/components/TxPipeLine/utils';
import {
  ITransfer,
  Redistribution,
  TransferForm,
  TrG,
} from './Steps/TransferForm/TransferForm';
import {
  createRedistributionTxs,
  createTransactions,
  IReceiver,
} from './utils';

export type IStepKeys =
  | 'transfer'
  | 'sign'
  | 'success'
  | 'preflight'
  | 'send'
  | 'failure';

const steps: ICompactStepperItemProps[] = [
  {
    label: 'Transfer',
    id: 'transfer',
  },
  {
    label: 'Sign',
    id: 'sign',
  },
  {
    label: 'Preflight',
    id: 'preflight',
  },
  {
    label: 'Send',
    id: 'send',
  },
  {
    label: 'Success',
    id: 'success',
  },
] as const;

export function Transfer() {
  const { activeNetwork, profile } = useWallet();

  const navigate = usePatchedNavigate();
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
                profile?.uuid ?? '',
              ),
            },
            transfer: {
              groupId: activity.data.txGroups.transfer.groupId,
              txs: await transactionRepository.getTransactionsByGroup(
                activity.data.txGroups.transfer.groupId,
                profile?.uuid ?? '',
              ),
            },
          };
          setTxGroups(loadedTxGroups);
          const transferIsDone = loadedTxGroups.transfer.txs.every(
            (tx) =>
              statusPassed(tx.status, 'success') ||
              statusPassed(tx.status, 'failure'),
          );
          const transferSucceed = loadedTxGroups.transfer.txs.every((tx) =>
            statusPassed(tx.status, 'success'),
          );
          if (transferIsDone) {
            setStep(transferSucceed ? 'success' : 'failure');
          } else {
            setStep('sign');
          }
        }
      }
    };
    run();
  }, [accountId, urlActivityId]);

  const [step, setStep] = useState<IStepKeys>('transfer');
  const [txGroups, setTxGroups] = useState<{
    redistribution: TrG;
    transfer: TrG;
  }>({
    redistribution: { groupId: '', txs: [] },
    transfer: { groupId: '', txs: [] },
  });

  function createTransaction(data: Required<ITransfer>) {
    if (!data.senderAccount || !profile) return;
    const receivers = data.receivers.filter(Boolean) as Required<IReceiver>[];
    return createTransactions({
      account: data.senderAccount,
      contract: data.fungible,
      gasLimit: +data.gasLimit,
      gasPayer: data.gasPayer || data.senderAccount,
      gasPrice: +data.gasPrice,
      receivers,
      isSafeTransfer: data.type === 'safeTransfer',
      network: activeNetwork!,
      profileId: profile.uuid,
      creationTime: data.creationTime,
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
        profile?.uuid ?? '',
      );
      upd.redistribution = { groupId: txGroups.redistribution.groupId, txs };
    }
    if (txGroups.transfer.groupId) {
      const txs = await transactionRepository.getTransactionsByGroup(
        txGroups.transfer.groupId,
        profile?.uuid ?? '',
      );
      upd.transfer = { groupId: txGroups.transfer.groupId, txs };
    }
    const transferIsDone = upd.transfer.txs.every(
      (tx) =>
        statusPassed(tx.status, 'success') ||
        statusPassed(tx.status, 'failure'),
    );
    const transferSucceed = upd.transfer.txs.every((tx) =>
      statusPassed(tx.status, 'success'),
    );
    if (transferIsDone) {
      setStep(transferSucceed ? 'success' : 'failure');
    } else {
      setStep('sign');
    }
    setTxGroups(upd);
  };

  function createRedistribution(
    formData: Required<ITransfer>,
    redistribution: Redistribution[],
  ) {
    if (!profile?.uuid) {
      throw new Error('Profile not found');
    }
    if (redistribution.length > 0) {
      if (!formData.senderAccount) return;
      return createRedistributionTxs({
        account: formData.senderAccount,
        gasPayer: formData.gasPayer || formData.senderAccount,
        redistribution,
        gasLimit: +formData.gasLimit,
        gasPrice: +formData.gasPrice,
        network: activeNetwork!,
        creationTime: formData.creationTime,
        profileId: profile.uuid,
      });
    }
  }

  const renderSignStep = () => {
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
            setStep={handleSetStep}
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
                setStep={handleSetStep}
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
              setStep={handleSetStep}
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

  const getStepIdx = (key: IStepKeys): number => {
    return steps.findIndex((step) => step.id === key) ?? 0;
  };

  const handleSetStep = (step: IStepKeys) => {
    setStep(step);
  };

  return (
    <>
      <FocussedLayoutHeaderContent>
        <CompactStepper
          stepIdx={getStepIdx(step)}
          steps={steps as ICompactStepperItemProps[]}
        />
      </FocussedLayoutHeaderContent>
      <Stack flexDirection={'column'} width="100%" marginBlockEnd={'md'}>
        {step === 'transfer' && (
          <TransferForm
            accountId={accountId}
            activityId={urlActivityId}
            onSubmit={async (data, redistribution) => {
              if (!data.senderAccount) {
                throw new Error('Sender account not found');
              }
              const receivers = data.receivers.filter(
                Boolean,
              ) as Required<IReceiver>[];
              if (!isKeysetGuard(data.senderAccount.guard)) return;
              if (!receivers.every((receiver) => receiver.discoveredAccount)) {
                throw new Error('Discovered account not found');
              }

              const getEmpty = () => ['', []] as [string, ITransaction[]];
              let redistributionGroup = getEmpty();

              if (redistribution.length > 0) {
                redistributionGroup =
                  (await createRedistribution(data, redistribution)) ??
                  getEmpty();
              }
              const txGroup =
                (await createTransaction({ ...data, receivers })) ?? getEmpty();
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
                  transferData: {
                    ...data,
                    receivers,
                  },
                  txGroups: {
                    transfer: {
                      groupId: updatedTxGroups.transfer.groupId,
                    },
                    redistribution: {
                      groupId: updatedTxGroups.redistribution.groupId,
                    },
                  },
                },
                account: data.senderAccount,
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
        )}
        {step === 'success' && (
          <Stack marginBlock={'lg'}>
            <Notification role="status" intent="positive">
              Transfer is done!
            </Notification>
          </Stack>
        )}
        {step === 'failure' && (
          <Stack marginBlock={'lg'}>
            <Notification role="status" intent="negative">
              Transfer is failed!
            </Notification>
          </Stack>
        )}
        {step !== 'transfer' && renderSignStep()}
      </Stack>
    </>
  );
}
