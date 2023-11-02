export declare const kadenaChangePassword: (
  oldPassword: string,
  newPassword: string,
  mnemonic: string,
) => string;

export declare const kadenaCheckMnemonic: (mnemonic: string) => boolean;

export declare const kadenaGenKeypair: (
  password: string,
  rootKey: string,
  index: number,
) => [Uint8Array, Uint8Array];

export declare const kadenaGenMnemonic: () => string;

export declare const kadenaGetPublic: (secretKey: Uint8Array) => Uint8Array;

export declare const kadenaMnemonicToRootKeypair: (
  password: string,
  mnemonic: string,
) => string;

export declare const kadenaSign: (
  secretKey: Uint8Array,
  message: Uint8Array,
) => Uint8Array;

export declare const kadenaVerify: (
  publicKey: Uint8Array,
  message: Uint8Array,
  signature: Uint8Array,
) => boolean;

// Path: ./kadena-crypto.ts
