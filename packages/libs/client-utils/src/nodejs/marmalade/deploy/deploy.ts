import { ChainId } from '@kadena/types';
import { readdirSync } from 'fs';
import { IAccount } from '../../../core/utils/helpers';
import {
  defaultArguments,
  defaultNamespaceDeployOrder,
} from '../utils/defaults';
import { handleDirectorySetup } from '../utils/directory';
import {
  getCodeFiles,
  getMarmaladeTemplates,
  getNsCodeFiles,
  updateTemplateFilesWithCodeFile,
} from '../utils/file';
import {
  ILocalConfig,
  INamespaceConfig,
  IRemoteConfig,
  IRepositoryConfig,
} from './config';
import { defaultNamespaceConfig, deployMarmaladeNamespaces } from './namespace';

interface IDeployMarmaladeInput {
  sender: IAccount;
  chainIds: ChainId[];
  localConfig: ILocalConfig;
  remoteConfig: IRemoteConfig;
  repositoryConfig: IRepositoryConfig;
  namespaceConfig?: INamespaceConfig[];
  namespaceDeployOrder?: string[];
  deploymentArguments?: Record<string, any>;
}

export const deployMarmalade = async ({
  sender,
  chainIds,
  localConfig,
  remoteConfig,
  repositoryConfig,
  namespaceConfig = defaultNamespaceConfig,
  namespaceDeployOrder = defaultNamespaceDeployOrder,
  deploymentArguments = defaultArguments,
}: IDeployMarmaladeInput) => {
  console.log('Preparing directories...');
  handleDirectorySetup(
    localConfig.templatePath,
    localConfig.codeFilesPath,
    localConfig.namespacePath,
  );

  console.log(
    'Downloading marmalade templates and namespace definition files...',
  );

  Promise.all([
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

  console.log('Preparing and adjusting the downloaded files...');

  const templateFiles = readdirSync(localConfig.templatePath).filter((file) =>
    file.endsWith(remoteConfig.templateExtension),
  );

  const codeFiles = readdirSync(localConfig.codeFilesPath).filter((file) =>
    file.endsWith(remoteConfig.codefileExtension),
  );

  await updateTemplateFilesWithCodeFile(
    templateFiles,
    localConfig.templatePath,
    codeFiles,
    localConfig.codeFilesPath,
  );

  /* sort the templates alphabetically so that the contracts are deployed in the correct order
  also taking into account the order provided in the configuration */

  templateFiles.sort((a, b) => {
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
  });

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
        clientConfig: {
          sign:
        }
      });
    }),
  );
};
