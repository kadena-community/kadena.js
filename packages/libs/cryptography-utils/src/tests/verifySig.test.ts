import { base64UrlDecodeArr } from '../base64UrlDecodeArr';
import { hexToBin } from '../hexToBin';
import { verifySig } from '../verifySig';

test('Takes in message, signature, and public key in binary object, returns boolean', () => {
  const signCmd = {
    hash: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
    sig: '26d765e3b812d59d80ffbd034d4fc4a1a24f8d0c3929586575617089e5098d967955d348608b515ae9ff7871b46726ffc71252d53b9e562d5bcf3bfe66292906',
    pubKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  };
  const { hash, sig, pubKey } = signCmd;

  const isValidSig = verifySig(
    base64UrlDecodeArr(hash),
    hexToBin(sig),
    hexToBin(pubKey),
  );

  expect(isValidSig).toEqual(true);
});
