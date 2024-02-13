import type { IExecutionPayloadObject, IPactCommand } from '@kadena/client';
import { createTransaction, isSignedTransaction } from '@kadena/client';
import {
  createCrossChainCommand,
  transferCommand,
  transferCreateCommand,
} from '@kadena/client-utils/coin';
import { PactNumber } from '@kadena/pactjs';
import type { ICommand, IUnsignedCommand } from '@kadena/types';
import type {
  BuildTransactionResult,
  TransferCrossChainTxParams,
  TransferTxParams,
} from '@ledgerhq/hw-app-kda';
import AppKda from '@ledgerhq/hw-app-kda';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { useQuery } from '@tanstack/react-query';
import { useAsyncFn } from 'react-use';
import useLedgerApp from './use-ledger-app';
// import { IUnsignedCommand } from '@kadena/client';

type PactCommand =
  | ReturnType<typeof transferCommand>
  | ReturnType<typeof createCrossChainCommand>
  | ReturnType<typeof transferCreateCommand>;

type ITransferInput = Parameters<typeof transferCommand>[0];
type ICreateTransferInput = Parameters<typeof transferCreateCommand>[0];
type ICrossChainInput = Parameters<typeof createCrossChainCommand>[0];

type TransferInput = Omit<ICrossChainInput, 'targetChainId' | 'receiver'> & {
  targetChainId?: ICrossChainInput['targetChainId'];
  receiver: ITransferInput['receiver'] | ICreateTransferInput['receiver'];
};

/**
 * parse a ICommand or IUnsignedCommand JSON object to IPactCommand
 *
 * @internal
 */
export const parseTransactionCommand: (
  transaction: IUnsignedCommand | ICommand,
) => IPactCommand = (transaction) => {
  return JSON.parse(transaction.cmd) as IPactCommand;
};

// @see; https://regex101.com/r/C8aw6x/1
const pattern = /"([^"]+)"\s+"([^"]+)"[^0-9]+(\d+(\.\d+)?)/;

const parsePayloadCode = (
  payload: string,
): { recipient: string; amount: number } => {
  const match = payload.match(pattern);

  if (!match) {
    throw new Error('Payload code is not as expected');
  }

  const toValue = match[2];
  const integerValue = parseFloat(match[3]); // Parse as float if the value can be a float

  return {
    recipient: toValue,
    amount: integerValue,
  };
};

const pactToLedger = (
  pactCommand: IUnsignedCommand,
  transferInput: TransferInput,
  derivationPath: string,
): TransferCrossChainTxParams => {
  const parsedTransaction = parseTransactionCommand(pactCommand);

  // const payload = parsedTransaction.payload as IExecutionPayloadObject;

  // const { recipient, amount } = parsePayloadCode(payload.exec.code);
  // const pactAmount = new PactNumber(amount).toPactDecimal();

  const recipient =
    typeof transferInput.receiver === 'string'
      ? transferInput.receiver
      : transferInput.receiver.account;

  console.log('pactToledger', {
    parsedTransaction,
    pactCommand,
    recipient,
    amount: transferInput.amount,
    chainId: parseInt(parsedTransaction.meta.chainId, 10),
    network: parsedTransaction.networkId,
  });

  return {
    path: derivationPath,
    recipient: recipient,
    amount: transferInput.amount,
    chainId: parseInt(parsedTransaction.meta.chainId, 10),
    recipient_chainId: parseInt(transferInput.targetChainId ?? '0', 10),
    network: parsedTransaction.networkId,
  };
};

const ledgerToPact = (
  ledgerCommand: BuildTransactionResult,
  pactCommand: ICommand | IUnsignedCommand,
): ICommand | IUnsignedCommand => {
  pactCommand.sigs = ledgerCommand.pact_command.sigs;

  return pactCommand;
};

const isCrossChainInput = (
  transferInput: TransferInput,
): transferInput is ICrossChainInput => {
  return !!transferInput.targetChainId;
};

const isTransferInput = (
  transferInput: TransferInput,
): transferInput is ITransferInput => {
  return typeof transferInput.receiver === 'string';
};

const transferInputToPactCommand = (transferInput: TransferInput) => {
  if (isCrossChainInput(transferInput)) {
    return createCrossChainCommand(transferInput);
  }

  if (isTransferInput(transferInput)) {
    return transferCommand(transferInput);
  }

  return transferCreateCommand(transferInput as ICreateTransferInput);
};

const signWithLedger = (
  app: AppKda,
  pactCommand: IUnsignedCommand,
  transferInput: TransferInput,
  derivationPath: string,
) => {
  const ledgerParams = pactToLedger(pactCommand, transferInput, derivationPath);

  if (isCrossChainInput(transferInput)) {
    console.log('WE ARE GOING TO SIGN A CROSS CHAIN TRANSFER');
    return app.signTransferCrossChainTx(ledgerParams);
  }

  if (isTransferInput(transferInput)) {
    console.log('WE ARE GOING TO SIGN A REGULAR TRANSFER');
    return app.signTransferTx(ledgerParams);
  }

  console.log('WE ARE GOING TO SIGN A CREATE TRANSFER');
  return app.signTransferCreateTx(ledgerParams);
};

const sign = async (
  _app: AppKda | null,
  transferInput: TransferInput,
  networkId: string,
  derivationPath: string,
) => {
  // const x = pactToLedger(pactCommand);
  // if (app === null) {
  //   console.log("Make sure you've connected the Ledger device");
  //   return undefined;
  // }

  const transport = await TransportWebHID.create();
  const app = new AppKda(transport);

  console.log('LETS SIGN THIS');

  const pactCommand = createTransaction(
    transferInputToPactCommand(transferInput)({ networkId }),
  );

  // const signed = await app.signTransferTx(
  //   pactToLedger(pactCommand, derivationPath),
  // );
  const signed = await signWithLedger(
    app,
    pactCommand,
    transferInput,
    derivationPath,
  );

  console.log('SIGNED', signed);
  return ledgerToPact(signed, pactCommand);
};

const useLedgerSign = (
  transferInput: TransferInput,
  { networkId, derivationPath }: { networkId: string; derivationPath: string },
) => {
  // const app = useLedgerApp();
  const app = null;
  // return useQuery({
  //   queryKey: ['ledger-sign', pactCommand, app],
  //   queryFn: () => sign(pactCommand!, app!),
  //   enabled: !!pactCommand && !!app,
  // });
  return useAsyncFn(
    () => sign(app, transferInput, networkId, derivationPath),
    [derivationPath, networkId, transferInput],
  );
};

export { useLedgerSign };
