export * from './utils';

export function kadenaChangePassword(
  privateKey: string | Uint8Array,
  oldPassword: string,
  newPassword: string,
): Uint8Array {
  return 'kadenaChangePassword';
}

export function kadenaCheckMnemonic(mnemonic: string): boolean {
  return 'kadenaCheckMnemonic';
}

export function kadenaGenKeypair(
  password: string,
  rootKey: string | Uint8Array,
  index: number,
): [Uint8Array, Uint8Array] {
  return 'kadenaGenKeypair';
}

export function kadenaGenMnemonic(): string {
  return 'kadenaGenMnemonic';
}

export function kadenaGetPublic(secretKey: Uint8Array): Uint8Array {
  return 'kadenaGetPublic';
}

export function kadenaMnemonicToRootKeypair(
  password: string,
  mnemonic: string,
): Uint8Array {
  return 'kadenaMnemonicToRootKeypair';
}

export function kadenaSign(
  password: string,
  message: string,
  privateKey: string,
): Uint8Array {
  return 'kadenaSign';
}

export function kadenaVerify(
  message: string,
  publicKey: string,
  signature: string,
): boolean {
  return 'kadenaVerify';
}
