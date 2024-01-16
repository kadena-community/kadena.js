import type { IPactCommand } from '@kadena/client';
// import { createSignWithKeypair, Sign } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import type { EncryptedString } from '@kadena/hd-wallet';
// import { kadenaSign } from '@kadena/hd-wallet/chainweaver';
import type { ICommand, IKeyPair, IUnsignedCommand } from '@kadena/types';

import { join } from 'path';
import { TRANSACTION_DIR, WALLET_DIR } from '../../constants/config.js';
import {
  getKeysFromWallet,
  getLegacyKeysFromWallet,
  toHexStr,
} from '../../keys/utils/keysHelpers.js';
import type {
  IKeyPair as LocalIKeyPair,
  TSeedContent,
} from '../../keys/utils/storage.js';
import { readKeyFileContent } from '../../keys/utils/storage.js';
import { services } from '../../services/index.js';

import { kadenaDecrypt } from '@kadena/hd-wallet';

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

// export const legacySignWithKeyPairHelper = (
//   password: string,
//   cmd: string,
//   secretKey: EncryptedString,
// ): ((tx: IUnsignedCommand) => Promise<{ sigs: { sig: string }[] }>) => {
//   return async (tx: IUnsignedCommand) => {
//     const result = await kadenaSign(password, cmd, secretKey);
//     const sig = Buffer.from(result).toString('hex');
//     if (!sig) {
//       throw new Error('Signature is undefined or empty');
//     }
//     return {
//       ...tx,
//       sigs: [{ sig }],
//     };
//   };
// };

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
    obj.sigs.every((sig) => sig !== undefined)
  );
}

/**
 * Creates a function to decrypt secret keys using the provided password.
 * @param {string} password - The password used for decryption.
 * @returns {(encrypted: EncryptedString) => string}
 */
export const decryptSecretKeys = (
  password: string,
): ((encrypted: EncryptedString) => string) => {
  return (encrypted: EncryptedString): string => {
    return toHexStr(kadenaDecrypt(password, encrypted));
  };
};

/**
 * Creates a function to sign a transaction with the provided keys.
 * @param {IKeyPair[]} keys - The key pairs used for signing.
 * @returns {(config: { unsignedCommand: IUnsignedCommand }) => Promise<ICommand | undefined>}
 */
export const signTransaction = (
  keys: IKeyPair[],
): ((config: {
  unsignedCommand: IUnsignedCommand;
}) => Promise<ICommand | undefined>) => {
  return async (config): Promise<ICommand | undefined> => {
    const signWithKeypair = createSignWithKeypair(keys);

    try {
      // if (config.legacy === true) {
      //   // Handle legacy signing
      //   signedCommand = await legacySignWithKeyPairHelper(
      //     config.securityPassword,
      //     config.unsignedTransaction.cmd,
      //     config.keySecretKey as EncryptedString,
      //   )(config.unsignedTransaction);
      // } else {
      //   // Handle non-legacy signing
      //   signedCommand = await signWithKeypair(config.unsignedTransaction);
      // }

      const signedCommand: ICommand | IUnsignedCommand = await signWithKeypair(
        config.unsignedCommand,
      );

      if (isCommand(signedCommand)) {
        return signedCommand;
      } else {
        return undefined;
      }
    } catch (error) {
      throw new Error(`Error signing transaction: ${error.message}`);
    }
  };
};

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
  const keyContent: TSeedContent | LocalIKeyPair | undefined =
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
 * @returns {Promise<IKeyPair[]>}
 */
export async function findKeyPairsByPublicKeys(
  publicKeys: string[],
  walletName?: string,
): Promise<IKeyPair[]> {
  const keyPairs: IKeyPair[] = [];
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

/**
 * retrieves key pairs used as signers for a transaction from an HD wallet.
 * @param {string} cmd - The transaction command string.
 * @param {string} [walletName] - Optional name of the wallet.
 * @returns {Promise<IKeyPair[]>}
 */
export async function getSignersFromTransactionHd(
  cmd: string,
  walletName?: string,
): Promise<IKeyPair[]> {
  const publicKeys = extractPublicKeysFromTransactionCmd(cmd);
  const signers = await findKeyPairsByPublicKeys(publicKeys, walletName);

  return signers;
}

/**
 * Retrieves key pairs used as signers for a transaction from provided key pairs.
 * @param {string} cmd - The transaction command string.
 * @param {IKeyPair[]} keyPairs - Array of key pairs to filter from.
 * @returns {Promise<IKeyPair[]>}
 */
export async function getSignersFromTransactionPlain(
  cmd: string,
  keyPairs: IKeyPair[],
): Promise<IKeyPair[]> {
  const publicKeys = extractPublicKeysFromTransactionCmd(cmd);

  const signers = keyPairs.filter(
    (keyPair) =>
      publicKeys.includes(keyPair.publicKey) && keyPair.secretKey !== undefined,
  );

  return signers;
}
