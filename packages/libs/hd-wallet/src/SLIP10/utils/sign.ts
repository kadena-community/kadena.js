import { signHash } from '@kadena/cryptography-utils';

import { HDKey } from 'ed25519-keygen/hdkey';
import { uint8ArrayToHex } from '../../utils/buffer-helpers.js';

export interface ISignatureWithPublicKey {
  sig: string;
  pubKey: string;
}

/**
 * Derive a key pair using a seed and an index. the seed need to be decrypted before using this function.
 * @param seed - The seed for key derivation.
 * @param index - The index for key derivation.
 * @returns Returns the derived private and public keys.
 * @internal
 */
export const deriveKeyPair = (
  seed: Uint8Array,
  derivationPath: string,
): { privateKey: string; publicKey: string } => {
  const key = HDKey.fromMasterSeed(seed).derive(derivationPath, true);

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
export const signWithKeyPair =
  (publicKey: string, secretKey: string) => (hash: string) => {
    const { sig } = signHash(hash, { publicKey, secretKey });
    if (sig === undefined) {
      throw new Error('Signature is undefined');
    }
    return { sig, pubKey: publicKey };
  };

/**
 * Generate a signer function using a seed and an index.
 * @param {Uint8Array} seed - The seed for key derivation.
 * @param {number} index - The index for key derivation.
 * @returns {(tx: IUnsignedCommand) => { sigs: { sig: string }[] }} - Returns a function that can sign a transaction.
 */
export const signWithSeed = (
  seed: Uint8Array,
  derivationPath: string,
): ((hash: string) => ISignatureWithPublicKey) => {
  const { publicKey, privateKey } = deriveKeyPair(seed, derivationPath);
  return signWithKeyPair(publicKey, privateKey);
};
