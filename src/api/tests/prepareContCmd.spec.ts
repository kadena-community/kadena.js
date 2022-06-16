import { kp, nonce, pactId, rollback, step, envData } from './mockdata/contCmd';
import { prepareContCmd } from '../prepareContCmd';

test('Takes in Pact Command fields and outputs signed prepareContCmd Object', () => {
  var actual = prepareContCmd(
    [kp],
    nonce,
    null,
    pactId,
    rollback,
    step,
    envData,
  );

  var expected = {
    hash: 'NjduEShgzrjEmAVhprS85hst7mvCqOo6qjGH5j5WHro',
    sigs: [
      {
        sig: '0640708099ccc99427cc63a56d802091131de3e4ebe22621023fc4d860a15d647a397604e72d11623190fc8819cc0f229f74c14422ada899373b1e98d66a3d09',
      },
    ],
    cmd: '{"networkId":null,"payload":{"cont":{"proof":null,"pactId":"TNgO7o8nSZILVCfJPcg5IjHADy-XKvQ7o5RfAieJvwY","rollback":false,"step":1,"data":{}}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{},"nonce":"\\"step01\\""}',
  };
  expect(expected).toEqual(actual);
});
