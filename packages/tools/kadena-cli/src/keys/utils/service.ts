import type { IPactCommand, IUnsignedCommand } from '@kadena/client';
import { sign as cryptoSign } from '@kadena/cryptography-utils';

import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  decrypt,
  encrypt,
} from './encrypt.js';
import { deriveKeyPair } from './sign.js';

import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { randomBytes } from 'ed25519-keygen/utils';

export class CryptoService {
  private _publicKeys: string[];
  private _seed: string | undefined;
  private _seedBuffer: Uint8Array | undefined;

  public constructor() {
    this._publicKeys = [];
    this._seed = undefined;
    this._seedBuffer = undefined;
  }

  /**
   * Set the internal seed buffer using a given mnemonic phrase.
   *
   * @param {string} mnemonic - A mnemonic seed phrase to be converted into a seed buffer.
   * @param {string} [password] - Optional password for encrypting the seed.
   * @throws {Error} Throws an error if the provided mnemonic is not valid.
   */
  public async setSeedFromMnemonic(
    mnemonic: string,
    password?: string,
  ): Promise<void> {
    if (!bip39.validateMnemonic(mnemonic, wordlist)) {
      throw Error('Invalid mnemonic.');
    }
    this._seedBuffer = await bip39.mnemonicToSeed(mnemonic);

    if (this._seedBuffer !== undefined) {
      if (password !== undefined) {
        const bufferSeed = Buffer.from(this._seedBuffer);
        const encrypted = encrypt(bufferSeed, password);
        const cipherText = arrayBufferToBase64(encrypted.cipherText);
        const iv = arrayBufferToBase64(encrypted.iv);
        this._seed = `${cipherText}.${iv}`;
      } else {
        this._seed = arrayBufferToBase64(Buffer.from(this._seedBuffer));
      }
    } else {
      throw Error('Failed to set seed buffer.');
    }
  }

  /**
   * Process the provided seed and set it internally.
   * This can handle both encrypted and unencrypted seeds.
   *
   * @param {string} storedSeed - The seed as recovered from storage.
   * @param {string} [password] - Optional password for decrypting the seed.
   * @throws {Error} Throws an error if the decryption fails or seed is invalid.
   */
  public processStoredSeed(storedSeed: string, password?: string): void {
    let decryptedSeed;
    if (password !== undefined) {
      const [cipherTextBase64, ivBase64] = storedSeed.split('.');
      const cipherText = base64ToArrayBuffer(cipherTextBase64);
      const iv = base64ToArrayBuffer(ivBase64);
      decryptedSeed = decrypt(cipherText, iv, password);
      if (!decryptedSeed) {
        throw Error('Failed to decrypt seed.');
      }
    } else {
      decryptedSeed = base64ToArrayBuffer(storedSeed);
    }

    this._seedBuffer = decryptedSeed;
    this._seed = storedSeed;
  }

  /**
   * Generates a seed based on a mnemonic phrase. The seed can be either encrypted or not,
   * based on whether a password is provided.
   *
   * @param {string} [password] - Optional password for encrypting the seed. If not provided, the seed remains unencrypted.
   * @returns {Promise<{ words: string, seed: string }>} An object containing the mnemonic words and the stored seed.
   * @throws Will throw an error if mnemonic generation or validation fails, or if seed buffering fails.
   *
   */
  public async generateSeed(
    password?: string,
  ): Promise<{ words: string; seed: string }> {
    const words = bip39.generateMnemonic(wordlist);

    if (!bip39.validateMnemonic(words, wordlist)) {
      throw Error('Invalid mnemonic.');
    }

    this._seedBuffer = await bip39.mnemonicToSeed(words);

    let seed: string; // Seed to be returned

    // Convert _seedBuffer to Base64 for storage or encrypt based on password
    if (this._seedBuffer !== undefined) {
      if (password !== undefined) {
        const bufferSeed = Buffer.from(this._seedBuffer);
        const encrypted = encrypt(bufferSeed, password);
        const cipherText = arrayBufferToBase64(encrypted.cipherText);
        const iv = arrayBufferToBase64(encrypted.iv);
        this._seed = `${cipherText}.${iv}`;
        seed = this._seed;
      } else {
        this._seed = arrayBufferToBase64(Buffer.from(this._seedBuffer));
        seed = this._seed;
      }
    } else {
      throw Error('Failed to generate seed buffer.');
    }

    this._publicKeys = [];

    return {
      words,
      seed,
    };
  }

  // TODO: refactor this
  /**
   * Attempts to restore the wallet using the provided password and generates public keys based on the provided key length.
   *
   * @param {string} password - Password to decrypt the stored seed.
   * @param {number} keyLength - The number of public keys to generate.
   * @returns {Promise<boolean>} Returns true if wallet restoration is successful, otherwise false.
   * @throws {Error} Throws an error if the decryption fails.
   */
  public async restoreWallet(
    password: string,
    keyLength: number,
    storedSeed?: string, //TODO
  ): Promise<boolean> {
    if (this._seed === undefined) return false;
    const [cipherText, iv] = this._seed.split('.');
    const decrypted = await decrypt(
      base64ToArrayBuffer(cipherText),
      base64ToArrayBuffer(iv),
      password,
    );
    if (!decrypted) return false;
    this._seedBuffer = new Uint8Array(decrypted);

    this._publicKeys = this._generateKeys(this._seedBuffer, keyLength);

    return true;
  }

  /**
   * Generates a single key pair and updates the internal state.
   *
   * @returns {{ publicKey: string; secretKey: string }} The generated key pair.
   * @throws {Error} Throws an error if the seed is not set.
   */
  public generateKeyPair(): { publicKey: string; secretKey: string } {
    if (!this._seedBuffer) throw Error('No seed set.');

    const pair = deriveKeyPair(this._seedBuffer, this._publicKeys.length);
    this._publicKeys.push(pair.publicKey);

    return {
      publicKey: pair.publicKey,
      secretKey: pair.privateKey,
    };
  }

  /**
   * Generates multiple key pairs from the seed without updating the internal state.
   *
   * @param {number} [count=1] - The number of key pairs to generate.
   * @returns {{ publicKey: string; secretKey: string }[]} An array of generated key pairs.
   * @throws {Error} Throws an error if the seed is not set.
   */
  public generateKeyPairsFromSeed(
    count: number = 1,
  ): { publicKey: string; secretKey: string }[] {
    if (!this._seedBuffer) throw Error('No seed set.');
    const keyPairs: { publicKey: string; secretKey: string }[] = [];
    for (let i = 0; i < count; i++) {
      const pair = deriveKeyPair(this._seedBuffer, keyPairs.length + i);

      keyPairs.push({
        publicKey: pair.publicKey,
        secretKey: pair.privateKey,
      });
    }

    return keyPairs;
  }

  // generate random keyPairs without updating internal state
  public generateKeyPairsFromRandom(
    count: number = 1,
  ): { publicKey: string; secretKey: string }[] {
    const keyPairs: { publicKey: string; secretKey: string }[] = [];
    for (let i = 0; i < count; i++) {
      const randomSeedBuffer = randomBytes(32);
      const pair = deriveKeyPair(randomSeedBuffer, keyPairs.length + i);

      keyPairs.push({
        publicKey: pair.publicKey,
        secretKey: pair.privateKey,
      });
    }

    return keyPairs;
  }

  /**
   * Signs a given message using the specified public key.
   *
   * @param {string} msg - The message to be signed.
   * @param {string} publicKey - The public key to use for signing.
   * @returns {ReturnType<typeof cryptoSign>} The signature result.
   * @throws {Error} Throws an error if the seed is not set, the public key is not found, or there's a public key mismatch.
   */
  public sign(msg: string, publicKey: string): ReturnType<typeof cryptoSign> {
    if (!this._seedBuffer) throw Error('No seed set.');

    const index = this._publicKeys.indexOf(publicKey);
    if (index === -1) throw Error(`No public key found. (${publicKey})`);

    const pair = deriveKeyPair(this._seedBuffer, index);
    if (pair.publicKey !== publicKey) throw Error('Public key mismatch.');

    return cryptoSign(msg, {
      secretKey: pair.privateKey,
      publicKey: pair.publicKey,
    });
  }

  /**
   * Signs a given transaction.
   *
   * @param {IUnsignedCommand} tx - The unsigned transaction command.
   * @returns {IUnsignedCommand} The signed transaction command.
   */
  public signTransaction(tx: IUnsignedCommand): IUnsignedCommand {
    const command: IPactCommand = JSON.parse(tx.cmd);
    const sigs = command.signers.map((signer) => {
      if (!this._publicKeys.includes(signer.pubKey)) {
        return undefined;
      }
      const { sig } = this.sign(tx.cmd, signer.pubKey);
      if (sig === undefined) return undefined;
      return { sig, pubKey: signer.pubKey };
    });

    return { ...tx, sigs: sigs };
  }

  /* private funcitons */
  /**
   * Generates public keys based on the provided seed buffer and desired length.
   *
   * @private
   * @param {Uint8Array} seedBuffer - The seed buffer to generate keys from.
   * @param {number} length - The number of public keys to generate.
   * @returns {string[]} An array of generated public keys.
   */
  private _generateKeys(seedBuffer: Uint8Array, length: number): string[] {
    const publicKeys = [];
    for (let i = 0; i < length; i++) {
      const pair = deriveKeyPair(seedBuffer, i);
      publicKeys.push(pair.publicKey);
    }
    return publicKeys;
  }

  /**
   * Generates a public key and updates the internal state.
   *
   * @private
   * @returns {string} The generated public key.
   * @throws {Error} Throws an error if the seed is not set.
   */
  private _generatePublicKey(): string {
    if (!this._seedBuffer) throw Error('No seed set.');
    const pair = deriveKeyPair(this._seedBuffer, this._publicKeys.length);
    this._publicKeys.push(pair.publicKey);
    return pair.publicKey;
  }
}
