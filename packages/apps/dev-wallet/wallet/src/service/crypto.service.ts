import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  decrypt,
  encrypt,
} from '@/utils/encrypt';
import { deriveKeyPair } from '@/utils/sign';
import { IPactCommand, IUnsignedCommand } from '@kadena/client';
import { sign as cryptoSign } from '@kadena/cryptography-utils';
import { mnemonicToSeed } from '@scure/bip39';

export interface CryptoState {
  publicKeys: string[];
  seed: string | null;
  seedBuffer: Uint8Array | null;
}

export interface IState<T> {
  get: () => T;
  set: (patch: Partial<T>) => void;
}

function generateKeys(seedBuffer: Uint8Array, length: number) {
  const publicKeys = [];
  // regenerated public keys
  for (let i = 0; i < length; i++) {
    const pair = deriveKeyPair(seedBuffer, i);
    publicKeys.push(pair.publicKey);
  }
  return publicKeys;
}

export interface ICryptoService {
  generateSeed(
    words: string,
    password: string,
    setBuffer?: boolean,
  ): Promise<boolean>;
  restoreWallet(password: string, keyLength: number): Promise<boolean>;
  generatePublicKey(): string;
  sign(msg: string, publicKey: string): ReturnType<typeof cryptoSign>;
  signTransaction(tx: IUnsignedCommand): IUnsignedCommand;
}

export function cryptoService(state: IState<CryptoState>): ICryptoService {
  async function generateSeed(
    words: string,
    password: string,
    setBuffer = true,
  ) {
    if (typeof password !== 'string' || password.length === 0) {
      throw Error('No password set.');
    }
    const seedBuffer = await mnemonicToSeed(words);

    const encrypted = await encrypt(seedBuffer, password);
    const cipherText = arrayBufferToBase64(encrypted.cipherText);
    const iv = arrayBufferToBase64(encrypted.iv);

    state.set({
      seedBuffer: setBuffer ? new Uint8Array(seedBuffer) : null,
      seed: `${cipherText}.${iv}`,
      publicKeys: [],
    });

    return true;
  }

  async function restoreWallet(password: string, keyLength: number) {
    const seed = state.get().seed;
    if (!seed) return false;
    const [cipherText, iv] = seed.split('.');
    const decrypted = await decrypt(
      {
        cipherText: base64ToArrayBuffer(cipherText),
        iv: base64ToArrayBuffer(iv),
      },
      password,
    );
    if (!decrypted) return false;
    const seedBuffer = new Uint8Array(decrypted);

    state.set({
      seedBuffer,
      publicKeys: generateKeys(seedBuffer, keyLength),
    });

    return true;
  }

  function generatePublicKey() {
    const { seedBuffer, publicKeys } = state.get();
    if (!seedBuffer) throw Error('No seed set.');
    const pair = deriveKeyPair(seedBuffer, publicKeys.length);
    state.set({ publicKeys: [...publicKeys, pair.publicKey] });
    return pair.publicKey;
  }

  function sign(msg: string, publicKey: string) {
    const { seedBuffer, publicKeys } = state.get();
    if (!seedBuffer) throw Error('No seed set.');

    const index = publicKeys.indexOf(publicKey);
    if (index === -1) throw Error(`No public key found. (${publicKey})`);

    const pair = deriveKeyPair(seedBuffer, index);
    if (pair.publicKey !== publicKey) throw Error('Public key mismatch.');

    return cryptoSign(msg, {
      secretKey: pair.privateKey,
      publicKey: pair.publicKey,
    });
  }

  function signTransaction(tx: IUnsignedCommand): IUnsignedCommand {
    const { publicKeys } = state.get();
    const command: IPactCommand = JSON.parse(tx.cmd);
    const sigs = command.signers.map((signer) => {
      if (!publicKeys.includes(signer.pubKey)) {
        return undefined;
      }
      const { sig } = sign(tx.cmd, signer.pubKey);
      if (!sig) return undefined;
      return { sig, pubKey: signer.pubKey };
    });

    return { ...tx, sigs: sigs };
  }

  return {
    generateSeed,
    restoreWallet,
    generatePublicKey,
    sign,
    signTransaction,
  };
}
