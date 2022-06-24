import attachSignature from '../attachSignature';
import { keyPair, msg } from './mockdata/execCmd';

test('Takes in stringified cmd and keyPairs, and outputs signatures with hash', () => {
  const actual = attachSignature(msg, [keyPair]);
  const expected = [
    {
      hash: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
      pubKey:
        'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
      sig: '4b0ecfbb0e8f3cb291b57abd27028ceaa221950affa39f10efbf4a5fe740d32670e94c3d3949a7e5f4f6ea692052ca110f7cb2e9a8ee2c5eff4251ed84bbfa03',
    },
  ];

  expect(expected).toEqual(actual);
});
