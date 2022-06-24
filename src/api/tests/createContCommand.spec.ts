import createContCommand from '../createContCommand';
import {
  keyPair,
  nonce,
  pactId,
  rollback,
  step,
  envData,
  meta,
  networkId,
} from './mockdata/contCmd';

test('Takes in cont command parameters and outputs a command formatted for /send endpoint', () => {
  const actual = createContCommand(
    [keyPair],
    nonce,
    step,
    pactId,
    rollback,
    envData,
    meta,
    null,
    networkId,
  );

  const expected = {
    cmds: [
      {
        hash: 'neA9dm-puxrTzdyUu466mDv6fagpnHxKPnSaAHuiM2Q',
        sigs: [
          {
            sig: 'dfae888ddbd4d96e90749e2c2d599517095d999da518b5f07bd14307248acd018f82b01c1925af17c5a3f6e2c3938a765d5f53baf713c365dbcec9997a477e00',
          },
        ],
        cmd: '{"networkId":null,"payload":{"cont":{"proof":null,"pactId":"TNgO7o8nSZILVCfJPcg5IjHADy-XKvQ7o5RfAieJvwY","rollback":false,"step":1,"data":{}}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
      },
    ],
  };

  expect(expected).toEqual(actual);
});
