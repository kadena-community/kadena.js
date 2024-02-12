import type { ChainId } from '@kadena/types';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { deployContract } from '../../../built-in/deploy-contract';
import type { IAccount, IClientConfig } from '../../../core/utils/helpers';
import type { INamespaceConfig } from './config';
import {
  defaultAccount,
  defaultChainId,
  defaultNamespaceConfig,
  defaultNetworkId,
} from './defaults';

interface IDeployMarmaladeNamespacesInput {
  sender?: IAccount;
  chainId?: ChainId;
  networkId?: string;
  namespaceFilesPath: string;
  fileExtension?: string;
  namespaceConfig: INamespaceConfig[];
  clientConfig: IClientConfig;
}

export const deployMarmaladeNamespaces = async ({
  sender = defaultAccount,
  chainId = defaultChainId,
  networkId = defaultNetworkId,
  namespaceFilesPath,
  fileExtension = 'pact',
  namespaceConfig = defaultNamespaceConfig,
  clientConfig,
}: IDeployMarmaladeNamespacesInput) => {
  const namespaceFiles = readdirSync(namespaceFilesPath).filter((file) =>
    file.endsWith(fileExtension),
  );

  for (const config of namespaceConfig) {
    const namespaceFilename = namespaceFiles.find((file) =>
      file.includes(config.file),
    );
    if (!namespaceFilename) {
      throw new Error(`Namespace file ${config.file} not found`);
    }

    const namespaceFile = join(namespaceFilesPath, namespaceFilename);

    await Promise.all(
      config.namespaces.map(async (namespace) => {
        let keysets;
        const keys = sender.publicKeys || [];
        const pred = 'keys-all';

        /* We need to define the keysets for each namespace since
          they are different */
        if (config.file === 'ns-contract-admin.pact') {
          keysets = [
            {
              name: `${namespace}.marmalade-contract-admin`,
              keys,
              pred,
            },
          ];
        } else if (config.file === 'fungible-util.pact') {
          keysets = [
            {
              name: 'util-ns-admin',
              keys,
              pred,
            },
          ];
        } else {
          keysets = [
            {
              name: 'marmalade-admin',
              keys,
              pred,
            },
            {
              name: 'marmalade-user',
              keys,
              pred,
            },
          ];
        }
        try {
          console.log(
            `Deploying namespace file ${config.file} for ${namespace}`,
          );

          const commandResult = await deployContract(
            {
              contractCode: readFileSync(namespaceFile, 'utf8'),
              transactionBody: {
                chainId,
                keysets,
                data: {
                  key: 'ns',
                  value: namespace,
                },
                signers: keys,
                networkId,
                meta: {
                  gasLimit: 70000,
                  chainId,
                  ttl: 8 * 60 * 60,
                  senderAccount: sender.account,
                },
              },
            },
            clientConfig,
          ).executeTo('listen');
          if (commandResult.result.status !== 'success') {
            throw new Error(
              `Failed to deploy namespace ${namespace} on chain ${chainId}. Error: ${commandResult.result.error}`,
            );
          } else {
            console.log(
              `Successfully deployed namespace ${namespace} on chain ${chainId}`,
            );
          }
        } catch (error) {
          console.log(error);
        }
      }),
    );
  }
};
