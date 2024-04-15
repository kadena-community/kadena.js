import { kadenaDecrypt } from '@kadena/hd-wallet';

type BinaryLike = string | ArrayBuffer | Uint8Array;

export async function decryptMessage(
  password: BinaryLike,
  encryptedData: BinaryLike,
): Promise<Uint8Array> {
  try {
    return await kadenaDecrypt(password, encryptedData);
  } catch (error) {
    if (error.message === 'Decryption failed') {
      throw new Error(
        'Incorrect password. Please verify the password and try again.',
      );
    }
    throw error;
  }
}
