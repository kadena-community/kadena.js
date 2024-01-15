import type { IPactCommand } from '@kadena/client';
// import { createSignWithKeypair, Sign } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import type { EncryptedString } from '@kadena/hd-wallet';
// import { kadenaSign } from '@kadena/hd-wallet/chainweaver';
import type { ICommand, IKeyPair, IUnsignedCommand } from '@kadena/types';

import { join } from 'path';
import { TRANSACTION_DIR, WALLET_DIR } from '../../constants/config.js';
import {
  ensureWalletExists,
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
 * @param  obj
 * @returns If the object is of type ICommand.
 */
// Helper function to check if an object is of type ICommand
function isCommand(obj: ICommand | IUnsignedCommand): obj is ICommand {
  return (
    obj !== undefined &&
    typeof obj === 'object' &&
    'cmd' in obj &&
    'hash' in obj &&
    'sigs' in obj
  );
}

export const decryptSecretKeys = (
  password: string,
): ((encrypted: EncryptedString) => string) => {
  return (encrypted: EncryptedString): string => {
    return toHexStr(kadenaDecrypt(password, encrypted));
  };
};

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

export async function findSecretKeys(
  publicKeys: string[],
  walletName?: string,
): Promise<Map<string, EncryptedString | undefined>> {
  await ensureWalletExists();

  const searchInWallet = async (
    name: string,
  ): Promise<Map<string, EncryptedString | undefined>> => {
    const walletDir = join(WALLET_DIR, name);
    const secretKeysMap = new Map<string, EncryptedString | undefined>();

    if (!(await services.filesystem.directoryExists(walletDir))) {
      return secretKeysMap;
    }

    const keyFiles = await getKeysFromWallet(name);
    const legacyKeyFiles = await getLegacyKeysFromWallet(name);
    const allKeyFiles: string[] = [...keyFiles, ...legacyKeyFiles];

    for (const keyFile of allKeyFiles) {
      const keyContent: TSeedContent | LocalIKeyPair | undefined =
        await readKeyFileContent(join(walletDir, keyFile));
      if (
        keyContent !== undefined &&
        typeof keyContent !== 'string' &&
        publicKeys.includes(keyContent.publicKey)
      ) {
        secretKeysMap.set(
          keyContent.publicKey,
          keyContent.secretKey as EncryptedString,
        );
      }
    }

    return secretKeysMap;
  };

  const secretKeysMap = new Map<string, EncryptedString | undefined>();

  if (walletName !== undefined) {
    return searchInWallet(walletName);
  } else {
    const walletDirs: string[] = await services.filesystem.readDir(WALLET_DIR);
    for (const dirName of walletDirs) {
      const walletSecretKeysMap = await searchInWallet(dirName);
      walletSecretKeysMap.forEach((secretKey, publicKey) => {
        if (!secretKeysMap.has(publicKey)) {
          secretKeysMap.set(publicKey, secretKey);
        }
      });
    }
  }

  return secretKeysMap;
}

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

export function extractPublicKeysFromTransactionCmd(cmd: string): string[] {
  try {
    const transaction: IPactCommand = JSON.parse(cmd);
    return transaction.signers.map((signer) => signer.pubKey);
  } catch (e) {
    console.error(`Error: ${e}`);
    return [];
  }
}

export async function getSignersFromTransactionHd(
  cmd: string,
  walletName?: string,
): Promise<IKeyPair[]> {
  const publicKeys = extractPublicKeysFromTransactionCmd(cmd);
  const signers = await findKeyPairsByPublicKeys(publicKeys, walletName);

  return signers;
}

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
