import type { ChainId } from '@kadena/types';
import { readdirSync } from 'fs';

import { submitClient } from '../../../core';
import type { IAccount, IClientConfig } from '../../../core/utils/helpers';
import { deployFromDirectory } from '../../deploy/deploy-from-directory';
import { createPactCommandFromTemplate } from '../../yaml-converter';
import { handleDirectorySetup } from '../utils/directory';
import {
  getCodeFiles,
  getMarmaladeTemplates,
  getNsCodeFiles,
  updateTemplateFilesWithCodeFile,
} from '../utils/file';
import type {
  ILocalConfig,
  INamespaceConfig,
  IRemoteConfig,
  IRepositoryConfig,
} from './config';
import {
  defaultAccount,
  defaultArguments,
  defaultClientConfig,
  defaultNamespaceDeployOrder,
} from './defaults';
import { defaultNamespaceConfig, deployMarmaladeNamespaces } from './namespace';

interface IDeployMarmaladeInput {
  sender?: IAccount;
  chainIds?: ChainId[];
  localConfig: ILocalConfig;
  remoteConfig: IRemoteConfig;
  repositoryConfig: IRepositoryConfig;
  namespaceConfig?: INamespaceConfig[];
  namespaceDeployOrder?: string[];
  deploymentArguments?: Record<string, any>;
  clientConfig?: IClientConfig;
}

export const deployMarmalade = async ({
  sender = defaultAccount,
  chainIds = [],
  localConfig,
  remoteConfig,
  repositoryConfig,
  namespaceConfig = defaultNamespaceConfig,
  namespaceDeployOrder = defaultNamespaceDeployOrder,
  deploymentArguments = defaultArguments,
  clientConfig = defaultClientConfig,
}: IDeployMarmaladeInput) => {
  // Merge the default arguments with the provided arguments
  deploymentArguments = { ...defaultArguments, ...deploymentArguments };
  console.log(deploymentArguments);

  console.log('Preparing directories...');
  handleDirectorySetup(
    localConfig.templatePath,
    localConfig.codeFilesPath,
    localConfig.namespacePath,
  );

  console.log(
    'Downloading marmalade templates and namespace definition files...',
  );

  await Promise.all([
    getMarmaladeTemplates({
      repositoryConfig,
      remoteConfig,
      localConfig,
      flatFolder: true,
    }),

    // Get marmalade namespace definition files
    await getNsCodeFiles({
      repositoryConfig,
      remoteConfig,
      localConfig,
    }),
  ]);

  console.log('Downloading necessary marmalade code files...');

  await getCodeFiles({
    repositoryConfig,
    remoteConfig,
    localConfig,
  });

  // We still need to read the template files and the code files to adjust the codefile paths
  const templateFiles = readdirSync(localConfig.templatePath).filter((file) =>
    file.endsWith(remoteConfig.templateExtension),
  );

  const codeFiles = readdirSync(localConfig.codeFilesPath).filter((file) =>
    file.endsWith(remoteConfig.codefileExtension),
  );

  console.log('Preparing and adjusting the downloaded files...');

  await updateTemplateFilesWithCodeFile(
    templateFiles,
    localConfig.templatePath,
    codeFiles,
    localConfig.codeFilesPath,
  );
  // If no chain ids are provided, use the default chain id from the argument config
  if (chainIds.length === 0) {
    chainIds = [deploymentArguments.chain];
  }

  await Promise.all(
    chainIds.map(async (chainId) => {
      console.log(`Deploying Marmalade Namespaces on chain ${chainId}...`);

      await deployMarmaladeNamespaces({
        sender,
        chainId,
        namespaceConfig,
        namespaceFilesPath: localConfig.namespacePath,
        fileExtension: remoteConfig.codefileExtension,
        networkId: deploymentArguments.network,
        clientConfig,
      });
    }),
  );

  console.log(`Deploying Marmalade Contracts...`);

  /* sort the templates alphabetically so that the contracts are deployed in the correct order
  also taking into account the order provided in the configuration */

  const templateSort = (a: string, b: string) => {
    const indexA = namespaceDeployOrder.findIndex((order) => a.includes(order));
    const indexB = namespaceDeployOrder.findIndex((order) => b.includes(order));

    if (indexA === -1 && indexB === -1) {
      // Neither a nor b are in marmaladeNamespaceOrder, sort alphabetically
      return a.localeCompare(b);
    } else if (indexA === -1) {
      // Only b is in marmaladeNamespaceOrder, b comes first
      return 1;
    } else if (indexB === -1) {
      // Only a is in marmaladeNamespaceOrder, a comes first
      return -1;
    } else {
      // Both a and b are in marmaladeNamespaceOrder, sort based on their positions
      return indexA - indexB;
    }
  };

  const templateConfig = {
    path: localConfig.templatePath,
    extension: remoteConfig.templateExtension,
    sort: templateSort,
    namespaceExtractor: (file: string) => {
      return file.split('.')[0];
    },
    deploymentArguments,
    codeFilesPath: localConfig.codeFilesPath,
  };

  await deployFromDirectory({
    chainIds,
    templateConfig,
    clientConfig,
  });
};
