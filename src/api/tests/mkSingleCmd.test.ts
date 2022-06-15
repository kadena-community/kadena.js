import { mkSingleCmd } from '../mkSingleCmd';
import pactTestCommand from './mockdata/Pact';

test('Takes in sign object and cmd object and outputs singleCmd formatted for API requests', () => {
  var sign = [
    {
      hash: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
      sig: '4b0ecfbb0e8f3cb291b57abd27028ceaa221950affa39f10efbf4a5fe740d32670e94c3d3949a7e5f4f6ea692052ca110f7cb2e9a8ee2c5eff4251ed84bbfa03',
      pubKey:
        'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    },
  ];

  var actual = mkSingleCmd(sign, JSON.stringify(pactTestCommand));
  var expected = {
    hash: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
    sigs: [
      {
        sig: '4b0ecfbb0e8f3cb291b57abd27028ceaa221950affa39f10efbf4a5fe740d32670e94c3d3949a7e5f4f6ea692052ca110f7cb2e9a8ee2c5eff4251ed84bbfa03',
      },
    ],
    cmd: '{"networkId":null,"payload":{"exec":{"data":{"accounts-admin-keyset":["ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"]},"code":"(define-keyset \'k (read-keyset \\"accounts-admin-keyset\\"))\\n(module system \'k\\n  (defun get-system-time ()\\n    (time \\"2017-10-31T12:00:00Z\\")))\\n(get-system-time)"}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
  };

  expect(expected).toEqual(actual);
});
