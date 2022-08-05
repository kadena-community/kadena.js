// @ts-ignore
import lib from 'cardano-crypto.js/kadena-crypto';
// @ts-ignore
import Pact from 'pact-lang-api';
import { isPrivateKey } from './string';

export const generateSeedPhrase = () => {
  return lib.kadenaGenMnemonic();
};

export const checkValidSeedPhrase = (seedPhrase: string) => {
  return lib.kadenaCheckMnemonic(seedPhrase);
};

export const getKeyPairsFromSeedPhrase = (
  seedPhrase: string,
  index: number,
) => {
  const root = lib.kadenaMnemonicToRootKeypair('', seedPhrase);
  const hardIndex = 0x80000000;
  const newIndex = hardIndex + index;
  const [privateRaw, pubRaw] = lib.kadenaGenKeypair('', root, newIndex);
  const axprv = new Uint8Array(privateRaw);
  const axpub = new Uint8Array(pubRaw);
  const pub = Pact.crypto.binToHex(axpub);
  const prv = Pact.crypto.binToHex(axprv);
  return {
    publicKey: pub,
    secretKey: prv,
  };
};

export const getSignatureFromHash = (hash: string, privateKey: string) => {
  const newHash = Buffer.from(hash, 'base64');
  const u8PrivateKey = Pact.crypto.hexToBin(privateKey);
  const signature = lib.kadenaSign('', newHash, u8PrivateKey);
  const s = new Uint8Array(signature);
  return Pact.crypto.binToHex(s);
};

export function setSignatureIfNecessary(cmdValue: any, sig: string) {
  if (!sig || !cmdValue) {
    throw new Error('Wrong Parameters: request getSignature');
  }
  if (sig.length === 64) {
    return cmdValue;
  }
  if (sig.length === 128 && isPrivateKey(sig)) {
    return cmdValue;
  }
  if (sig.length > 64) {
    const cmdHash = cmdValue.cmds[0].hash;
    const signature = getSignatureFromHash(cmdHash, sig);
    return {
      cmds: [
        {
          ...cmdValue.cmds[0],
          sigs: [{ sig: signature }],
        },
      ],
    };
  }
  return cmdValue;
}
