import { kadenaEncrypt } from '../../index.js';
import { kadenaMnemonicToRootKeypair as originalKadenaMnemonicToRootKeypair } from '../kadena-crypto.js';

export const kadenaMnemonicToRootKeypair = async <
  TEncode extends 'base64' | 'buffer' = 'base64',
>(
  password: string | Uint8Array,
  mnemonic: string,
  encode: TEncode = 'base64' as TEncode,
) => {
  const result = await originalKadenaMnemonicToRootKeypair(password, mnemonic);
  return kadenaEncrypt(password, result, encode);
};
