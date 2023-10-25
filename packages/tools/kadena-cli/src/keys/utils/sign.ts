import type { IUnsignedCommand } from '@kadena/client';
import { sign } from '@kadena/cryptography-utils';

import { HDKey } from 'ed25519-keygen/hdkey';

const KDA_COIN_TYPE: number = 626;

/**
 * Convert a Uint8Array to a hexadecimal string.
 * @param {Uint8Array} uint8Array - The array to convert.
 * @returns {string} - Returns the hexadecimal representation of the input.
 */
const uint8ArrayToHex = (uint8Array: Uint8Array): string => {
  if (uint8Array.length === 33 && uint8Array.at(0) === 0) {
    uint8Array = uint8Array.slice(1);
  }
  return [...uint8Array].map((x) => x.toString(16).padStart(2, '0')).join('');
};

/**
 * Derive a key pair using a seed and an index.
 * @param {Uint8Array} seed - The seed for key derivation.
 * @param {number} index - The index for key derivation.
 * @returns {{ privateKey: string; publicKey: string }} - Returns the derived private and public keys.
 */
export const deriveKeyPair = (
  seed: Uint8Array,
  index: number,
): { privateKey: string; publicKey: string } => {
  const key = HDKey.fromMasterSeed(seed).derive(
    `m/44'/${KDA_COIN_TYPE}'/0'/0/${index}`,
    true,
  );

  return {
    privateKey: uint8ArrayToHex(key.privateKey),
    publicKey: uint8ArrayToHex(key.publicKey),
  };
};

/**
 * Creates a signer function for a given public and secret key pair.
 *
 * @function
 * @param {string} publicKey - The public key for signing.
 * @param {string} [secretKey] - The optional secret key for signing.
 * @returns {Function} A function that takes an unsigned command and returns the command with its signature.
 *
 * @example
 * const signer = signWithKeyPair('myPublicKey', 'mySecretKey');
 * const signedCommand = signer(myUnsignedCommand);
 *
 * @throws {Error} Throws an error if the signature is undefined.
 */
export const signWithKeyPair = (
  publicKey: string,
  secretKey?: string,
): ((tx: IUnsignedCommand) => { sigs: { sig: string }[] }) => {
  return (tx: IUnsignedCommand) => {
    const { sig } = sign(tx.cmd, { publicKey, secretKey });
    if (sig === undefined) {
      throw new Error('Signature is undefined');
    }
    return {
      ...tx,
      sigs: [{ sig }],
    };
  };
};

/**
 * Generate a signer function using a seed and an index.
 * @param {Uint8Array} seed - The seed for key derivation.
 * @param {number} index - The index for key derivation.
 * @returns {(tx: IUnsignedCommand) => { sigs: { sig: string }[] }} - Returns a function that can sign a transaction.
 */
export const signWithSeed = (
  seed: Uint8Array,
  index: number,
): ((tx: IUnsignedCommand) => { sigs: { sig: string }[] }) => {
  const { publicKey, privateKey } = deriveKeyPair(seed, index);
  return signWithKeyPair(publicKey, privateKey);
};

// TO-DO: Implement.

/**
 * Placeholder function for signing with Chainweaver.
 */
export const signWithChainweaver = (): string => {
  return 'signWithChainweaver';
};

/**
 * Placeholder function for signing with WalletConnect.
 */
export const signWithWalletConnect = (): string => {
  return 'signWithWalletConnect';
};

/**
 * Placeholder function for signing with Ledger.
 */
export const signWithLedger = (): string => {
  return 'signWithWalletConnect';
};
