import type { IPactCommand } from '@kadena/client';
import {
  addSignatures,
  createSignWithKeypair,
  isSignedTransaction,
} from '@kadena/client';
import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaDecrypt, kadenaSignWithSeed } from '@kadena/hd-wallet';
import {
  kadenaSign as legacyKadenaSign,
  kadenaSignFromRootKey as legacyKadenaSignWithSeed,
} from '@kadena/hd-wallet/chainweaver';
import type { ICommand, IKeyPair, IUnsignedCommand } from '@kadena/types';

import { join } from 'path';
import { TRANSACTION_PATH } from '../../constants/config.js';
import {
  getKeyPairAndIndicesFromFileSystem,
  toHexStr,
} from '../../keys/utils/keysHelpers.js';
import type { IKeyPair as IKeyPairLocal } from '../../keys/utils/storage.js';

import { services } from '../../services/index.js';

import { tx } from '../../prompts/index.js';
import type { CommandResult } from '../../utils/command.util.js';

/**
 *
 * @param command - The command to check.
 * @returns True if the command is partially signed, false otherwise.
 */
export function isPartiallySignedTransaction(
  command: ICommand | IUnsignedCommand,
): boolean {
  return (
    command.sigs.some((sig) => sig === undefined) &&
    command.sigs.some((sig) => sig !== undefined)
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

/**
 * Retrieves all transaction file names from the transaction directory based on the signature status.
 * @param {boolean} signed - Whether to retrieve signed or unsigned transactions.
 * @returns {Promise<string[]>} A promise that resolves to an array of transaction file names.
 * @throws Throws an error if reading the transaction directory fails.
 */
export async function getTransactions(
  signed: boolean,
  path: string,
): Promise<string[]> {
  try {
    const filePath = path ? `${process.cwd()}/${path}` : TRANSACTION_PATH;
    const files = await services.filesystem.readDir(filePath);
    return files.filter((file) => signed === file.includes('-signed'));
  } catch (error) {
    console.error(`Error reading transaction directory: ${error}`);
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
 * Creates a function to decrypt secret keys using the provided password.
 * @param {string} password - The password used for decryption.
 * @param {EncryptedString} encrypted - The encrypted string to be decrypted.
 * @returns {string}
 */
export function decryptSecretKeys(
  password: string,
  encrypted: EncryptedString,
): string {
  return toHexStr(kadenaDecrypt(password, encrypted));
}

/**
 * Signs a transaction using the provided wallet seed and password.
 *
 * @param wallet - The wallet seed.
 * @param password - The password for the wallet.
 * @param unsignedCommand - The command to be signed.
 * @param legacy - Optional flag for legacy signing method.
 * @returns A promise that resolves to a signed command or undefined.
 */
export async function signTransactionWithSeed(
  walletName: string,
  wallet: EncryptedString,
  password: string,
  unsignedCommand: IUnsignedCommand,
  legacy?: boolean,
): Promise<ICommand | IUnsignedCommand | undefined> {
  try {
    let command: ICommand | IUnsignedCommand;
    const parsedTransaction = JSON.parse(unsignedCommand.cmd);
    const keys = await getKeyPairAndIndicesFromFileSystem(walletName);
    const relevantKeyPairs = getRelevantKeypairs(parsedTransaction, keys);

    if (relevantKeyPairs.length === 0) {
      throw new Error(
        'No matching signable keys found between wallet and transaction:',
      );
    }

    if (legacy === true) {
      const signatures = await Promise.all(
        relevantKeyPairs.map(async (key) => {
          const sigUint8Array = await legacyKadenaSignWithSeed(
            password,
            unsignedCommand.cmd,
            wallet,
            key.index as number,
          );

          return {
            sig: Buffer.from(sigUint8Array).toString('hex'),
            pubKey: key.publicKey,
          };
        }),
      );
      command = addSignatures(unsignedCommand, ...signatures);
    } else {
      const signatures = relevantKeyPairs.map((key) => {
        const signWithSeed = kadenaSignWithSeed(
          password,
          wallet,
          key.index as number,
        );

        const sigs = signWithSeed(unsignedCommand.hash);

        return {
          sig: sigs.sig,
          pubKey: key.publicKey,
        };
      });

      command = addSignatures(unsignedCommand, ...signatures);
    }

    if (isSignedTransaction(command)) {
      return command;
    }
    return command;
  } catch (error) {
    throw new Error(`Error signing transaction: ${error.message}`);
  }
}

export async function signTransactionWithKeyPair(
  keys: IKeyPairLocal[],
  unsignedCommand: IUnsignedCommand,
  legacy?: boolean,
): Promise<ICommand | IUnsignedCommand | undefined> {
  let command: ICommand | IUnsignedCommand;

  try {
    if (legacy === true) {
      const parsedTransaction = JSON.parse(unsignedCommand.cmd);
      const relevantKeyPairs = getRelevantKeypairs(parsedTransaction, keys);

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

      command = addSignatures(unsignedCommand, ...signatures);
    } else {
      const signWithKeypair = createSignWithKeypair(keys as IKeyPair[]);
      command = await signWithKeypair(unsignedCommand);
    }

    if (isSignedTransaction(command)) {
      return command;
    }
    return command;
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
 * @param {string} transactionFile - The name of the file containing the transaction.
 * @param {string} path - The path to the directory containing the transaction file.
 * @param {boolean} signed - A flag indicating whether the transaction is signed.
 * @returns {Promise<IUnsignedCommand | ICommand>} A promise that resolves to the unsigned or signed transaction.
 * @throws Will throw an error if the file cannot be read or the transaction cannot be processed.
 */
export async function getTransactionFromFile(
  transactionFile: string,
  signed: boolean,
  path?: string,
): Promise<IUnsignedCommand | ICommand> {
  try {
    const filePath =
      path !== undefined
        ? join(process.cwd(), path, transactionFile)
        : join(TRANSACTION_PATH, transactionFile);
    const transactionFilePath = join(TRANSACTION_PATH, transactionFile);
    const fileContent = await services.filesystem.readFile(filePath);

    if (fileContent === null) {
      throw Error(`Failed to read file at path: ${transactionFilePath}`);
    }
    const transaction = JSON.parse(fileContent);

    if (signed) {
      tx.ICommandSchema.parse(transaction);
      return transaction as ICommand;
    }
    tx.IUnsignedCommandSchema.parse(transaction);
    return transaction as IUnsignedCommand;
  } catch (error) {
    console.error(
      `Error processing ${
        signed ? 'signed' : 'unsigned'
      } transaction file: ${transactionFile}, failed with error: ${error}`,
    );

    throw error;
  }
}

/**
 * Assesses the signing status of a transaction and returns a Promise of a response based on its state.
 *
 * @param signedCommand - The command object to assess. It can be a signed, partially signed, or undefined command.
 * @returns A Promise resolving to a CommandResult<ICommand>, indicating the success status and,
 *          if applicable, either the signed command data or error messages.
 *          If the command is fully signed, resolves with success and the command data.
 *          If the command is partially signed or unsigned, resolves with failure and appropriate error messages.
 * @throws Error if the signedCommand is undefined, indicating a failure in the signing process.
 */
export async function assessTransactionSigningStatus(
  signedCommand: ICommand | IUnsignedCommand | undefined,
): Promise<CommandResult<ICommand>> {
  if (!signedCommand) {
    throw new Error(
      'Error in action: signing failed, please check your transaction.',
    );
  }

  if (isSignedTransaction(signedCommand)) {
    return {
      success: true,
      data: signedCommand,
    };
  }

  if (isPartiallySignedTransaction(signedCommand)) {
    const status = getSignersStatus(signedCommand);

    const formattedStatus = status
      .map(
        (signerStatus) =>
          `Public Key: ${signerStatus.publicKey}, Signed: ${
            signerStatus.isSigned ? 'Yes' : 'No'
          }`,
      )
      .join('\n');

    return {
      success: false,
      errors: [
        `Error in action: transaction partially signed. Please provide the remaining keys.`,
        `Key status for transaction:\n${formattedStatus}`,
      ],
    };
  }

  return {
    success: false,
    errors: ['Error in action: transaction is unsigned.'],
  };
}
