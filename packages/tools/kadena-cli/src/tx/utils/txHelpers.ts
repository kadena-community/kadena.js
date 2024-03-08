import { isAbsolute, join } from 'node:path';

import type { IPactCommand } from '@kadena/client';
import {
  addSignatures,
  createSignWithKeypair,
  isSignedTransaction,
} from '@kadena/client';
import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaSignWithSeed } from '@kadena/hd-wallet';
import {
  kadenaSign as legacyKadenaSign,
  kadenaSignFromRootKey as legacyKadenaSignWithSeed,
} from '@kadena/hd-wallet/chainweaver';
import type { ICommand, IKeyPair, IUnsignedCommand } from '@kadena/types';

import type { IWallet } from '../../keys/utils/keysHelpers.js';
import { getWalletKey } from '../../keys/utils/keysHelpers.js';
import type { IKeyPair as IKeyPairLocal } from '../../keys/utils/storage.js';
import { tx } from '../../prompts/index.js';
import { ICommandSchema } from '../../prompts/tx.js';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import { notEmpty } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';

export interface ICommandData {
  networkId: string;
  chainId: string;
}

/**
 *
 * @param command - The command to check.
 * @returns True if the command is partially signed, false otherwise.
 */
export function isPartiallySignedTransaction(
  command: ICommand | IUnsignedCommand,
): boolean {
  return (
    command.sigs.some((sig) => sig === undefined || sig === null) &&
    command.sigs.some((sig) => sig !== undefined && sig !== null)
  );
}

/**
 *
 * @param command - The command to check the signing status for.
 * @returns An array of objects, each containing a public key and a boolean indicating whether it has signed.
 */

export function getSignersStatus(
  command: ICommand | IUnsignedCommand,
): Array<{ publicKey: string; isSigned: boolean }> {
  const parsedCmd = JSON.parse(command.cmd);
  return parsedCmd.signers.map((signer: { pubKey: string }, index: number) => ({
    publicKey: signer.pubKey,
    isSigned: command.sigs[index]?.sig !== undefined,
  }));
}

export async function getAllTransactions(
  directory: string,
): Promise<{ fileName: string; signed: boolean }[]> {
  try {
    const files = await services.filesystem.readDir(directory);
    // Since naming convention is not enforced, we need to check the content of the files
    const transactionFiles = (
      await Promise.all(
        files.map(async (fileName) => {
          if (!fileName.endsWith('.json')) return null;
          const filePath = join(directory, fileName);
          const content = await services.filesystem.readFile(filePath);
          if (content === null) return null;
          const JSONParsedContent = JSON.parse(content);
          const parsed = ICommandSchema.safeParse(JSONParsedContent);
          if (parsed.success) {
            const isSignedTx = isSignedTransaction(JSONParsedContent);
            return {
              fileName,
              signed: isSignedTx,
            };
          }

          return null;
        }),
      )
    ).filter(notEmpty);

    return transactionFiles;
  } catch (error) {
    log.error(`Error reading transaction directory: ${error}`);
    throw error;
  }
}

export async function getAllTransactionFileNames(
  directory: string,
): Promise<string[]> {
  const transactionFiles = await getAllTransactions(directory);
  return transactionFiles.map((tx) => tx.fileName);
}

/**
 * Retrieves all transaction file names from the transaction directory based on the signature status.
 * @param {boolean} signed - Whether to retrieve signed or unsigned transactions.
 * @returns {Promise<string[]>} A promise that resolves to an array of transaction file names.
 * @throws Throws an error if reading the transaction directory fails.
 */
export async function getTransactions(
  signed: boolean,
  directory: string,
): Promise<string[]> {
  try {
    const transactionFiles = await getAllTransactions(directory);
    return transactionFiles
      .filter((tx) => tx.signed === signed)
      .map((tx) => tx.fileName);
  } catch (error) {
    log.error(`Error reading transaction directory: ${error}`);
    throw error;
  }
}

/**
 * Formats the current date and time into a string with the format 'YYYY-MM-DD-HH:MM'.
 * @returns {string} Formatted date and time string.
 */
export function formatDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}-${hours}:${minutes}`;
}

/**
 * Signs a transaction using the provided wallet seed and password.
 *
 * @param walletContent - The wallet seed.
 * @param password - The password for the wallet.
 * @param unsignedCommands - The command to be signed.
 * @param legacy - Optional flag for legacy signing method.
 * @returns A promise that resolves to a signed command or undefined.
 */
export async function signTransactionsWithSeed(
  wallet: IWallet,
  walletContent: EncryptedString,
  password: string,
  unsignedTransactions: IUnsignedCommand[],
  legacy?: boolean,
): Promise<(ICommand | IUnsignedCommand)[]> {
  try {
    const signedTransactions: (ICommand | IUnsignedCommand)[] = [];

    for (let i = 0; i < unsignedTransactions.length; i++) {
      const unsignedCommand = unsignedTransactions[i];
      const parsedTransaction = JSON.parse(unsignedCommand.cmd);
      const keys = await Promise.all(
        wallet.keys.map((key) => getWalletKey(wallet, key)),
      );
      const relevantKeyPairs = getRelevantKeypairs(parsedTransaction, keys);

      if (relevantKeyPairs.length === 0) {
        log.error(
          `\nNo matching signable keys found for transaction at index ${i} between wallet and transaction.\n`,
        );
        continue;
      }

      const signatures = await Promise.all(
        relevantKeyPairs.map(async (key) => {
          if (typeof key.index !== 'number') {
            throw new Error('Key index not found');
          }
          if (legacy === true) {
            const sigUint8Array = await legacyKadenaSignWithSeed(
              password,
              unsignedCommand.cmd,
              walletContent,
              key.index,
            );
            return {
              sig: Buffer.from(sigUint8Array).toString('hex'),
              pubKey: key.publicKey,
            };
          } else {
            const signWithSeed = kadenaSignWithSeed(
              password,
              walletContent,
              key.index,
            );
            const sigs = await signWithSeed(unsignedCommand.hash);
            return {
              sig: sigs.sig,
              pubKey: key.publicKey,
            };
          }
        }),
      );

      const command = addSignatures(unsignedCommand, ...signatures);
      signedTransactions.push(command);
    }

    return signedTransactions;
  } catch (error) {
    throw new Error(`Error signing transaction: ${error.message}`);
  }
}

/**
 * Signs a set of unsigned transactions using provided key pairs.
 *
 * @param keys - An array of key pairs used for signing transactions.
 * @param unsignedTransactions - An array of transactions that need to be signed.
 * @param legacy - Optional flag indicating whether to use legacy signing method.
 * @returns A promise that resolves to an array of either signed transactions, unchanged unsigned transactions, or undefined in case of errors.
 */

export async function signTransactionWithKeyPair(
  keys: IKeyPairLocal[],
  unsignedTransactions: IUnsignedCommand[],
  legacy?: boolean,
): Promise<(ICommand | IUnsignedCommand)[]> {
  try {
    const signedTransactions: (ICommand | IUnsignedCommand)[] = [];

    for (let i = 0; i < unsignedTransactions.length; i++) {
      const unsignedCommand = unsignedTransactions[i];
      const parsedTransaction = JSON.parse(unsignedCommand.cmd);
      const relevantKeyPairs = getRelevantKeypairs(parsedTransaction, keys);

      if (relevantKeyPairs.length === 0) {
        log.error(
          `\nNo matching signable keys found for transaction at index ${i} between wallet and transaction.\n`,
        );
        continue;
      }

      if (legacy === true) {
        const signatures = await Promise.all(
          relevantKeyPairs.map(async (key) => {
            const sigUint8Array = await legacyKadenaSign(
              '',
              unsignedCommand.cmd,
              key.secretKey as EncryptedString,
            );

            const sig = Buffer.from(sigUint8Array).toString('hex');
            return { sig, pubKey: key.publicKey };
          }),
        );

        const command = addSignatures(unsignedCommand, ...signatures);
        signedTransactions.push(command);
      } else {
        const signWithKeypair = createSignWithKeypair(
          relevantKeyPairs as IKeyPair[],
        );
        const command = await signWithKeypair(unsignedCommand);
        signedTransactions.push(command);
      }
    }
    return signedTransactions;
  } catch (error) {
    throw new Error(`Error signing transaction: ${error.message}`);
  }
}

export function getRelevantKeypairs(
  tx: IPactCommand,
  keypairs: IKeyPairLocal[],
): IKeyPairLocal[] {
  const relevantKeypairs = keypairs.filter((keypair) =>
    tx.signers.some(({ pubKey }) => pubKey === keypair.publicKey),
  );
  return relevantKeypairs;
}

/**
 * retrieve transaction from file
 *
 * @param {string} transactionFile
 * @param {string} path
 * @param {boolean} signed
 * @returns {Promise<IUnsignedCommand | ICommand>}
 * @throws Will throw an error if the file cannot be read or the transaction cannot be processed.
 */
export async function getTransactionFromFile(
  /** absolute path, or relative to process.cwd() if starting with `.` */
  transactionFile: string,
  signed: boolean,
): Promise<IUnsignedCommand | ICommand> {
  try {
    const transactionFilePath = isAbsolute(transactionFile)
      ? transactionFile
      : join(process.cwd(), transactionFile);

    const fileContent = await services.filesystem.readFile(transactionFilePath);

    if (fileContent === null) {
      throw Error(`Failed to read file at path: ${transactionFilePath}`);
    }
    const transaction = JSON.parse(fileContent);
    if (signed) {
      return tx.ISignedCommandSchema.parse(transaction);
    }
    const result = tx.IUnsignedCommandSchema.parse(transaction);
    return result as IUnsignedCommand; // typecast because `IUnsignedCommand` uses undefined instead of null
  } catch (error) {
    log.error(
      `Error processing ${
        signed ? 'signed' : 'unsigned'
      } transaction file: ${transactionFile}, failed with error: ${error}`,
    );

    throw error;
  }
}

/**
 * Assesses the signing status of multiple transaction commands and returns a Promise with a response based on their states.
 *
 * @param commands - An array of command objects to assess. Each command can be a signed, partially signed, or undefined command.
 * @returns A Promise resolving to a CommandResult containing an array of ICommand objects.
 * @throws Error if the commands array is empty, indicating no commands were provided for assessment.
 */

export async function assessTransactionSigningStatus(
  commands: (ICommand | IUnsignedCommand | undefined)[],
): Promise<CommandResult<ICommand[]>> {
  if (commands.length === 0) {
    throw new Error('No commands provided.');
  }

  let allSigned = true;
  const errors: string[] = [];
  const signedCommands: ICommand[] = [];

  for (const command of commands) {
    if (!command) {
      allSigned = false;
      errors.push('One or more transactions failed to sign.');
      continue;
    }

    if (isSignedTransaction(command)) {
      signedCommands.push(command);
    } else {
      allSigned = false;
      if (isPartiallySignedTransaction(command)) {
        const status = getSignersStatus(command);
        const formattedStatus = status
          .map(
            (signerStatus) =>
              `Public Key: ${signerStatus.publicKey}, Signed: ${
                signerStatus.isSigned ? 'Yes' : 'No'
              }`,
          )
          .join('\n');
        errors.push(`Transaction partially signed: ${formattedStatus}`);
      } else {
        errors.push('Transaction is unsigned.');
      }
    }
  }

  return {
    success: allSigned,
    data: signedCommands,
    errors: errors,
  };
}

export async function getTransactionsFromFile(
  /** absolute paths, or relative to process.cwd() if starting with `.` */
  transactionFiles: string[],
  signed: boolean,
): Promise<(IUnsignedCommand | ICommand)[]> {
  const transactions: (IUnsignedCommand | ICommand)[] = [];

  for (const transactionFileName of transactionFiles) {
    const transaction = await getTransactionFromFile(
      transactionFileName,
      signed,
    );

    if (transaction !== undefined && transaction !== null) {
      transactions.push(transaction);
    }
  }

  return transactions;
}

export function parseInput(input: string | string[]): string[] {
  if (Array.isArray(input)) {
    return input;
  }

  if (typeof input === 'string') {
    if (input.trim() === '') {
      return [];
    }
    return input.split(',').map((item) => item.trim());
  }
  return [];
}

export function extractCommandData(
  command: IUnsignedCommand | ICommand,
): ICommandData {
  const payload = JSON.parse(command.cmd);
  const networkId: string = payload.networkId;
  const chainId: string = payload.meta.chainId;

  return { networkId, chainId };
}
