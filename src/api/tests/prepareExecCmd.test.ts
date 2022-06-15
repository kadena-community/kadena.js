import { kp, nonce, pactCode, envData } from './mockdata/execCmd';
import { prepareExecCmd } from '../prepareExecCmd';

test('Takes in Pact Command fields and outputs signed prepareExecCmd Object', () => {
  var actual = prepareExecCmd(kp, nonce, pactCode, envData);
  var expected = {
    hash: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
    sigs: [
      {
        sig: undefined,
      },
    ],
    cmd: '{"networkId":null,"payload":{"exec":{"data":{"accounts-admin-keyset":["ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"]},"code":"(define-keyset \'k (read-keyset \\"accounts-admin-keyset\\"))\\n(module system \'k\\n  (defun get-system-time ()\\n    (time \\"2017-10-31T12:00:00Z\\")))\\n(get-system-time)"}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
  };
  expect(expected).toEqual(actual);
});
