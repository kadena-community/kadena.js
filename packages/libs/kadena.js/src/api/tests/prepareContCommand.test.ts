import type { ICommand } from '@kadena/types';
import { describe, expect, it } from 'vitest';
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
    expect(actual).toEqual(expected);
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
      hash: 'gKL0Hd4kzpgVVkjytvwNbhG4_QROpLWr2wjE9VGMwqI',
      sigs: [
        {
          sig: 'd1120957d56ae9caacfdd0bd0f69c068ccc1d637fb16bce9c9ca51564cbde5828395c406e5d33e2edb23dbdf1969aee55e75032ebaf51291a9bc42103afe210a',
        },
      ],
      cmd: '{"networkId":"Mainnet01","payload":{"cont":{"proof":"fakeProof","pactId":"TNgO7o8nSZILVCfJPcg5IjHADy-XKvQ7o5RfAieJvwY","rollback":false,"step":1,"data":{}}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"0","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
    };

    expect(actual).toEqual(expected);
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
      hash: 'W8ub0u-3T39wB1JOa6i1Z6wzm56mRI_U9cwR7AF-5TY',
      sigs: [
        {
          sig: 'fe164bffb8627ac17066d26880a6fad506b6909384117b0f2eb85c791639364e1b51e5ae7872b298e6f7d8ad6c5175290fbd1866ea1fdd57512bde0e0efec305',
        },
      ],
      cmd: '{"networkId":"Mainnet01","payload":{"cont":{"proof":"fakeProof","pactId":"TNgO7o8nSZILVCfJPcg5IjHADy-XKvQ7o5RfAieJvwY","rollback":false,"step":1,"data":null}},"signers":[{"pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"meta":{"creationTime":0,"ttl":0,"gasLimit":0,"chainId":"0","gasPrice":0,"sender":""},"nonce":"\\"step01\\""}',
    };

    expect(actual).toEqual(expected);
  });
});
