import { EncryptedString, kadenaEncrypt } from '../../index.js';
import { kadenaMnemonicToRootKeypair as originalKadenaMnemonicToRootKeypair } from '../kadena-crypto.js';

export const kadenaMnemonicToRootKeypair = async (
  password: string,
  mnemonic: string,
): Promise<EncryptedString> => {
  const result = await originalKadenaMnemonicToRootKeypair(password, mnemonic);
  return kadenaEncrypt(password, result);
};
