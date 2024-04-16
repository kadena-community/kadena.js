import type { Network } from '@/constants/kadena';
import type { AppKdaLike } from '@/utils/ledger';
import { getKadenaLedgerApp } from '@/utils/ledger';
import { isSignedTransaction } from '@kadena/client';
import type {
  createCrossChainCommand,
  transferCommand,
  transferCreateCommand,
} from '@kadena/client-utils/coin';
import type { TransferCrossChainTxParams } from '@ledgerhq/hw-app-kda';
import { useAsyncFn } from 'react-use';

export type ITransferInput = Parameters<typeof transferCommand>[0];
export type ICreateTransferInput = Parameters<typeof transferCreateCommand>[0];
export type ICrossChainInput = Parameters<typeof createCrossChainCommand>[0];
export type TransferInput =
  | ITransferInput
  | ICreateTransferInput
  | ICrossChainInput;

// For now copied over default from Library; https://github.com/obsidiansystems/hw-app-kda/blob/37e1b863b0e8c28023efde9ff1fd26cd25bc3997/src/Kadena.ts#L175-L176
export const GasDefaults = {
  LIMIT: 2300,
  PRICE: '1.0e-6',
};

const pactToLedger = (
  input: TransferInput,
  derivationPath: string,
  networkId: Network,
): TransferCrossChainTxParams => {
  const { receiver, amount, chainId } = input;
  const recipient = typeof receiver === 'string' ? receiver : receiver.account;
  const recipient_chainId =
    'targetChainId' in input ? input.targetChainId : '0';

  return {
    path: derivationPath,
    recipient,
    amount,
    chainId: parseInt(chainId, 10),
    recipient_chainId: parseInt(recipient_chainId, 10),
    network: networkId,
    gasLimit: `${GasDefaults.LIMIT}`,
    gasPrice: GasDefaults.PRICE,
  };
};

const isCrossChainInput = (
  transferInput: TransferInput,
): transferInput is ICrossChainInput => {
  return 'targetChainId' in transferInput;
};

const isTransferInput = (
  transferInput: TransferInput,
): transferInput is ITransferInput => {
  return typeof transferInput.receiver === 'string';
};

const signWithLedger = (
  app: AppKdaLike,
  transferInput: TransferInput,
  derivationPath: string,
  networkId: Network,
) => {
  const ledgerParams = pactToLedger(transferInput, derivationPath, networkId);

  if (isCrossChainInput(transferInput)) {
    return app.signTransferCrossChainTx(ledgerParams);
  }

  if (isTransferInput(transferInput)) {
    return app.signTransferTx(ledgerParams);
  }

  return app.signTransferCreateTx(ledgerParams);
};

const sign = async (
  app: AppKdaLike,
  transferInput: TransferInput,
  networkId: string,
  derivationPath: string,
) => {
  const signed = await signWithLedger(
    app,
    transferInput,
    derivationPath,
    networkId,
  );

  return {
    pactCommand: signed.pact_command,
    isSigned: isSignedTransaction(signed.pact_command),
  };
};

const useLedgerSign = () => {
  return useAsyncFn(
    async (
      transferInput: TransferInput,
      {
        networkId,
        derivationPath,
      }: { networkId: string; derivationPath: string },
    ) => {
      const app = await getKadenaLedgerApp();
      return sign(app, transferInput, networkId, derivationPath);
    },
  );
};

export { useLedgerSign };
