import type { ChainId } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as deployCodeFile from '../../built-in/deploy-contract';
import { deployFromDirectory } from '../deploy-from-directory';
import * as deployTemplate from '../deploy-template';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('deploy-from-directory', () => {
  const chainId = '2';

  const clientConfig = {
    host: 'http://127.0.0.1:8080',
    defaults: {
      networkId: 'development',
    },
    sign: createSignWithKeypair([
      { publicKey: 'pubkey', secretKey: 'secretKey' },
    ]),
  };

  describe('deploying templates', async () => {
    const templateConfig = {
      path: 'src/nodejs/test/aux-files/deploy-from-directory/template/',
      extension: 'yaml',
      sort: () => 1,
      namespaceExtractor: () => 'namespace',
      deploymentArguments: {
        sender_key: 'sender_key',
        marmalade_user_key_1: 'marmalade_user_key_1',
        marmalade_user_key_2: 'marmalade_user_key_2',
        marmalade_namespace: 'marmalade_namespace',
        is_upgrade: 'false',
        network: 'network',
        chain: chainId,
        sender: 'sender',
      },
    };

    it('should read directory and call deployTemplate with the correct arguments', async () => {
      const deployTemplateSpy = vi
        .spyOn(deployTemplate, 'deployTemplate')
        .mockResolvedValue({
          on: vi.fn().mockResolvedValue({}),
          execute: vi.fn().mockResolvedValue({}),
          executeTo: vi.fn().mockResolvedValue({
            result: {
              status: 'success',
            },
          }),
        });

      await deployFromDirectory({
        chainIds: [chainId],
        templateConfig,
        clientConfig,
      });

      expect(deployTemplateSpy).toHaveBeenNthCalledWith(
        1,
        {
          deployArguments: templateConfig.deploymentArguments,
          workingDirectory: templateConfig.path,
          templatePath: 'marmalade-v2.5.policy-manager.yaml',
        },
        clientConfig,
      );

      expect(deployTemplateSpy).toHaveBeenNthCalledWith(
        2,
        {
          deployArguments: templateConfig.deploymentArguments,
          workingDirectory: templateConfig.path,
          templatePath: 'marmalade-v2.6.ledger.yaml',
        },
        clientConfig,
      );
      expect(deployTemplateSpy).toHaveBeenCalledTimes(2);
    });

    it('template sort argument should impact the order of deployment', async () => {
      const deployTemplateSpy = vi
        .spyOn(deployTemplate, 'deployTemplate')
        .mockResolvedValue({
          on: vi.fn().mockResolvedValue({}),
          execute: vi.fn().mockResolvedValue({}),
          executeTo: vi.fn().mockResolvedValue({
            result: {
              status: 'success',
            },
          }),
        });

      await deployFromDirectory({
        chainIds: [chainId],
        templateConfig: { ...templateConfig, sort: () => -1 },
        clientConfig,
      });

      expect(deployTemplateSpy).toHaveBeenNthCalledWith(
        1,
        {
          deployArguments: templateConfig.deploymentArguments,
          workingDirectory: templateConfig.path,
          templatePath: 'marmalade-v2.6.ledger.yaml',
        },
        clientConfig,
      );

      expect(deployTemplateSpy).toHaveBeenNthCalledWith(
        2,
        {
          deployArguments: templateConfig.deploymentArguments,
          workingDirectory: templateConfig.path,
          templatePath: 'marmalade-v2.5.policy-manager.yaml',
        },
        clientConfig,
      );
      expect(deployTemplateSpy).toHaveBeenCalledTimes(2);
    });

    it('should continue the deployment even if one template fails', async () => {
      const deployTemplateSpy = vi
        .spyOn(deployTemplate, 'deployTemplate')
        .mockResolvedValueOnce({
          on: vi.fn().mockResolvedValueOnce({}),
          execute: vi.fn().mockResolvedValueOnce({}),
          executeTo: vi.fn().mockResolvedValueOnce({
            result: {
              status: 'failure',
            },
          }),
        })
        .mockResolvedValueOnce({
          on: vi.fn().mockResolvedValueOnce({}),
          execute: vi.fn().mockResolvedValueOnce({}),
          executeTo: vi.fn().mockResolvedValueOnce({
            result: {
              status: 'success',
            },
          }),
        });

      await deployFromDirectory({
        chainIds: [chainId],
        templateConfig,
        clientConfig,
      });

      expect(deployTemplateSpy).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if no template or code files are provided', async () => {
      await expect(
        deployFromDirectory({
          chainIds: [chainId],
          clientConfig,
        }),
      ).rejects.toThrow('Please provide a template or a code files directory');
    });

    it('should catch and log the error if one occurs', async () => {
      const deployTemplateSpy = vi
        .spyOn(deployTemplate, 'deployTemplate')
        .mockImplementation(() => {
          throw new Error('test error');
        });

      const consoleSpy = vi.spyOn(console, 'error');

      await deployFromDirectory({
        chainIds: [chainId],
        templateConfig,
        clientConfig,
      });

      expect(consoleSpy).toHaveBeenCalledTimes(2);
      expect(deployTemplateSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('deploying code files', () => {
    const codeFileConfig = {
      path: 'src/nodejs/test/aux-files/deploy-from-directory/codefile/',
      extension: 'pact',
      sort: () => 1,
      namespaceExtractor: () => 'namespace',
      transactionBodyGenerator: () => ({
        chainId: chainId as ChainId,
        networkId: 'network',
        signers: ['signer'],
        meta: {
          gasLimit: 800,
          chainId: chainId as ChainId,
          ttl: 10000,
          senderAccount: 'senderAccount',
        },
        data: { key: 'key', value: 'value' },
        keysets: [{ name: 'name', pred: 'pred', keys: ['key'] }],
      }),
    };

    it('should read directory and call deployCodeFile with the correct arguments', async () => {
      const deployCodeFileSpy = vi
        .spyOn(deployCodeFile, 'deployContract')
        .mockReturnValue({
          on: vi.fn().mockResolvedValue({}),
          execute: vi.fn().mockResolvedValue({}),
          executeTo: vi.fn().mockResolvedValue({
            result: {
              status: 'success',
            },
          }),
        });

      await deployFromDirectory({
        chainIds: [chainId],
        codeFileConfig,
        clientConfig,
      });

      expect(deployCodeFileSpy).toHaveBeenNthCalledWith(
        1,
        {
          contractCode: readFileSync(
            join(codeFileConfig.path, 'ledger.pact'),
            'utf8',
          ),
          transactionBody: codeFileConfig.transactionBodyGenerator(),
        },
        clientConfig,
      );

      expect(deployCodeFileSpy).toHaveBeenNthCalledWith(
        2,
        {
          contractCode: readFileSync(
            join(codeFileConfig.path, 'policy-manager.pact'),
            'utf8',
          ),
          transactionBody: codeFileConfig.transactionBodyGenerator(),
        },
        clientConfig,
      );
      expect(deployCodeFileSpy).toHaveBeenCalledTimes(2);
    });

    it('should read directory and call deployCodeFile with the correct arguments', async () => {
      const deployCodeFileSpy = vi
        .spyOn(deployCodeFile, 'deployContract')
        .mockReturnValue({
          on: vi.fn().mockResolvedValue({}),
          execute: vi.fn().mockResolvedValue({}),
          executeTo: vi.fn().mockResolvedValue({
            result: {
              status: 'success',
            },
          }),
        });

      await deployFromDirectory({
        chainIds: [chainId],
        codeFileConfig: { ...codeFileConfig, sort: () => -1 },
        clientConfig,
      });

      expect(deployCodeFileSpy).toHaveBeenNthCalledWith(
        1,
        {
          contractCode: readFileSync(
            join(codeFileConfig.path, 'policy-manager.pact'),
            'utf8',
          ),
          transactionBody: codeFileConfig.transactionBodyGenerator(),
        },
        clientConfig,
      );
      expect(deployCodeFileSpy).toHaveBeenNthCalledWith(
        2,
        {
          contractCode: readFileSync(
            join(codeFileConfig.path, 'ledger.pact'),
            'utf8',
          ),
          transactionBody: codeFileConfig.transactionBodyGenerator(),
        },
        clientConfig,
      );
    });

    it('should read directory and call deployCodeFile with the correct arguments', async () => {
      const deployCodeFileSpy = vi
        .spyOn(deployCodeFile, 'deployContract')
        .mockReturnValue({
          on: vi.fn().mockResolvedValue({}),
          execute: vi.fn().mockResolvedValue({}),
          executeTo: vi
            .fn()
            .mockResolvedValueOnce({
              result: {
                status: 'failure',
              },
            })
            .mockResolvedValueOnce({
              result: {
                status: 'success',
              },
            }),
        });

      await deployFromDirectory({
        chainIds: [chainId],
        codeFileConfig,
        clientConfig,
      });

      expect(deployCodeFileSpy).toHaveBeenCalledTimes(2);
    });
  });
});
