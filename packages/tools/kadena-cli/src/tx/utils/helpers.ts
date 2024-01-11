import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaSignWithKeyPair } from '@kadena/hd-wallet';
import { kadenaSign } from '@kadena/hd-wallet/chainweaver';
import type { ICommand, IUnsignedCommand } from '@kadena/types';
import { join } from 'path';
import { TRANSACTION_DIR, WALLET_DIR } from '../../constants/config.js';
import {
  ensureWalletExists,
  getKeysFromWallet,
  getLegacyKeysFromWallet,
} from '../../keys/utils/keysHelpers.js';
import type { IKeyPair, TSeedContent } from '../../keys/utils/storage.js';
import { readKeyFileContent } from '../../keys/utils/storage.js';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';

/**
 * @returns {Promise<string[]>}
 * @throws
 */
export async function getAllTransactions(): Promise<string[]> {
  try {
    const files = await services.filesystem.readDir(TRANSACTION_DIR);
    return files.filter((file) => !file.includes('-signed'));
  } catch (error) {
    console.error(`Error reading transaction directory: ${error}`);
    throw error;
  }
}

/**
 * @returns {string}
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
 * @param {string} password
 * @param {string} cmd
 * @param {EncryptedString} secretKey
 * @returns {(tx: IUnsignedCommand) => Promise<{ sigs: { sig: string }[] }>}
 */
export const legacySignWithKeyPairHelper = (
  password: string,
  cmd: string,
  secretKey: EncryptedString,
): ((tx: IUnsignedCommand) => Promise<{ sigs: { sig: string }[] }>) => {
  return async (tx: IUnsignedCommand) => {
    const result = await kadenaSign(password, cmd, secretKey);
    const sig = Buffer.from(result).toString('hex');
    if (!sig) {
      throw new Error('Signature is undefined or empty');
    }
    return {
      ...tx,
      sigs: [{ sig }],
    };
  };
};

/**
 *
 * @param {Object} config
 * @returns {Promise<CommandResult<{ succes: boolean; data: ICommand }>>}
 */
export const signTransaction = async (config: {
  unsignedCommand: IUnsignedCommand;
  keyPublicKey: string;
  keySecretKey: string;
  securityPassword: string;
  legacy?: boolean;
}): Promise<CommandResult<ICommand>> => {
  let signedCommand: ICommand;

  if (config.legacy === true) {
    const signedCommand = (await legacySignWithKeyPairHelper(
      config.securityPassword,
      config.unsignedCommand.cmd,
      config.keySecretKey as EncryptedString,
    )(config.unsignedCommand)) as ICommand;

    return {
      success: true,
      data: signedCommand,
    };
  } else {
    signedCommand = kadenaSignWithKeyPair(
      config.securityPassword,
      config.keyPublicKey,
      config.keySecretKey as EncryptedString,
    )(config.unsignedCommand) as ICommand;

    return { success: true, data: signedCommand };
  }
};

/**
 * @param {string} walletName
 * @param {string} publicKey
 * @returns {Promise<EncryptedString | undefined>}
 */
export async function findSecretKeyByWalletAndPublicKey(
  walletName: string,
  publicKey: string,
): Promise<EncryptedString | undefined> {
  await ensureWalletExists();

  const walletDir = join(WALLET_DIR, walletName);
  if (!(await services.filesystem.directoryExists(walletDir))) {
    console.error(`Wallet directory for '${walletName}' not found.`);
    return undefined;
  }

  const keyFiles = await getKeysFromWallet(walletName);
  const legacyKeyFiles = await getLegacyKeysFromWallet(walletName);
  const allKeyFiles: string[] = [...keyFiles, ...legacyKeyFiles];

  for (const keyFile of allKeyFiles) {
    const keyContent: TSeedContent | IKeyPair | undefined =
      await readKeyFileContent(join(walletDir, keyFile));
    if (
      keyContent !== undefined &&
      typeof keyContent !== 'string' &&
      keyContent.publicKey === publicKey
    ) {
      return keyContent.secretKey as EncryptedString;
    }
  }

  return undefined;
}

/**
 * @param {string} publicKey
 * @returns {Promise<string | undefined>}
 */
export async function findSecretKeyByPublicKey(
  publicKey: string,
): Promise<string | undefined> {
  await ensureWalletExists();

  const walletDirs: string[] = await services.filesystem.readDir(WALLET_DIR);
  for (const dirName of walletDirs) {
    const secretKey = await findSecretKeyByWalletAndPublicKey(
      dirName,
      publicKey,
    );
    if (secretKey !== undefined) {
      return secretKey;
    }
  }

  return undefined;
}

/**
 *
 * @param {Object} transaction
 * @returns {string[]}
 */
export function extractPublicKeysFromTransaction(transaction: {
  // eslint-disable-next-line @rushstack/no-new-null
  sigs: Record<string, null>;
}): string[] {
  const publicKeys: string[] = [];

  if (transaction.sigs !== undefined) {
    for (const key in transaction.sigs) {
      if (
        transaction.sigs.hasOwnProperty(key) &&
        transaction.sigs[key] === null
      ) {
        // "publickey:null"
        const publicKey = key.split(':')[0];
        if (publicKey) {
          publicKeys.push(publicKey);
        }
      }
    }
  }

  return publicKeys;
}
