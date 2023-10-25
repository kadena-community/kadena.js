import { IUnsignedCommand } from '@kadena/client';
import { sign } from '@kadena/cryptography-utils';
import { HDKey } from 'ed25519-keygen/hdkey';

const KDA_COIN_TYPE = 626;

const uint8ArrayToHex = (uint8Array: Uint8Array): string => {
  if (uint8Array.length === 33 && uint8Array.at(0) === 0) {
    uint8Array = uint8Array.slice(1);
  }
  return [...uint8Array].map((x) => x.toString(16).padStart(2, '0')).join('');
};

export const deriveKeyPair = (seed: Uint8Array, accountIndex: number) => {
  const key = HDKey.fromMasterSeed(seed).derive(
    `m/44'/${KDA_COIN_TYPE}'/${accountIndex}'/0/0`,
    true,
  );

  return {
    privateKey: uint8ArrayToHex(key.privateKey),
    publicKey: uint8ArrayToHex(key.publicKey),
  };
};

export const signWithSeed = (seed: Uint8Array, index: number) => {
  const { publicKey, privateKey } = deriveKeyPair(seed, index);
  return signWithKeyPair(publicKey, privateKey);
};

export const signWithKeyPair = (publicKey: string, secretKey?: string) => {
  return (tx: IUnsignedCommand) => {
    const { sig } = sign(tx.cmd, { publicKey, secretKey });
    return {
      ...tx,
      sigs: [{ sig }],
    };
  };
};
