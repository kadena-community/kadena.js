import React, { useEffect, useRef, useState } from 'react';

import { Button, Notification, Stack, SystemIcon } from '@kadena/react-ui';

import { NAME_VALIDATION } from '@/components/Global/AccountNameField';
import { FormStatusNotification } from '@/components/Global/FormStatusNotification';
import type { PredKey } from '@/components/Global/PredKeysSelect';
import type { DerivationMode } from '@/hooks/use-ledger-public-key';
import { getDerivationPath } from '@/hooks/use-ledger-public-key';
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

import { buttonContainerClass } from '@/pages/transactions/transfer/styles.css';

import { useWalletConnectClient } from '@/context/connect-wallet-context';

import type { AccountDetails } from '@/hooks/use-account-details-query';
import { stripAccountPrefix } from '@/utils/string';
import type { ChainId } from '@kadena/types';
import type { PactCommandObject } from '@ledgerhq/hw-app-kda';
import { z } from 'zod';
import { SignFormReceiver } from './sign-form-receiver';
import type { SenderType } from './sign-form-sender';
import { SignFormSender } from './sign-form-sender';

const schema = z.object({
  sender: NAME_VALIDATION,
  senderChainId: z.enum(CHAINS),
  receiver: NAME_VALIDATION,
  amount: z.number().positive(),
  receiverChainId: z.enum(CHAINS),
});

export type FormData = z.infer<typeof schema>;

export const SignForm = ({
  onSuccess,
  onSenderChainUpdate,
  onReceiverChainUpdate,
  setIsLedger,
}: {
  onSuccess: (pactCommandObject: PactCommandObject) => void;
  onSenderChainUpdate: (chainId: ChainId) => void;
  onReceiverChainUpdate: (chainId: ChainId) => void;
  setIsLedger: (mode: boolean) => void;
}) => {
  const { t } = useTranslation('common');

  const [ledgerSignState, signTx] = useLedgerSign();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { senderChainId: CHAINS[0], receiverChainId: undefined },
  });

  const { selectedNetwork: network } = useWalletConnectClient();

  const watchChains = methods.watch(['senderChainId', 'receiverChainId']);
  const onSameChain = watchChains.every((chain) => chain === watchChains[0]);

  const senderDataRef = useRef<AccountDetails>();
  const onSenderDataUpdate = (data: AccountDetails) => {
    senderDataRef.current = data;
  };

  const receiverDataRef = useRef<AccountDetails>();
  const onReceiverDataUpdate = (data: AccountDetails | undefined) => {
    receiverDataRef.current = data;
  };

  const pubKeys = useRef<string[]>([]);
  const onPubKeysUpdate = (keys: string[]) => {
    pubKeys.current = keys;
  };

  const pred = useRef<PredKey>();
  const onPredicateUpdate = (predicate: PredKey) => {
    pred.current = predicate;
  };

  const keyId = useRef<number>();
  const onKeyIdUpdate = (id: number) => {
    keyId.current = id;
  };

  const derivationMode = useRef<DerivationMode>();
  const onDerivationUpdate = (mode: DerivationMode) => {
    derivationMode.current = mode;
  };

  const [signingMethod, setSigningMethod] = useState<SenderType>('Ledger');

  useEffect(() => {
    if (signingMethod === 'Ledger') {
      setIsLedger(true);
    }
  }, [signingMethod, setIsLedger]);

  const handleSignTransaction = async (data: FormData) => {
    let transferInput: TransferInput;

    transferInput = {
      sender: {
        account: senderDataRef.current?.account ?? '',
        publicKeys: [stripAccountPrefix(data.sender)],
      },
      receiver: receiverDataRef.current?.account ?? '',
      chainId: data.senderChainId,
      amount: String(data.amount),
    };

    if (!onSameChain) {
      const xChainTransferInput: ICrossChainInput = {
        ...transferInput,
        receiver: {
          account: transferInput.receiver || data.receiver,
          keyset: {
            keys: receiverDataRef.current?.guard.keys || pubKeys.current,
            pred:
              (receiverDataRef.current?.guard.pred as PredKey) || pred.current!,
          },
        },
        targetChainId: data.receiverChainId,
      };
      transferInput = xChainTransferInput;
    } else if (!receiverDataRef.current) {
      const createTransferInput: ICreateTransferInput = {
        ...transferInput,
        receiver: {
          account: data.receiver,
          keyset: {
            keys: pubKeys.current,
            pred: pred.current!,
          },
        },
      };
      transferInput = createTransferInput;
    }

    const { isSigned, pactCommand } = await signTx(transferInput, {
      networkId: network,
      derivationPath: getDerivationPath(
        keyId.current!,
        derivationMode.current!,
      ),
    });

    if (isSigned) {
      onSuccess(pactCommand);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSignTransaction)}>
        <Stack flexDirection="column" gap="lg">
          {/* SENDER  FLOW */}
          <SignFormSender
            onDataUpdate={onSenderDataUpdate}
            onKeyIdUpdate={onKeyIdUpdate}
            onDerivationUpdate={onDerivationUpdate}
            onChainUpdate={onSenderChainUpdate}
            signingMethod={signingMethod}
            onSigningMethodUpdate={setSigningMethod}
          />

          {/* RECEIVER FLOW */}
          <SignFormReceiver
            onDataUpdate={onReceiverDataUpdate}
            onPubKeysUpdate={onPubKeysUpdate}
            onPredicateUpdate={onPredicateUpdate}
            onChainUpdate={onReceiverChainUpdate}
            signingMethod={signingMethod}
          />

          {ledgerSignState.error && (
            <FormStatusNotification
              status="erroneous"
              body={ledgerSignState.error.message}
            />
          )}

          {ledgerSignState.loading && (
            <Notification role="alert">
              {t('Waiting for ledger signature…')}
            </Notification>
          )}

          <div className={buttonContainerClass}>
            <Button
              // isLoading={receiverData.isFetching || ledgerSignState.loading}
              isLoading={ledgerSignState.loading}
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

export default SignForm;
