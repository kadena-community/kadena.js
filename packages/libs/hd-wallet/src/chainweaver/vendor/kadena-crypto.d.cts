export declare const kadenaChangePassword: (
  privateKey: string | Uint8Array,
  oldPassword: string,
  newPassword: string,
) => Uint8Array;

export declare const kadenaCheckMnemonic: (mnemonic: string) => boolean;

export declare const kadenaGenKeypair: (
  password: string,
  rootKey: string | Uint8Array,
  index: number,
) => [Uint8Array, Uint8Array];

export declare const kadenaGenMnemonic: () => string;

export declare const kadenaGetPublic: (secretKey: Uint8Array) => Uint8Array;

export declare const kadenaMnemonicToRootKeypair: (
  password: string,
  mnemonic: string,
) => Uint8Array;

export declare const kadenaSign: (
  password: string,
  message: string,
  privateKey: string | Uint8Array,
) => Uint8Array;

export declare const kadenaVerify: (
  message: string,
  publicKey: string,
  signature: string,
) => boolean;

export declare const isLoaded: () => boolean;

export default {
  kadenaChangePassword,
  kadenaCheckMnemonic,
  kadenaGenKeypair,
  kadenaGenMnemonic,
  kadenaGetPublic,
  kadenaMnemonicToRootKeypair,
  kadenaSign,
  kadenaVerify,
  isLoaded,
};

// Path: ./kadena-crypto.js
