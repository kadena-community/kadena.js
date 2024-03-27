import type { IPactCommand } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as core from '../../core';
import * as utils from '../../core/utils/with-emitter';
import { deployTemplate } from '../deploy-template';
import * as yamlConverter from '../yaml-converter';

const clientConfig = {
  host: 'http://127.0.0.1:8080',
  defaults: {
    networkId: 'development',
  },
  sign: createSignWithKeypair([
    { publicKey: 'pubkey', secretKey: 'secretKey' },
  ]),
};

const testArguments = {
  sender_key:
    'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  marmalade_user_key_1:
    '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  marmalade_user_key_2:
    'f90ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
  marmalade_namespace: 'test-namespace',
  is_upgrade: 'false',
  network: 'testnet',
  chain: 1,
  'gas-station-name': 'my-gas-station',
  sender: 'my-test-sender',
  nonce: 'real-policy-manager-nonce',
};
const testFile = './aux-files/real-policy-manager-test.yaml';

afterEach(() => {
  vi.clearAllMocks();
});

describe('deploy-template', () => {
  it('should call submitClient and have the correct return object', async () => {
    const submitClientSpy = vi
      .spyOn(core, 'submitClient')
      .mockImplementationOnce(
        vi.fn().mockReturnValue(utils.withEmitter(vi.fn())),
      );

    const command = await deployTemplate(
      {
        templatePath: testFile,
        deployArguments: testArguments,
        workingDirectory: __dirname,
      },
      clientConfig,
    );

    console.log(command);

    expect(submitClientSpy).toHaveBeenCalledTimes(1);
    expect(command.execute).toBeInstanceOf(Function);
    expect(command.executeTo).toBeInstanceOf(Function);
    expect(command.on).toBeInstanceOf(Function);
  });
  it('should call createPactCommandFromTemplate with the correct arguments', async () => {
    const createPactCommandFromTemplateSpy = vi
      .spyOn(yamlConverter, 'createPactCommandFromTemplate')
      .mockResolvedValueOnce({} as IPactCommand);

    await deployTemplate(
      {
        templatePath: testFile,
        deployArguments: testArguments,
        workingDirectory: __dirname,
      },
      clientConfig,
    );

    expect(createPactCommandFromTemplateSpy).toHaveBeenCalledTimes(1);
    expect(createPactCommandFromTemplateSpy).toHaveBeenCalledWith(
      testFile,
      testArguments,
      __dirname,
    );
  });
  it('should call createPactCommandFromTemplate with an empty object', async () => {
    const createPactCommandFromTemplateSpy = vi
      .spyOn(yamlConverter, 'createPactCommandFromTemplate')
      .mockResolvedValueOnce({} as IPactCommand);

    await deployTemplate(
      {
        templatePath: testFile,
        workingDirectory: __dirname,
      },
      clientConfig,
    );

    expect(createPactCommandFromTemplateSpy).toHaveBeenCalledTimes(1);
    expect(createPactCommandFromTemplateSpy).toHaveBeenCalledWith(
      testFile,
      {},
      __dirname,
    );
  });
});
