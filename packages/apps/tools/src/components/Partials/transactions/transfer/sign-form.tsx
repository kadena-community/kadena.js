import React, { useEffect, useRef, useState } from 'react';

import type { IButtonProps } from '@kadena/react-ui';
import { Button, Stack } from '@kadena/react-ui';

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

import { useWalletConnectClient } from '@/context/connect-wallet-context';

import type { AccountDetails } from '@/hooks/use-account-details-query';
import { stripAccountPrefix } from '@/utils/string';
import {
  MonoKeyboardArrowRight,
  MonoRefresh,
} from '@kadena/react-icons/system';
import type { ChainId } from '@kadena/types';
import type { PactCommandObject } from '@ledgerhq/hw-app-kda';
import { z } from 'zod';
import { SignFormReceiver } from './sign-form-receiver';
import type { SenderType } from './sign-form-sender';
import { SignFormSender } from './sign-form-sender';

export const schema = z.object({
  sender: NAME_VALIDATION,
  senderChainId: z.enum(CHAINS),
  receiver: NAME_VALIDATION.regex(
    /^k:[0-9A-Fa-f]{64}/,
    'Signing with Ledger currently only supports single key accounts.',
  ),
  amount: z.number().positive(),
  receiverChainId: z.enum(CHAINS),
  isConnected: z.boolean().refine((val) => val === true),
});

export type FormData = z.infer<typeof schema>;

export const defaultValues = {
  senderChainId: CHAINS[0],
  receiverChainId: undefined,
  receiver: '',
  sender: '',
  amount: 0,
};

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
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { selectedNetwork: network } = useWalletConnectClient();

  const watchChains = methods.watch(['senderChainId', 'receiverChainId']);
  const onSameChain = watchChains.every(
    (chain: ChainId) => chain === watchChains[0],
  );

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

  const handleReset = () => {
    reset(defaultValues);

    onPubKeysUpdate([]);
  };

  const getSubmitButtonText = () => {
    if (signingMethod !== 'Ledger') {
      return t('Sign');
    }

    if (ledgerSignState.loading) {
      return t('Waiting for Ledger');
    }

    return t('Sign on Ledger');
  };

  const getSubmitButtonColor = (): IButtonProps['color'] => {
    if (signingMethod === 'Ledger' && ledgerSignState.loading) {
      return 'info';
    }

    return 'primary';
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleSignTransaction)}
        onReset={handleReset}
      >
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

          {errors.isConnected && (
            <FormStatusNotification
              status="erroneous"
              body={t('ledger-sign-error')}
            />
          )}

          <Stack justifyContent={'flex-end'} gap={'lg'}>
            <Button
              // isLoading={isLoading}
              // isDisabled={ledgerSignState.loading}
              endIcon={<MonoRefresh />}
              color="secondary"
              title={t('Reset')}
              type="reset"
            >
              {t('Reset')}
            </Button>

            <Button
              endIcon={<MonoKeyboardArrowRight />}
              title={getSubmitButtonText()}
              type="submit"
              color={getSubmitButtonColor()}
            >
              {getSubmitButtonText()}
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default SignForm;
