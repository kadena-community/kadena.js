import React from 'react';

import { Button, Stack, SystemIcon } from '@kadena/react-ui';

import { NAME_VALIDATION } from '@/components/Global/AccountNameField';
import { FormStatusNotification } from '@/components/Global/FormStatusNotification';
import type { PredKey } from '@/components/Global/PredKeysSelect';
import useLedgerPublicKey, {
  getDerivationPath,
} from '@/hooks/use-ledger-public-key';
import type {
  ICreateTransferInput,
  ICrossChainInput,
  TransferInput,
} from '@/hooks/use-ledger-sign';
import { useLedgerSign } from '@/hooks/use-ledger-sign';
import { zodResolver } from '@hookform/resolvers/zod';
import { CHAINS } from '@kadena/chainweb-node-client';
import useTranslation from 'next-translate/useTranslation';
import { FormProvider, useForm } from 'react-hook-form';

import { buttonContainerClass } from './styles.css';

import { useWalletConnectClient } from '@/context/connect-wallet-context';

import { z } from 'zod';
import { SignFormReceiver } from './sign-form-receiver';
import { SignFormSender } from './sign-form-sender';

const schema = z.object({
  sender: NAME_VALIDATION,
  senderChainId: z.enum(CHAINS),
  receiver: NAME_VALIDATION,
  amount: z.number().positive(),
  receiverChainId: z.enum(CHAINS),
});

export type FormData = z.infer<typeof schema>;

export const SignForm = () => {
  const { t } = useTranslation('common');

  const [ledgerSignState, signTx] = useLedgerSign();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { senderChainId: CHAINS[0], receiverChainId: CHAINS[0] },
  });

  const { selectedNetwork: network } = useWalletConnectClient();

  const [{ value: ledgerPublicKey }] = useLedgerPublicKey();

  const watchChains = methods.watch(['senderChainId', 'receiverChainId']);
  const onSameChain = watchChains.every((chain) => chain === watchChains[0]);

  const handleSignTransaction = async (data: FormData) => {
    let transferInput: TransferInput;

    transferInput = {
      sender: {
        account: senderData.data?.account ?? '',
        publicKeys: ledgerPublicKey ? [ledgerPublicKey] : [],
      },
      receiver: receiverData.data?.account ?? '',
      chainId: data.senderChainId,
      amount: String(data.amount),
    };

    if (!onSameChain) {
      const xChainTransferInput: ICrossChainInput = {
        ...transferInput,
        receiver: {
          account: transferInput.receiver || data.receiver,
          keyset: {
            keys: receiverData.data?.guard.keys || pubKeys,
            pred: (receiverData.data?.guard.pred as PredKey) || pred,
          },
        },
        targetChainId: data.receiverChainId,
      };
      transferInput = xChainTransferInput;
    } else if (toAccountTab === 'new') {
      const createTransferInput: ICreateTransferInput = {
        ...transferInput,
        receiver: {
          account: data.receiver,
          keyset: {
            keys: pubKeys,
            pred: pred,
          },
        },
      };
      transferInput = createTransferInput;
    }

    await signTx(transferInput, {
      networkId: network,
      derivationPath: getDerivationPath(keyId!, derivationMode),
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSignTransaction)}>
        <Stack flexDirection="column" gap="lg">
          {/* SENDER  FLOW */}
          <SignFormSender />

          {/* RECEIVER FLOW */}
          <SignFormReceiver />

          {ledgerSignState.error && (
            <FormStatusNotification
              status="erroneous"
              body={ledgerSignState.error.message}
            />
          )}

          <div className={buttonContainerClass}>
            <Button
              isLoading={receiverData.isFetching || ledgerSignState.loading}
              // isDisabled={isSubmitting}
              endIcon={<SystemIcon.TrailingIcon />}
              title={t('Sign')}
              type="submit"
            >
              {t('Sign')}
            </Button>
          </div>
        </Stack>
      </form>
    </FormProvider>
  );
};
