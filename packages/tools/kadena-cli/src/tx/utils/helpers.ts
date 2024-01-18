import type { IPactCommand } from '@kadena/client';
// import { createSignWithKeypair, Sign } from '@kadena/client';
import { addSignatures, createSignWithKeypair } from '@kadena/client';
import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaDecrypt, kadenaSignWithSeed } from '@kadena/hd-wallet';
import { kadenaSign as legacyKadenaSign } from '@kadena/hd-wallet/chainweaver';
import type { ICommand, IKeyPair, IUnsignedCommand } from '@kadena/types';

import { join } from 'path';
import { TRANSACTION_DIR, WALLET_DIR } from '../../constants/config.js';
import {
  getKeysFromWallet,
  getLegacyKeysFromWallet,
  toHexStr,
} from '../../keys/utils/keysHelpers.js';
import type {
  IKeyPair as IKeyPairLocal,
  TSeedContent,
} from '../../keys/utils/storage.js';
import { readKeyFileContent } from '../../keys/utils/storage.js';
import { services } from '../../services/index.js';

/**
 * Retrieves all transaction file names from the transaction directory based on the signature status.
 * @param {boolean} signed - Whether to retrieve signed or unsigned transactions.
 * @returns {Promise<string[]>} A promise that resolves to an array of transaction file names.
 * @throws Throws an error if reading the transaction directory fails.
 */
export async function getTransactions(signed: boolean): Promise<string[]> {
  try {
    const files = await services.filesystem.readDir(TRANSACTION_DIR);
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
 * Helper function to check if an object is of type ICommand
 * @param {ICommand | IUnsignedCommand} obj - The object to check.
 * @returns {boolean} True if the object is of type ICommand, false otherwise.
 */
function isCommand(obj: ICommand | IUnsignedCommand): obj is ICommand {
  return (
    obj !== undefined &&
    typeof obj === 'object' &&
    'cmd' in obj &&
    'hash' in obj &&
    'sigs' in obj &&
    obj.sigs.every((sig) => sig !== undefined && sig !== null)
  );
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
): Promise<ICommand | undefined> {
  try {
    let signedCommand: ICommand | IUnsignedCommand;
    if (legacy === true) {
      console.log('legacy signing');
    } else {
      const parsedTransaction = JSON.parse(unsignedCommand.cmd);
      const keys = await getPublicKeysAndIndicesFromFileSystem(walletName);
      const relevantKeyPairs = getRelevantKeypairs(parsedTransaction, keys);

      const signatures = await Promise.all(
        relevantKeyPairs
          .filter((key) => key.index !== undefined)
          .map(async (key) => {
            const sig = kadenaSignWithSeed(
              password,
              wallet,
              key.index as number,
            );
            return sig(unsignedCommand.hash);
          }),
      );
      signedCommand = addSignatures(unsignedCommand, ...signatures);
    }

    if (isCommand(signedCommand)) {
      return signedCommand;
    } else {
      return undefined;
    }
  } catch (error) {
    throw new Error(`Error signing transaction: ${error.message}`);
  }
}

export async function signTransactionWithKeyPair(
  keys: IKeyPairLocal[],
  unsignedCommand: IUnsignedCommand,
  legacy?: boolean,
): Promise<ICommand | undefined> {
  let signedCommand: ICommand | IUnsignedCommand;

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

      signedCommand = addSignatures(unsignedCommand, ...signatures);
    } else {
      const signWithKeypair = createSignWithKeypair(keys as IKeyPair[]);
      signedCommand = await signWithKeypair(unsignedCommand);
    }

    if (isCommand(signedCommand)) {
      return signedCommand;
    } else {
      return undefined;
    }
  } catch (error) {
    throw new Error(`Error signing transaction: ${error.message}`);
  }
}

/**
 * Retrieves wallet directories, optionally filtering by wallet name.
 * @param {string} [walletName] - Optional name of the wallet.
 * @returns {Promise<string[]>}
 */
export async function getWalletDirectories(
  walletName?: string,
): Promise<string[]> {
  if (walletName !== undefined) {
    return [walletName];
  }
  return services.filesystem.readDir(WALLET_DIR);
}

/**
 * Retrieves key file names from the specified directory.
 * @param {string} dirName - The name of the directory to search.
 * @returns {Promise<string[]>}
 */
export async function getKeyFilesFromDirectory(
  dirName: string,
): Promise<string[]> {
  const keyFiles = await getKeysFromWallet(dirName);
  const legacyKeyFiles = await getLegacyKeysFromWallet(dirName);
  return [...keyFiles, ...legacyKeyFiles];
}

/**
 * Finds and returns a secret key matching any of the provided public keys.
 * @param {string[]} publicKeys - Array of public keys to match.
 * @param {string} walletDir - The wallet directory to search in.
 * @param {string} keyFile - The key file to check.
 * @returns {Promise<{ publicKey: string; secretKey: EncryptedString } | null>}
 */
export async function getSecretKeyIfMatch(
  publicKeys: string[],
  walletDir: string,
  keyFile: string,
  // eslint-disable-next-line @rushstack/no-new-null
): Promise<{ publicKey: string; secretKey: EncryptedString } | null> {
  const keyContent: TSeedContent | IKeyPairLocal | undefined =
    await readKeyFileContent(join(walletDir, keyFile));
  if (
    keyContent !== undefined &&
    typeof keyContent !== 'string' &&
    publicKeys.includes(keyContent.publicKey)
  ) {
    return {
      publicKey: keyContent.publicKey,
      secretKey: keyContent.secretKey as EncryptedString,
    };
  }
  return null;
}

/**
 * Finds secret keys corresponding to the provided public keys.
 * @param {string[]} publicKeys - Array of public keys to find secret keys for.
 * @param {string} [walletName] - Optional name of the wallet.
 * @returns {Promise<Map<string, EncryptedString | undefined>>}
 */
export async function findSecretKeys(
  publicKeys: string[],
  walletName?: string,
): Promise<Map<string, EncryptedString | undefined>> {
  const walletDirs = await getWalletDirectories(walletName);
  const secretKeysMap = new Map<string, EncryptedString | undefined>();

  for (const dirName of walletDirs) {
    const walletDir = join(WALLET_DIR, dirName);
    if (!(await services.filesystem.directoryExists(walletDir))) {
      continue;
    }

    const keyFiles = await getKeyFilesFromDirectory(dirName);
    const keyPromises = keyFiles.map((keyFile) =>
      getSecretKeyIfMatch(publicKeys, walletDir, keyFile),
    );
    const keys = await Promise.all(keyPromises);

    keys.forEach((key) => {
      if (key && !secretKeysMap.has(key.publicKey)) {
        secretKeysMap.set(key.publicKey, key.secretKey);
      }
    });
  }

  return secretKeysMap;
}

/**
 * Finds key pairs by their public keys.
 * @param {string[]} publicKeys - Array of public keys to find matching key pairs for.
 * @param {string} [walletName] - Optional name of the wallet.
 * @returns {Promise<IKeyPairLocal[]>}
 */
export async function findKeyPairsByPublicKeys(
  publicKeys: string[],
  walletName?: string,
): Promise<IKeyPairLocal[]> {
  const keyPairs: IKeyPairLocal[] = [];
  const secretKeysMap = await findSecretKeys(publicKeys, walletName);

  publicKeys.forEach((publicKey) => {
    const secretKey = secretKeysMap.get(publicKey);
    if (secretKey !== undefined) {
      keyPairs.push({ publicKey, secretKey });
    }
  });

  return keyPairs;
}

/**
 * Extracts public keys from a transaction command string.
 * @param {string} cmd - The transaction command string.
 * @returns {string[]}
 */
export function extractPublicKeysFromTransactionCmd(cmd: string): string[] {
  try {
    const transaction: IPactCommand = JSON.parse(cmd);
    return transaction.signers.map((signer) => signer.pubKey);
  } catch (e) {
    console.error(`Error: ${e}`);
    return [];
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
 * retrieves key pairs used as signers for a transaction from an HD wallet.
 * @param {string} cmd - The transaction command string.
 * @param {string} [walletName] - Optional name of the wallet.
 * @returns {Promise<IKeyPairLocal[]>}
 */
export async function getSignersFromTransactionHd(
  cmd: string,
  walletName?: string,
): Promise<IKeyPairLocal[]> {
  const publicKeys = extractPublicKeysFromTransactionCmd(cmd);
  const signers = await findKeyPairsByPublicKeys(publicKeys, walletName);

  return signers;
}

/**
 * Reads a key file and extracts the public key and index.
 * @param {string} walletDir - The directory of the wallet.
 * @param {string} keyFile - The key file name.
 * @returns {Promise<IKeyPairLocal | undefined>}
 */
export async function getPublicKeyAndIndexFromFile(
  walletDir: string,
  keyFile: string,
): Promise<IKeyPairLocal | undefined> {
  const keyContent = (await readKeyFileContent(join(walletDir, keyFile))) as
    | IKeyPairLocal
    | undefined;

  if (
    keyContent !== undefined &&
    'publicKey' in keyContent &&
    'index' in keyContent
  ) {
    return {
      publicKey: keyContent.publicKey,
      index: keyContent.index,
    };
  }

  return undefined;
}

/**
 * Retrieves public keys and their indices from the file system within the specified wallet directories.
 * @param {string} [walletName] - Optional name of the wallet.
 * @returns {Promise<Array<IKeyPairLocal>>}
 */
export async function getPublicKeysAndIndicesFromFileSystem(
  walletName?: string,
): Promise<Array<IKeyPairLocal>> {
  const walletDirs = await getWalletDirectories(walletName);
  const publicKeysAndIndices: Array<IKeyPairLocal> = [];

  for (const dirName of walletDirs) {
    const walletDir = join(WALLET_DIR, dirName);
    if (!(await services.filesystem.directoryExists(walletDir))) {
      continue;
    }

    const keyFiles = await getKeyFilesFromDirectory(dirName);
    const publicKeyPromises = keyFiles.map((keyFile) =>
      getPublicKeyAndIndexFromFile(walletDir, keyFile),
    );
    const keys = await Promise.all(publicKeyPromises);

    keys.forEach((key) => {
      if (key) {
        publicKeysAndIndices.push(key);
      }
    });
  }

  return publicKeysAndIndices;
}
