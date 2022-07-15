import { base64UrlDecodeArr } from '../base64UrlDecodeArr';
import { hexToBin } from '../hexToBin';
import { verifySig } from '../verifySig';

test('Takes in message, signature, and public key in binary object, returns boolean', () => {
  const signCmd = {
    hash: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
    sig: '4b0ecfbb0e8f3cb291b57abd27028ceaa221950affa39f10efbf4a5fe740d32670e94c3d3949a7e5f4f6ea692052ca110f7cb2e9a8ee2c5eff4251ed84bbfa03',
    pubKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  };
  const { hash, sig, pubKey } = signCmd;

  const actual = verifySig(
    base64UrlDecodeArr(hash),
    hexToBin(sig),
    hexToBin(pubKey),
  );
  const expected = true;

  expect(expected).toEqual(actual);
});
