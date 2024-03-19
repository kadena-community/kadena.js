import { createSignWithKeypair } from '@kadena/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as core from '../../core';
import * as utils from '../../core/utils/with-emitter';
import { deployContract } from '../deploy-contract';
import { contractCode, input } from './test-data';

const clientConfig = {
  host: 'http://127.0.0.1:8080',
  defaults: {
    networkId: 'development',
  },
  sign: createSignWithKeypair([
    { publicKey: 'pubkey', secretKey: 'secretKey' },
  ]),
};

afterEach(() => {
  vi.clearAllMocks();
});

describe('deployContract', () => {
  it('should call submitClient and have the correct return object', async () => {
    const submitClientSpy = vi
      .spyOn(core, 'submitClient')
      .mockImplementationOnce(
        vi.fn().mockReturnValue(utils.withEmitter(vi.fn())),
      );

    const command = deployContract(
      { contractCode, transactionBody: input },
      clientConfig,
    );

    expect(submitClientSpy).toHaveBeenCalledTimes(1);
    expect(command.execute).toBeInstanceOf(Function);
    expect(command.executeTo).toBeInstanceOf(Function);
    expect(command.on).toBeInstanceOf(Function);
  });
});
