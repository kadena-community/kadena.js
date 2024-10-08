import type { ChainId } from '@kadena/types';
import { readdirSync } from 'fs';

import type { IAccount, IClientConfig } from '../../../core/utils/helpers';
import { deployFromDirectory } from '../../deploy-from-directory';
import { deleteLocalFiles, handleDirectorySetup } from '../utils/directory';
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
  defaultChainId,
  defaultClientConfig,
  defaultLocalConfig,
  defaultNamespaceConfig,
  defaultRemoteConfig,
  defaultRepositoryConfig,
} from './defaults';
import { deployMarmaladeNamespaces } from './namespace';

interface IDeployMarmaladeInput {
  sender?: IAccount;
  chainIds?: ChainId[];
  localConfig?: ILocalConfig;
  remoteConfig?: IRemoteConfig;
  repositoryConfig?: IRepositoryConfig;
  namespaceConfig?: INamespaceConfig[];
  namespaceDeployOrder?: string[];
  deploymentArguments?: Record<string, any>;
  clientConfig?: IClientConfig;
  deleteFilesAfterDeployment?: boolean;
}

/**
 * Gets marmalade template, contracts and namespaces from the remote repository and deploys them to the chain.
 * @alpha
 * @param sender - The sender account for deploy marmalade namespaces
 * @param chainIds - The chain ids where the marmalade will be deployed
 * @param localConfig - The local configuration for the marmalade deployment: where the template, code files and namespace files will be stored
 * @param remoteConfig - The remote configuration for the marmalade deployment: the path to the marmalade templates and code files, the file extensions and the exclude folders
 * @param repositoryConfig - The repository configuration for the marmalade deployment: repository related data and the github token
 * @param namespaceConfig - The namespace configuration for the marmalade deployment: the namespace files and the namespaces to be deployed
 * @param deploymentArguments - The deployment arguments for the marmalade deployment: these will replace the holes in the marmalade templates
 * @param clientConfig - The client configuration for the marmalade deployment: the host, the network id and the sender key
 * @param deleteFilesAfterDeployment - If true, the local files will be deleted after the deployment
 */
export const deployMarmalade = async ({
  sender = defaultAccount,
  chainIds = [defaultChainId],
  localConfig = defaultLocalConfig,
  remoteConfig = defaultRemoteConfig,
  repositoryConfig = defaultRepositoryConfig,
  namespaceConfig = defaultNamespaceConfig,
  deploymentArguments = defaultArguments,
  clientConfig = defaultClientConfig,
  deleteFilesAfterDeployment = false,
}: IDeployMarmaladeInput) => {
  try {
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

    /**
     * sort the templates based on the index of the file so that the contracts
     * are deployed in the correct order
     */
    const templateSort = (a: string, b: string) => {
      return Number(a.split('.')[1]) - Number(b.split('.')[1]);
    };

    const templateConfig = {
      path: localConfig.templatePath,
      extension: remoteConfig.templateExtension,
      sort: templateSort,
      namespaceExtractor: (file: string) => {
        return file.split('.')[0];
      },
      deploymentArguments,
    };

    await deployFromDirectory({
      chainIds,
      templateConfig,
      clientConfig,
    });

    /**
     * this is the the templates that will be upgraded; note that this
     * is very specific to the marmalade contracts
     */
    const upgradeTemplatePathsFilter = (file: string) => {
      return (
        file.split('.')[1] === '8' || file.split('.')[3] === 'guard-policy-v1'
      );
    };

    const upgradeTemplateConfig = {
      ...templateConfig,
      deploymentArguments: {
        ...deploymentArguments,
        is_upgrade: 'true',
        upgrade_version_1: 'true',
      },
    };

    console.log(`Deploying Upgraded Marmalade Contracts...`);

    // If the templates are for an upgrade, deploy them
    await deployFromDirectory({
      chainIds,
      templateConfig: upgradeTemplateConfig,
      clientConfig,
      filterFunction: upgradeTemplatePathsFilter,
    });

    if (deleteFilesAfterDeployment) {
      console.log('Deleting local files...');
      deleteLocalFiles(localConfig);
    }
  } catch (error) {
    console.error('Error deploying marmalade contracts:', error);
  }
};
