import type { IExecutionPayloadObject, IPactCommand } from '@kadena/client';
import { createTransaction, isSignedTransaction } from '@kadena/client';
import type {
  createCrossChainCommand,
  transferCommand,
  transferCreateCommand,
} from '@kadena/client-utils/coin';
import { PactNumber } from '@kadena/pactjs';
import type { ICommand, IUnsignedCommand } from '@kadena/types';
import type {
  BuildTransactionResult,
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

const pactToLedger = (pactCommand: IUnsignedCommand): TransferTxParams => {
  const parsedTransaction = parseTransactionCommand(pactCommand);

  const payload = parsedTransaction.payload as IExecutionPayloadObject;

  const { recipient, amount } = parsePayloadCode(payload.exec.code);
  const pactAmount = new PactNumber(amount).toPactDecimal();

  console.log('pactToledger', {
    parsedTransaction,
    pactCommand,
    code: payload.exec.code,
    recipient,
    amount: pactAmount.decimal,
    chainId: parseInt(parsedTransaction.meta.chainId, 10),
    network: parsedTransaction.networkId,
  });

  const keyId = '0';
  return {
    path: `m/44'/626'/${keyId}'/0/0`,
    recipient,
    amount: pactAmount.decimal,
    chainId: parseInt(parsedTransaction.meta.chainId, 10),
    network: parsedTransaction.networkId,
  };
};
const ledgerToPact = (
  ledgerCommand: BuildTransactionResult,
  pactCommand: ICommand | IUnsignedCommand,
): ICommand | IUnsignedCommand => {
  pactCommand.sigs = ledgerCommand.pact_command.sigs;
  // return pactCommand;

  console.log('ledgerToPact', {
    isSignedTransaction: isSignedTransaction(pactCommand),
  });

  return ledgerCommand.pact_command;
};

const sign = async (
  pactCommand: IUnsignedCommand, // PactCommand | IUnsignedCommand
  _app: AppKda | null,
): Promise<ICommand | IUnsignedCommand | undefined> => {
  // const x = pactToLedger(pactCommand);
  // if (app === null) {
  //   console.log("Make sure you've connected the Ledger device");
  //   return undefined;
  // }
  const transport = await TransportWebHID.create();
  const app = new AppKda(transport);

  console.log('LETS SIGN THIS');

  const signed = await app.signTransferTx(pactToLedger(pactCommand));

  console.log('SIGNED', signed);
  return ledgerToPact(signed, pactCommand);
};

type ITransferInput = Parameters<typeof transferCommand>;
type ICreateTransferInput = Parameters<typeof transferCreateCommand>;
type ICrossChainInput = Parameters<typeof createCrossChainCommand>;

const useLedgerSign = (pactCommand: ReturnType<typeof transferCommand>) => {
  // const app = useLedgerApp();
  const app = null;
  // return useQuery({
  //   queryKey: ['ledger-sign', pactCommand, app],
  //   queryFn: () => sign(pactCommand!, app!),
  //   enabled: !!pactCommand && !!app,
  // });
  return useAsyncFn(
    () => sign(createTransaction(pactCommand({ networkId: 'testnet04' })), app),
    [app, pactCommand],
  );
};

export { useLedgerSign };
