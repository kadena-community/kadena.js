import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import type { BinaryLike } from 'crypto';
import { kadenaEncrypt } from '../utils/kadenaEncryption';
/**
 * Generates a mnemonic phrase using the BIP39 protocol with a specified wordlist.
 *
 * @returns {string} A valid BIP39 mnemonic phrase.
 * @throws {Error} If the generated mnemonic is invalid.
 */
export function kadenaGenMnemonic(): string {
  return bip39.generateMnemonic(wordlist);
}

/**
 * Convert a given mnemonic phrase into a seed buffer.
 *
 * @param {string} mnemonic - A mnemonic seed phrase to be converted into a seed buffer.
 * @param {string} [password] - Optional password for encrypting the seed.
 * @throws {Error} Throws an error if the provided mnemonic is not valid.
 * @returns {Promise<{ seedBuffer: Uint8Array, seed: string }>} - Returns the seed buffer and processed seed.
 */
export async function kadenaMnemonicToSeed<
  TEncode extends 'base64' | 'buffer' = 'base64',
>(
  password: BinaryLike,
  mnemonic: string,
  encode: TEncode = 'base64' as TEncode,
  // wordList: string[] = wordlist,
) {
  if (bip39.validateMnemonic(mnemonic, wordlist) === false) {
    throw Error('Invalid mnemonic.');
  }

  const seedBuffer = await bip39.mnemonicToSeed(mnemonic);

  return kadenaEncrypt(password, seedBuffer, encode);
}
