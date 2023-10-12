import type { IPactCommand, IUnsignedCommand } from '@kadena/client';
import { sign as cryptoSign } from '@kadena/cryptography-utils';

import { arrayBufferToBase64 } from './encrypt.js';
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
   * @param {string} mnemonic - A mnemonic seed phrase (12 words) to be converted into a seed buffer.
   * @throws {Error} Throws an error if the provided mnemonic is not valid.
   */
  public async setSeedFromMnemonic(mnemonic: string): Promise<void> {
    if (!bip39.validateMnemonic(mnemonic, wordlist)) {
      throw Error('Invalid mnemonic.');
    }
    this._seedBuffer = await bip39.mnemonicToSeed(mnemonic);
  }

  public async generateSeed(): Promise<string> {
    const words = bip39.generateMnemonic(wordlist);

    if (!bip39.validateMnemonic(words, wordlist)) {
      throw Error('Invalid mnemonic.');
    }

    this._seedBuffer = await bip39.mnemonicToSeed(words);

    // Convert _seedBuffer to Base64 for storage or encrypt based on password
    if (this._seedBuffer !== undefined) {
      this._seed = arrayBufferToBase64(Buffer.from(this._seedBuffer));
    } else {
      throw Error('Failed to generate seed buffer.');
    }

    this._publicKeys = [];

    return words;
  }

  public generateKeyPair(): { publicKey: string; secretKey: string } {
    if (!this._seedBuffer) throw Error('No seed set.');

    const pair = deriveKeyPair(this._seedBuffer, this._publicKeys.length);
    this._publicKeys.push(pair.publicKey);

    return {
      publicKey: pair.publicKey,
      secretKey: pair.privateKey,
    };
  }

  public generateKeyPairsFromRandom(
    count: number = 1,
  ): { publicKey: string; secretKey: string }[] {
    const keyPairs = [];

    for (let i = 0; i < count; i++) {
      const randomSeedBuffer = randomBytes(32);
      const pair = deriveKeyPair(randomSeedBuffer, this._publicKeys.length + i);
      this._publicKeys.push(pair.publicKey);

      keyPairs.push({
        publicKey: pair.publicKey,
        secretKey: pair.privateKey,
      });
    }

    return keyPairs;
  }

  public generatePublicKey(): string {
    if (!this._seedBuffer) throw Error('No seed set.');
    const pair = deriveKeyPair(this._seedBuffer, this._publicKeys.length);
    this._publicKeys.push(pair.publicKey);
    return pair.publicKey;
  }

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

  private _generateKeys(seedBuffer: Uint8Array, length: number): string[] {
    const publicKeys = [];
    for (let i = 0; i < length; i++) {
      const pair = deriveKeyPair(seedBuffer, i);
      publicKeys.push(pair.publicKey);
    }
    return publicKeys;
  }
}
