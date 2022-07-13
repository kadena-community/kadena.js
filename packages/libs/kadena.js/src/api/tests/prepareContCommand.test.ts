import { ICommand } from '@kadena/types';

import { prepareContCommand } from '../prepareContCommand';

import {
  command,
  envData,
  keyPairs,
  meta,
  networkId,
  nonce,
  pactId,
  proof,
  rollback,
  step,
} from './mockdata/contCommand';

describe('prepareContCommand', () => {
  it('Takes in Pact ICommandparameters and outputs a signed Pact ContICommandObject', () => {
    const actual = prepareContCommand(
      keyPairs,
      nonce,
      proof,
      pactId,
      rollback,
      step,
      meta,
      networkId,
      envData,
    );

    const expected = command;
    expect(expected).toEqual(actual);
  });

  it('takes in Pact ICommandparameters with networkId mainnet and outputs a signed Pact ContICommandObject', () => {
    const actual = prepareContCommand(
      keyPairs,
      nonce,
      'fakeProof',
      pactId,
      rollback,
      step,
      meta,
      'Mainnet01',
      envData,
    );

    const expected: ICommand = {
      hash: 's5o_HxDkmMYABff21J_3xUMPi4nx0dt-NBHOa3Rjgio',
      sigs: [
        {
          sig: '3c7b915f10e02c7ae384c0ed0c4a960f70677743dd223b790c778972148f1e310a93e81f16bb480bf99f46b05611c6159e8897a7b9755c754d37f9ad8fbd750d',
        },
      ],
      cmd: '{"networkId":"Mainnet01","payload":{"cont":{"proof":"fakeProof","pactId":"TNgO7o8nSZILVCfJPcg5IjHADy-XKvQ7o5RfAieJvwY","rollback":false,"step":1,"data":{}}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
    };

    expect(expected).toEqual(actual);
  });
});
