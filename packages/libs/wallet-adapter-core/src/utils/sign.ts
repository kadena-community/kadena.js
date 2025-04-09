/**
 *
 * This file contains helper functions for quicksigning and signing transactions.
 *
 */
import type {
  ICommand,
  IExecutionPayloadObject,
  IPactCommand,
  IQuicksignResponse,
  IQuicksignResponseOutcomes,
  IUnsignedCommand,
} from '@kadena/client';
import { addSignatures } from '@kadena/client';
import { ISigningRequestPartial } from '../types';
import { ERRORS } from './constants';

const isQuicksignResponseOutcomes = (
  response: IQuicksignResponse,
): response is IQuicksignResponseOutcomes => {
  return typeof response === 'object' && 'responses' in response;
};

/**
 * Parses the command string of a transaction into an IPactCommand object.
 *
 * @param transaction - The transaction to parse, either an IUnsignedCommand or ICommand.
 * @returns The parsed transaction as an IPactCommand.
 *
 * @remarks
 * This function extracts the `cmd` field from the provided transaction and parses it using JSON.parse.
 * It assumes that the `cmd` field contains a valid JSON string representing an IPactCommand.
 *
 * @public
 */

export const parseTransactionCommand: (
  transaction: IUnsignedCommand | ICommand,
) => IPactCommand = (transaction) => {
  return 'cmd' in transaction ? JSON.parse(transaction.cmd) : transaction;
};

/**
 * Type guard to determine whether a parsed transaction is an execution command.
 *
 * @param parsedTransaction - The parsed transaction command to evaluate.
 * @returns True if the transaction payload contains the 'exec' property, indicating an execution command.
 *
 * @remarks
 * This function checks if the `payload` property of the parsed transaction has an `exec` key.
 * If true, it narrows the type of the transaction to include IExecutionPayloadObject.
 *
 * @public
 */
export function isExecCommand(
  parsedTransaction: IPactCommand,
): parsedTransaction is IPactCommand & { payload: IExecutionPayloadObject } {
  return 'exec' in parsedTransaction.payload;
}

/**
 * Converts a parsed transaction command into an ISigningRequestPartial object.
 *
 * @param parsedTransaction - The parsed transaction command (IPactCommand) to convert.
 * @returns The ISigningRequestPartial representation of the transaction, ready for signing.
 *
 * @throws Will throw an error if the provided transaction is not an execution command.
 *
 * @remarks
 * This function first verifies that the transaction is an execution command using the isExecCommand type guard.
 * If the verification passes, it extracts relevant properties such as code, data, capabilities (caps),
 * nonce, chainId, gasLimit, gasPrice, sender, and ttl, transforming the transaction into a signing request.
 *
 * @public
 */
export const convertSignRequest = (
  parsedTransaction: IPactCommand,
): ISigningRequestPartial => {
  if (!isExecCommand(parsedTransaction)) {
    throw new Error(ERRORS.CONT_TRANSACTIONS_NOT_SUPPORTED);
  }

  return {
    code: parsedTransaction.payload.exec.code ?? '',
    data: parsedTransaction.payload.exec.data as { [key: string]: unknown },
    caps: parsedTransaction.signers.flatMap((signer) => {
      if (signer.clist === undefined) {
        return [];
      }
      return signer.clist.map(({ name, args }) => {
        const nameArr = name.split('.');
        return {
          role: nameArr[nameArr.length - 1],
          description: `Description for ${name}`,
          cap: {
            name,
            args,
          },
        };
      });
    }),
    nonce: parsedTransaction.nonce,
    chainId: parsedTransaction.meta.chainId,
    gasLimit: parsedTransaction.meta.gasLimit,
    gasPrice: parsedTransaction.meta.gasPrice,
    sender: parsedTransaction.meta.sender,
    ttl: parsedTransaction.meta.ttl,
  };
};

/**
 * Type guard to check if the given transaction is already an ISigningRequestPartial.
 *
 * @param tx - The transaction to check.
 * @returns True if the transaction already conforms to ISigningRequestPartial.
 *
 * @remarks
 * This helper function verifies whether the provided transaction contains the required properties
 * (`code` and `caps`) that define an ISigningRequestPartial. It is used to avoid unnecessary
 * transformations when the transaction is already in the desired format.
 *
 * @public
 */
function isSigningRequestPartial(
  tx: IUnsignedCommand | ICommand | ISigningRequestPartial,
): tx is ISigningRequestPartial {
  return (
    (tx as ISigningRequestPartial).code !== undefined &&
    (tx as ISigningRequestPartial).caps !== undefined
  );
}

/**
 * Prepares the sign command for Wallets.
 *
 * @param transaction - The transaction to be signed. It can be an IUnsignedCommand, ICommand, or ISigningRequestPartial.
 *
 * @returns An ISigningRequestPartial object ready for signing.
 *
 * @remarks
 * This function first checks if the provided transaction is already in the ISigningRequestPartial format.
 * If so, it returns the transaction immediately, avoiding any redundant transformation. Otherwise,
 * it parses the transaction using `parseTransactionCommand` and transforms it via `signRequest`.
 *
 * It is preferred to use the `quicksign` function for signing when possible.
 *
 * @public
 */

export function prepareSignCmd(
  transaction: IUnsignedCommand | ICommand | ISigningRequestPartial,
) {
  if (isSigningRequestPartial(transaction)) {
    return transaction;
  }
  const parsedTransaction = parseTransactionCommand(transaction);
  return convertSignRequest(parsedTransaction);
}

/**
 * Prepares a quick sign command from one or multiple transactions.
 *
 * @param transactionList - A single transaction or an array of transactions
 *                          (IUnsignedCommand or ICommand) to prepare for quick signing.
 * @returns An object containing:
 *   - commandSigDatas: Array of objects with command data and corresponding signatures.
 *   - transactionHashes: Array of transaction hashes.
 *   - transactions: Array of transactions processed.
 *   - isList: Boolean indicating if the original input was an array.
 *
 * @throws \{Error\} If no transaction is provided or if there is a network mismatch between transactions.
 *
 * @remarks
 * The function ensures that all transactions belong to the same network. It extracts the
 * necessary command data and signatures from each transaction, building a list of commands
 * for quick signing. This is useful when you need to prepare one or more transactions for
 * processing via a quick-sign mechanism.
 *
 * @public
 */
export const prepareQuickSignCmd = async (
  transactionList: IUnsignedCommand | Array<IUnsignedCommand | ICommand>,
) => {
  if (!transactionList) {
    throw new Error(ERRORS.NO_TRANSACTIONS_TO_SIGN);
  }

  const transactions = Array.isArray(transactionList)
    ? transactionList
    : [transactionList];

  const { networkId: baseNetworkId } = parseTransactionCommand(transactions[0]);
  const commandSigDatas = transactions.map((pactCommand) => {
    const { cmd, sigs } = pactCommand;
    const parsedTransaction = parseTransactionCommand(pactCommand);

    if (baseNetworkId !== parsedTransaction.networkId) {
      throw new Error(ERRORS.NETWORK_MISMATCH);
    }
    return {
      cmd,
      sigs: parsedTransaction.signers.map((signer, i) => ({
        pubKey: signer.pubKey,
        sig: sigs[i]?.sig ?? null,
      })),
    };
  });

  const transactionHashes = transactions.map((tx) => tx.hash);

  return {
    commandSigDatas,
    transactionHashes,
    transactions,
    isList: Array.isArray(transactionList),
  };
};

/**
 * Finalizes transactions by applying wallet signatures from a quick sign response.
 *
 * @param response - The quick sign response containing signed command data.
 * @param transactionHashes - An array of original transaction hashes.
 * @param transactions - An array of transactions (IUnsignedCommand or ICommand) to update with signatures.
 * @param isList - A boolean flag indicating if the original input was a list of transactions.
 *
 * @returns The updated transaction if a single transaction was provided, or the array of updated transactions.
 *
 * @throws Will throw an error if the response is missing, indicates a failure,
 *         if the responses property is not an array, or if any transaction hash does not match.
 *
 * @remarks
 * This function validates the quick sign response by ensuring it has a successful status and that
 * the response contains an array of signed command outcomes. For each successful outcome, it verifies
 * that the outcome hash matches the corresponding transaction hash. The function then uses the
 * `addSignatures` helper to add the received signatures to the respective transaction.
 *
 * @public
 */
export const finalizeQuickSignTransaction = (
  response: IQuicksignResponse,
  transactionHashes: string[],
  transactions: (IUnsignedCommand | ICommand)[],
  isList: boolean,
) => {
  if (!isQuicksignResponseOutcomes(response)) {
    throw new Error(ERRORS.ERROR_SIGNING_TRANSACTION);
  }

  const responses = response.responses;
  if (!Array.isArray(responses)) {
    throw new Error(ERRORS.ERROR_SIGNING_TRANSACTION);
  }

  responses.forEach((signedCommand, i) => {
    if (signedCommand.outcome.result === 'success') {
      if (signedCommand.outcome.hash !== transactionHashes[i]) {
        throw new Error(
          ERRORS.TRANSACTION_HASH_MISMATCH(
            transactionHashes[i],
            signedCommand.outcome.hash,
          ),
        );
      }

      const sigs = signedCommand.commandSigData.sigs.filter(
        (sig) => sig.sig !== null,
      ) as {
        pubKey: string;
        sig: string;
      }[];

      // Add the signature(s) received from the wallet to the transaction.
      transactions[i] = addSignatures(transactions[i], ...sigs);
    }
  });

  return isList ? transactions : transactions[0];
};
