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
import type {
  ICommand,
  ICommandPayload,
  IKeyPair,
  IUnsignedCommand,
} from '@kadena/types';

import path, { isAbsolute, join } from 'path';
import { z } from 'zod';
import { TX_TEMPLATE_FOLDER } from '../../constants/config.js';
import { ICommandSchema } from '../../prompts/tx.js';
import { services } from '../../services/index.js';
import type {
  IWallet,
  IWalletKey,
  IWalletKeyPair,
} from '../../services/wallet/wallet.types.js';
import type { CommandResult } from '../../utils/command.util.js';
import { isNotEmptyString, notEmpty } from '../../utils/globalHelpers.js';
import { log } from '../../utils/logger.js';
import { createTable } from '../../utils/table.js';
import type { ISavedTransaction } from './storage.js';

export interface ICommandData {
  networkId: string;
  chainId: string;
}

export interface IWalletWithKey {
  wallet: IWallet;
  relevantKeyPairs: IWalletKey[];
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

export async function signTransactionWithWallet(
  wallet: IWallet,
  password: string,
  unsignedTransaction: IUnsignedCommand,
  relevantKeyPairs: IWalletKey[] = [],
): Promise<ICommand | IUnsignedCommand> {
  try {
    const signatures = await Promise.all(
      relevantKeyPairs.map(async (key) => {
        if (typeof key.index !== 'number') {
          throw new Error('Key index not found');
        }
        if (wallet.legacy === true) {
          const sigUint8Array = await legacyKadenaSignWithSeed(
            password,
            unsignedTransaction.cmd,
            wallet.seed,
            key.index,
          );
          return {
            sig: Buffer.from(sigUint8Array).toString('hex'),
            pubKey: key.publicKey,
          };
        } else {
          const signWithSeed = kadenaSignWithSeed(
            password,
            wallet.seed,
            key.index,
          );
          const sigs = await signWithSeed(unsignedTransaction.hash);
          return {
            sig: sigs.sig,
            pubKey: key.publicKey,
          };
        }
      }),
    );

    return addSignatures(unsignedTransaction, ...signatures);
  } catch (error) {
    if (error.message === 'Decryption failed') {
      throw new Error(
        'Incorrect password. Please verify the password and try again.',
      );
    }
    log.error(`Error signing transaction: ${error.message}`);
    return unsignedTransaction;
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
  keys: IWalletKeyPair[],
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

export function getRelevantKeypairs<T extends { publicKey: string }>(
  tx: IPactCommand,
  keypairs: T[],
): T[] {
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
    const parsedTransaction = ICommandSchema.parse(transaction);
    if (signed) {
      const isSignedTx = isSignedTransaction(transaction);
      if (!isSignedTx) {
        throw Error(`${transactionFile} is not a signed transaction`);
      }
      return parsedTransaction as ICommand;
    }
    return parsedTransaction as IUnsignedCommand; // typecast because `IUnsignedCommand` uses undefined instead of null;
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

  let commandStatus: 'error' | 'success' | 'partial' = 'success';
  const errors: string[] = [];
  const warnings: string[] = [];
  const signedCommands: ICommand[] = [];
  const partiallySignedTransactions: string[] = [];

  for (const command of commands) {
    if (!command) {
      commandStatus = 'error';
      errors.push('One or more transactions failed to sign.');
      continue;
    }

    if (isSignedTransaction(command)) {
      if (commandStatus === 'error') {
        commandStatus = 'partial';
      }
      signedCommands.push(command);
    } else if (isPartiallySignedTransaction(command)) {
      commandStatus = 'partial';
      const status = getSignersStatus(command);
      const formattedStatus = status
        .map(
          (signerStatus) =>
            ` Public Key: ${signerStatus.publicKey}, Signed: ${
              signerStatus.isSigned ? 'Yes' : 'No'
            }`,
        )
        .join('\n');

      warnings.push(
        `Transaction with hash: ${command.hash} is partially signed:\n${formattedStatus}`,
      );
      partiallySignedTransactions.push(
        `transaction-${command.hash.slice(0, 10)}-partial.json`,
      );
    } else {
      errors.push(
        `Transaction with hash: ${command.hash} is skipped because no matching keys within wallet(s) were found and left unsigned.`,
      );
    }
  }

  if (partiallySignedTransactions.length > 0) {
    const commandString = `\n kadena tx sign --tx-unsigned-transaction-files="${partiallySignedTransactions.join(
      ',',
    )}"`;
    warnings.push(
      `\n\nTo sign the partially signed transactions, now run the follow-up command:${commandString}`,
    );
  }

  if (
    commandStatus === 'success' &&
    errors.length === 0 &&
    warnings.length === 0
  ) {
    return { status: 'success', data: signedCommands, warnings };
  } else if (commandStatus === 'error' && errors.length > 0) {
    return { status: 'error', errors, warnings };
  } else {
    return { status: 'partial', data: signedCommands, errors, warnings };
  }
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

export const REQUEST_KEY_MAX_LENGTH = 44;
export const REQUEST_KEY_MIN_LENGTH = 43;

export const requestKeyValidation = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (val.length === REQUEST_KEY_MAX_LENGTH) {
        return val[val.length - 1] === '=';
      }
      return val.length === REQUEST_KEY_MIN_LENGTH;
    },
    {
      message: 'Request key is invalid. Please provide a valid request key.',
    },
  );

export async function getWalletsAndKeysForSigning(
  unsignedTransactions: IUnsignedCommand[],
): Promise<IWalletWithKey[]> {
  const wallets = await services.wallet.list();
  const foundWalletsWithKeys: IWalletWithKey[] = [];

  for (const wallet of wallets) {
    if (wallet !== null) {
      for (const command of unsignedTransactions) {
        try {
          const commandObj = JSON.parse(command.cmd) as IPactCommand;
          const signers = commandObj?.signers ?? [];
          const { relevantKeyPairs } =
            await extractRelevantWalletAndKeyPairsFromCommand(command, wallet);

          const unsignedRelevantKeyPairs = relevantKeyPairs.filter(
            (keyPair) => {
              const signerIndex = signers.findIndex(
                (signer) => signer.pubKey === keyPair.publicKey,
              );
              const sig = command.sigs[signerIndex];
              // Check sig for this signer if null or undefined -> not signed
              return sig === null || sig === undefined;
            },
          );

          if (unsignedRelevantKeyPairs.length > 0) {
            const existingEntry = foundWalletsWithKeys.find(
              (entry) => entry.wallet === wallet,
            );
            if (existingEntry) {
              existingEntry.relevantKeyPairs = [
                ...new Set([
                  ...existingEntry.relevantKeyPairs,
                  ...unsignedRelevantKeyPairs,
                ]),
              ];
            } else {
              foundWalletsWithKeys.push({
                wallet: wallet,
                relevantKeyPairs: unsignedRelevantKeyPairs,
              });
            }
          }
        } catch (error) {
          log.error(`Error processing wallet ${wallet} for command:`, error);
        }
      }
    }
  }

  return foundWalletsWithKeys;
}

export async function extractRelevantWalletAndKeyPairsFromCommand(
  command: IUnsignedCommand,
  wallet: IWallet,
): Promise<IWalletWithKey> {
  try {
    const parsedTransaction = JSON.parse(command.cmd);

    const relevantKeyPairs = getRelevantKeypairs(
      parsedTransaction,
      wallet.keys,
    );

    return {
      wallet,
      relevantKeyPairs,
    };
  } catch (error) {
    throw new Error('An error occurred while extracting key pairs.');
  }
}

export async function filterRelevantUnsignedCommandsForWallet(
  unsignedCommands: IUnsignedCommand[],
  walletWithKey?: IWalletWithKey,
): Promise<{
  unsignedCommands: IUnsignedCommand[];
  skippedCommands: IUnsignedCommand[];
  relevantKeyPairs: IWalletKey[];
}> {
  const wallet = walletWithKey;

  if (!wallet) {
    log.error(`Wallet named '${wallet}' not found.`);
    return {
      unsignedCommands: [],
      skippedCommands: [...unsignedCommands],
      relevantKeyPairs: [],
    };
  }

  const walletPublicKeys = wallet.relevantKeyPairs.map(
    (keyPair) => keyPair.publicKey,
  );

  const skippedCommands: IUnsignedCommand[] = [];
  const relevantUnsignedCommands: IUnsignedCommand[] = [];
  const relevantKeyPairs: IWalletKey[] = [];

  unsignedCommands.forEach((command) => {
    const commandObj = JSON.parse(command.cmd) as IPactCommand;
    const signerPublicKeys = commandObj.signers.map((signer) => signer.pubKey);
    const isRelevant = signerPublicKeys.some((pubKey) =>
      walletPublicKeys.includes(pubKey),
    );

    if (isRelevant) {
      relevantUnsignedCommands.push(command);
      signerPublicKeys.forEach((pubKey) => {
        const keyPair = wallet.relevantKeyPairs.find(
          (kp) => kp.publicKey === pubKey,
        );
        if (keyPair && !relevantKeyPairs.includes(keyPair)) {
          relevantKeyPairs.push(keyPair);
        }
      });
    } else {
      skippedCommands.push(command);
    }
  });

  return {
    unsignedCommands: relevantUnsignedCommands,
    skippedCommands,
    relevantKeyPairs,
  };
}

export function processSigningStatus(
  savedTransactions: ISavedTransaction[],
  signingStatus: CommandResult<ICommand[]>,
): CommandResult<{ commands: { command: ICommand; path: string }[] }> {
  if (
    signingStatus.status === 'success' ||
    signingStatus.status === 'partial'
  ) {
    const commands = savedTransactions
      .filter(
        (tx) => signingStatus.status === 'success' || tx.state === 'signed',
      )
      .map((tx) => ({
        command: tx.command as ICommand,
        path: tx.filePath,
      }));

    if (signingStatus.status === 'partial') {
      return {
        status: 'partial',
        data: { commands },
        errors: signingStatus.errors,
        warnings: signingStatus.warnings,
      };
    } else {
      return {
        status: 'success',
        data: { commands },
        warnings: signingStatus.warnings,
      };
    }
  } else {
    return {
      status: 'error',
      errors: signingStatus.errors,
      warnings: signingStatus.warnings,
    };
  }
}

export function displaySignersFromUnsignedCommands(
  unsignedCommands: IUnsignedCommand[],
): void {
  unsignedCommands.forEach((unsignedCommand, index) => {
    const command: IPactCommand = JSON.parse(unsignedCommand.cmd);

    const table = createTable({ head: ['Public Key', 'Capabilities'] });

    table.push(
      ...command.signers.map((signer) => [
        signer.pubKey,
        (signer.clist || [])
          .map(
            (capability) => `${capability.name}(${capability.args.join(', ')})`,
          )
          .join('\n'),
      ]),
    );

    log.info(
      `Command ${index + 1} (hash: ${
        unsignedCommand.hash
      }) will now be signed with the following signers:`,
    );
    log.output(table.toString(), command.signers);
  });
}

export async function logTransactionDetails(command: ICommand): Promise<void> {
  const table = createTable({ head: ['Network ID', 'Chain ID'] });

  try {
    const cmdPayload: ICommandPayload = JSON.parse(command.cmd);
    const networkId = cmdPayload.networkId ?? 'N/A';
    const chainId = cmdPayload.meta.chainId ?? 'N/A';
    const hash = command.hash ?? 'N/A';

    table.push([networkId, chainId]);

    if (table.length > 0) {
      log.info(
        log.color.green(`\nTransaction detail for command with hash: ${hash}`),
      );

      log.output(table.toString(), command);
      log.info('\n\n');
    } else {
      log.info(`No transaction details to display for hash: ${hash}`);
    }
  } catch (error) {
    log.info(`No transaction details to display`);
  }
}

export const getTxTemplateDirectory = (): string | null => {
  const kadenaDir = services.config.getDirectory();
  return isNotEmptyString(kadenaDir)
    ? path.join(kadenaDir, TX_TEMPLATE_FOLDER)
    : null;
};
