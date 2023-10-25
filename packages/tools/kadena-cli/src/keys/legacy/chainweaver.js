import { binToHex, hexToBin } from '@kadena/cryptography-utils';
import lib from 'cardano-crypto.js/kadena-crypto.js';
// import lib from 'kadena-crypto.js/kadena-crypto.js';
export function generateSeedPhrase() {
    const seedPhrase = lib.kadenaGenMnemonic();
    return seedPhrase;
}
export const getKeyPairsFromSeedPhrase = (seedPhrase, index = 0) => {
    const root = lib.kadenaMnemonicToRootKeypair('', seedPhrase);
    const hardIndex = 0x80000000;
    const newIndex = hardIndex + index;
    const [privateRaw, pubRaw] = lib.kadenaGenKeypair('', root, newIndex);
    const axprv = new Uint8Array(privateRaw);
    const axpub = new Uint8Array(pubRaw);
    const pub = binToHex(axpub);
    const prv = binToHex(axprv);
    return {
        publicKey: pub,
        secretKey: prv,
    };
};
export function isValidSeedPhrase(seedPhrase) {
    return lib.kadenaMnemonicCheck(seedPhrase);
}
export function getSignatureFromHash(hash, privateKey) {
    const newHash = Buffer.from(hash, 'base64');
    const u8PrivateKey = hexToBin(privateKey);
    const signature = lib.kadenaSign('', newHash, u8PrivateKey);
    const s = new Uint8Array(signature);
    return binToHex(s);
}
