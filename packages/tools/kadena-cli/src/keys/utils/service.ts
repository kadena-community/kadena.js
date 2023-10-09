import type { IPactCommand, IUnsignedCommand } from '@kadena/client';
import { sign as cryptoSign } from '@kadena/cryptography-utils';

import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  decrypt,
  encrypt,
} from './encrypt';
import { deriveKeyPair } from './sign';

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
   * Generates seed from mnemonic words and a password.
   * @param {string} password User password.
   * @param {string} [words] Mnemonic words. If not provided, a new mnemonic is generated.
   * @returns {Promise<boolean>} Success status.
   */
  public async generateSeed(
    password: string,
    words?: string,
  ): Promise<boolean> {
    if (typeof password !== 'string' || password.length === 0) {
      throw Error('No password set.');
    }

    // If words are not provided, generate a new mnemonic
    if (words === undefined) {
      words = bip39.generateMnemonic(wordlist);
    }

    // Check for validity of the provided/generated mnemonic
    if (!bip39.validateMnemonic(words, wordlist)) {
      throw Error('Invalid mnemonic.');
    }

    this._seedBuffer = await bip39.mnemonicToSeed(words); // Store seedBuffer in class state
    const encrypted = await encrypt(this._seedBuffer, password); // Use the stored seedBuffer
    const cipherText = arrayBufferToBase64(encrypted.cipherText);
    const iv = arrayBufferToBase64(encrypted.iv);

    this._seed = `${cipherText}.${iv}`;
    this._publicKeys = [];

    return true;
  }

  /**
   * Generates a public and secret key pair from the current seed.
   * @returns { {publicKey: string, secretKey: string} } The generated key pair.
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
   * Restores the wallet using the saved seed and the given password.
   * @param {string} password User password.
   * @param {number} keyLength Number of keys to generate.
   * @returns {Promise<boolean>} Success status.
   */
  public async restoreWallet(
    password: string,
    keyLength: number,
  ): Promise<boolean> {
    if (this._seed === undefined) return false;
    const [cipherText, iv] = this._seed.split('.');
    const decrypted = await decrypt(
      {
        cipherText: base64ToArrayBuffer(cipherText),
        iv: base64ToArrayBuffer(iv),
      },
      password,
    );
    if (!decrypted) return false;
    this._seedBuffer = new Uint8Array(decrypted);

    this._publicKeys = this._generateKeys(this._seedBuffer, keyLength);

    return true;
  }

  /**
   * Generates a public and secret key pair from random bytes (no seed phrase required).
   * @returns { {publicKey: string, secretKey: string} } The generated key pair.
   */
  public generateKeyPairFromRandom(): { publicKey: string; secretKey: string } {
    const randomSeedBuffer = randomBytes(32); // Typically 32 bytes for strong randomness. Adjust as necessary.
    const pair = deriveKeyPair(randomSeedBuffer, this._publicKeys.length);
    this._publicKeys.push(pair.publicKey);

    return {
      publicKey: pair.publicKey,
      secretKey: pair.privateKey,
    };
  }

  /**
   * Generates and returns a new public key.
   * @returns {string} Newly generated public key.
   */
  public generatePublicKey(): string {
    if (!this._seedBuffer) throw Error('No seed set.');
    const pair = deriveKeyPair(this._seedBuffer, this._publicKeys.length);
    this._publicKeys.push(pair.publicKey);
    return pair.publicKey;
  }

  /**
   * Signs a message using the given public key.
   * @param {string} msg Message to be signed.
   * @param {string} publicKey Public key to use for signing.
   * @returns {ReturnType<typeof cryptoSign>} Signature.
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
   * Signs a transaction.
   * @param {IUnsignedCommand} tx Transaction to be signed.
   * @returns {IUnsignedCommand} Signed transaction.
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

  /**
   * Utility function to generate keys.
   * @param {Uint8Array} seedBuffer Seed buffer.
   * @param {number} length Number of keys to generate.
   * @returns {string[]} Array of public keys.
   */
  private _generateKeys(seedBuffer: Uint8Array, length: number): string[] {
    const publicKeys = [];
    for (let i = 0; i < length; i++) {
      const pair = deriveKeyPair(seedBuffer, i);
      publicKeys.push(pair.publicKey);
    }
    return publicKeys;
  }
}
