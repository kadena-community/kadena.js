import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import type { BinaryLike } from '../utils/crypto.js';
import { kadenaEncrypt } from '../utils/kadenaEncryption.js';
/**
 * Generates a mnemonic phrase using the BIP39 protocol with a specified wordlist.
 *
 * @returns A valid BIP39 mnemonic phrase.
 * @throws If the generated mnemonic is invalid.
 * @public
 */
export function kadenaGenMnemonic(): string {
  return bip39.generateMnemonic(wordlist);
}

/**
 * Convert a given mnemonic phrase into a seed buffer.
 *
 * @param mnemonic - A mnemonic seed phrase to be converted into a seed buffer.
 * @param password - Optional password for encrypting the seed.
 * @throws Throws an error if the provided mnemonic is not valid.
 * @returns Returns the seed buffer and processed seed.
 * @public
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
