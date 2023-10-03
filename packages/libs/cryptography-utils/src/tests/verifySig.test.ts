import { base64UrlDecodeArr } from '../base64UrlDecodeArr';
import { hexToBin } from '../hexToBin';
import { verifySig } from '../verifySig';

describe('verifySig', () => {
  test('Takes in message, public key and signature in binary object, returns true if valid', () => {
    const signCmd = {
      hash: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
      sig: 'b7abf9fef533bbdb306a406db75f93fc6367ae1dc3ecbd18d118f5a6000610d064abab646256c856f8e6f0290b675808d9e4f9090fa035e7fb8f8962cc4d8202',
      pubKey:
        '1442f89e7311e68568abe039f1edd162f0da021fdae2c5fcf821a9b7d25d3769',
    };
    const { hash, sig, pubKey } = signCmd;

    const isValidSig = verifySig(
      base64UrlDecodeArr(hash),
      hexToBin(sig),
      hexToBin(pubKey),
    );

    expect(isValidSig).toBeTruthy();
  });

  test('takes in message, public key and signature in binary object, returns false if invalid', () => {
    const signCmd = {
      hash: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
      sig: '26d765e3b812d59d80ffbd034d4fc4a1a24f8d0c3929586575617089e5098d967955d348608b515ae9ff7871b46726ffc71252d53b9e562d5bcf3bfe66292906',
      pubKey:
        'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    };
    const { hash, sig, pubKey } = signCmd;

    const isValidSig = verifySig(
      base64UrlDecodeArr(hash),
      hexToBin(sig),
      hexToBin(pubKey),
    );

    expect(isValidSig).toBeFalsy();
  });
});
