import { ICommand } from '@kadena/types';

import { prepareContCommand } from '../prepareContCommand';

import {
  command,
  envData,
  keyPairs,
  meta,
  nonce,
  pactId,
  rollback,
  step,
} from './mockdata/contCommand';

describe('prepareContCommand', () => {
  it('Creates a signed Pact ContICommandObject with undefined `proof` and `networkId`', () => {
    const actual = prepareContCommand(
      keyPairs,
      nonce,
      undefined, // proof
      pactId,
      rollback,
      step,
      meta,
      undefined, // networkId
      envData,
    );

    const expected = command;
    expect(expected).toEqual(actual);
  });

  it('Creates a signed Pact ContICommandObject with networkId=Mainnet01 and a mock proof', () => {
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

  it('Creates a signed Pact ContICommandObject with undefined envData', () => {
    const actual = prepareContCommand(
      keyPairs,
      nonce,
      'fakeProof',
      pactId,
      rollback,
      step,
      meta,
      'Mainnet01',
      undefined, // envData
    );

    const expected: ICommand = {
      hash: '3eVrb7If4TlWevuiILS6_vKGNSRzjTfDMqCiWdiyzSc',
      sigs: [
        {
          sig: '59d57d3ec58faf2caf550249a5499f2f0a3ce968aaf41e2f13182533c2bd2eb01a55a276eddd28da775cb7bf2cf4b711ffbb565b7cb7742e1b45298627395504',
        },
      ],
      cmd: '{"networkId":"Mainnet01","payload":{"cont":{"proof":"fakeProof","pactId":"TNgO7o8nSZILVCfJPcg5IjHADy-XKvQ7o5RfAieJvwY","rollback":false,"step":1,"data":null}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
    };

    expect(expected).toEqual(actual);
  });
});
