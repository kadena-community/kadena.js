import { useWallet } from '@/modules/wallet/wallet.hook';

import { ChainId, ISigner } from '@kadena/client';

import { MonoSwapHoriz } from '@kadena/kode-icons/system';
import { Stack, Step, Stepper } from '@kadena/kode-ui';
import { useCallback, useState } from 'react';

import { useSearchParams } from 'react-router-dom';
import { Transaction } from '../transaction/Transaction';
import { RedistributionPage } from './Steps/Redistribution';
import { Transfer, TransferForm } from './Steps/TransferForm';
import { createTransactions } from './utils';

export function TransferV2() {
  const accountId = useSearchParams()[0].get('accountId');
  const [step, setStep] = useState('transfer');
  const [txGroupId, setTxGroupId] = useState<string>();
  const [hasRedistribution, setHasRedistribution] = useState(false);
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

  async function createTransaction(data: Required<Transfer>) {
    console.log('data', data);
    if (!data.senderAccount || !profile) return;
    const [groupId] = await createTransactions({
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
    setTxGroupId(groupId);
    setStep('sign');
    // navigate(`/transaction/${groupId}`);
    // console.log('txs', txs);
    // console.log('groupId', groupId);
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
        {hasRedistribution && (
          <Step active={step === 'redistribution'}>Redistribution</Step>
        )}
        <Step>Sign Transactions</Step>
        <Step>Submit</Step>
      </Stepper>
      {step === 'transfer' && (
        <TransferForm
          accountId={accountId}
          onHasRedistribute={(has) => {
            setHasRedistribution(has);
          }}
          onSubmit={async (data, redistribution) => {
            const senderAccount = allAccounts.find(
              (acc) => acc.uuid === data.account,
            );
            if (!senderAccount) return;
            setRedistribution(redistribution);
            setTrForm({ ...data, senderAccount });
            if (redistribution.length > 0) {
              setStep('redistribution');
            } else {
              await createTransaction({ ...data, senderAccount });
              setStep('sign');
            }
          }}
        />
      )}
      {step === 'redistribution' && (
        <RedistributionPage
          redistribution={redistribution}
          formData={trForm!}
        />
      )}
      {step === 'sign' && txGroupId && <Transaction groupId={txGroupId} />}
    </Stack>
  );
}
