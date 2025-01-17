import { kadenaGetPublic, kadenaMnemonicToSeed } from '@kadena/hd-wallet';
import {
  kadenaGenKeypair as legacyGenKeypair,
  kadenaMnemonicToRootKeypair as LegacyMnemonicToRootKeypair,
} from '@kadena/hd-wallet/chainweaver';

export const getFirstBip44Key = async (mnemonic: string) => {
  const seed = await kadenaMnemonicToSeed('', mnemonic);
  return kadenaGetPublic('', seed, 0);
};
export const getFirstLegacyKey = async (mnemonic: string) => {
  const keypair = await LegacyMnemonicToRootKeypair('', mnemonic);
  const pair = await legacyGenKeypair('', keypair, 0);
  return pair.publicKey;
};
