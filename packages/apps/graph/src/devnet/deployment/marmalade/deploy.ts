import type { ChainId } from '@kadena/client';
import { createTransaction } from '@kadena/client';
import { createPactCommandFromTemplate } from '@kadena/client-utils/nodejs';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';
import { join, relative } from 'path';

import { downloadGitFiles } from '@services/git/download-git-files';
import { flattenFolder } from '@services/git/path';
import { logger } from '@utils/logger';
import { validateObjectProperties } from '@utils/validate-object';
import type { IAccount } from '../helper';
import { inspect, listen, signAndAssertTransaction, submit } from '../helper';
import { argumentConfig, argumentConfigVersion1Upgrade, marmaladeNamespaceOrder } from './config/arguments';
import { marmaladeNamespaceConfig } from './config/namespaces';
import type {
  IMarmaladeLocalConfig,
  IMarmaladeRemoteConfig,
  IMarmaladeRepository,
} from './config/repository';
import {
  marmaladeLocalConfig,
  marmaladeRemoteConfig,
  marmaladeRepository,
} from './config/repository';
import { handleDirectorySetup } from './directory';
import { deployMarmamaladeNamespaces } from './namespace';

export async function deployMarmaladeContracts(
  signerAccount: IAccount,
  chainIds: ChainId[],
  templateDestinationPath: string = marmaladeLocalConfig.templatePath,
  codeFileDestinationPath: string = marmaladeLocalConfig.codeFilesPath,
  nsDestinationPath: string = marmaladeLocalConfig.namespacePath,
): Promise<void> {
  logger.info('Validating repository data...');
  validateConfig(
    marmaladeRepository,
    marmaladeLocalConfig,
    marmaladeRemoteConfig,
  );

  logger.info('Preparing directories...');
  await handleDirectorySetup(
    templateDestinationPath,
    codeFileDestinationPath,
    nsDestinationPath,
  );

  logger.info('Downloading marmalade templates...');

  await getMarmaladeTemplates({
    repositoryData: marmaladeRepository,
    remoteConfig: marmaladeRemoteConfig,
    localPath: templateDestinationPath,
    flatFolder: true,
  });

  logger.info('Downloading necessary marmalade code files...');

  await getCodeFiles({
    repositoryData: marmaladeRepository,
    localConfigData: marmaladeLocalConfig,
    templateRemotePath: marmaladeRemoteConfig.templatePath,
    fileExtension: marmaladeRemoteConfig.codefileExtension,
  });

  // Get marmalade namespace definition files
  await getNsCodeFiles({
    repositoryData: marmaladeRepository,
    remoteConfigData: marmaladeRemoteConfig,
    localPath: nsDestinationPath,
  });

  logger.info('Preparing and adjusting the downloaded files...');

  const templateFiles = readdirSync(templateDestinationPath).filter((file) =>
    file.endsWith(marmaladeRemoteConfig.templateExtension),
  );

  const upgradeTemplateFiles = templateFiles.filter(f => {
    return f.split(".")[1] === "8"
     || f.split(".")[3] === "guard-policy-v1"
  });

  const codeFiles = readdirSync(codeFileDestinationPath).filter((file) =>
    file.endsWith(marmaladeRemoteConfig.codefileExtension),
  );

  await updateTemplateFilesWithCodeFile(
    templateFiles,
    templateDestinationPath,
    codeFiles,
    codeFileDestinationPath,
  );

  /* sort the templates alphabetically so that the contracts are deployed in the correct order
  also taking into account the order provided in the configuration */

  templateFiles.sort((a, b) => {
    // const indexA = marmaladeNamespaceOrder.findIndex((order) =>
    //   a.includes(order),
    // );
    // const indexB = marmaladeNamespaceOrder.findIndex((order) =>
    //   b.includes(order),
    // );
    //
    // if (indexA === -1 && indexB === -1) {
    //   // Neither a nor b are in marmaladeNamespaceOrder, sort alphabetically
    //   return a.localeCompare(b);
    // } else if (indexA === -1) {
    //   // Only b is in marmaladeNamespaceOrder, b comes first
    //   return 1;
    // } else if (indexB === -1) {
    //   // Only a is in marmaladeNamespaceOrder, a comes first
    //   return -1;
    // } else {
      // Both a and b are in marmaladeNamespaceOrder, sort based on their positions
      return Number(a.split('.')[1]) - Number(b.split('.')[1])
    // }
  });

  // If no chain ids are provided, use the default chain id from the argument config
  if (chainIds.length === 0) {
    chainIds = [argumentConfig.chain];
  }

  await Promise.all(
    chainIds.map(async (chainId) => {
      logger.info(`Deploying Marmalade Namespaces on chain ${chainId}...`);

      await deployMarmamaladeNamespaces({
        localConfigData: marmaladeLocalConfig,
        namespacesConfig: marmaladeNamespaceConfig,
        sender: signerAccount,
        fileExtension: marmaladeRemoteConfig.codefileExtension,
        chainId,
      });

      logger.info(`Deploying Marmalade Contracts on chain ${chainId}...`);

      for (const templateFile of templateFiles) {
        logger.info(`Deploying ${templateFile}...`);

        /* Assuming that the template file name is the same as the namespace
    and that the filename contains the namespace*/
        // argumentConfig.marmalade_namespace = templateFile.split('.')[0];
        // Change the chain id for each chain
        argumentConfig.chain = chainId;

        const pactCommand = await createPactCommandFromTemplate(
          templateFile,
          argumentConfig,
          templateDestinationPath,
        );

        const transaction = createTransaction(pactCommand);
        const signedTx = await signAndAssertTransaction(signerAccount.keys)(
          transaction,
        );
        const commandResult = await submit(signedTx);
        const result = await listen(commandResult);

        if (result.result.status !== 'success') {
          inspect('Result')(commandResult);
        } else {
          logger.info(
            `Sucessfully deployed ${templateFile} on chain ${chainId}`,
          );
        }
      }

      logger.info(`Upgrading Marmalade Contracts on chain ${chainId}...`);

      for (const templateFile of upgradeTemplateFiles) {
        logger.info(`Deploying ${templateFile}...`);

        /* Assuming that the template file name is the same as the namespace
    and that the filename contains the namespace*/
        // argumentConfigVersion1Upgrade.marmalade_namespace = templateFile.split('.')[0];
        // Change the chain id for each chain
        argumentConfigVersion1Upgrade.chain = chainId;

        const pactCommand = await createPactCommandFromTemplate(
          templateFile,
          argumentConfigVersion1Upgrade,
          templateDestinationPath,
        );
        const transaction = createTransaction(pactCommand);

        const signedTx = await signAndAssertTransaction(signerAccount.keys)(
          transaction,
        );
        const commandResult = await submit(signedTx);
        const result = await listen(commandResult);

        if (result.result.status !== 'success') {
          inspect('Result')(commandResult);
        } else {
          logger.info(
            `Sucessfully upgraded ${templateFile} on chain ${chainId}`,
          );
        }
      }

      logger.info(`Finished deploying Marmalade Contracts on chain ${chainId}`);
    }),
  );
}

export async function getMarmaladeTemplates({
  repositoryData,
  remoteConfig,
  localPath,
  flatFolder = true,
}: {
  repositoryData: IMarmaladeRepository;
  remoteConfig: IMarmaladeRemoteConfig;
  localPath: string;
  flatFolder: boolean;
}): Promise<void> {
  try {
    await downloadGitFiles({
      ...repositoryData,
      path: remoteConfig.templatePath,

      localPath,
      fileExtension: remoteConfig.templateExtension,
      drillDown: true,
      excludeFolder: remoteConfig.exclude || [],
    });

    const templateFiles = readdirSync(localPath);

    if (templateFiles.length === 0) {
      throw new Error(
        'No template files found. Please double-check the provided credentials.',
      );
    }

    if (flatFolder) {
      await flattenFolder(localPath, [remoteConfig.templateExtension]);
    }
  } catch (error) {
    logger.info('Error downloading marmalade templates', error);
    throw error;
  }
}

export async function getCodeFiles({
  repositoryData,
  localConfigData,
  templateRemotePath,
  fileExtension,
  basePath = 'pact',
}: {
  repositoryData: IMarmaladeRepository;
  localConfigData: IMarmaladeLocalConfig;
  templateRemotePath: string;
  fileExtension: string;
  basePath?: string;
}): Promise<void> {
  try {
    const templateFiles = readdirSync(localConfigData.templatePath);

    if (templateFiles.length === 0) {
      throw new Error('No template files found');
    }

    await Promise.all(
      templateFiles.map(async (file) => {
        const fileContent = readFileSync(
          join(localConfigData.templatePath, file),
          'utf8',
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const yamlContent = yaml.load(fileContent) as any;

        if (!yamlContent?.codeFile) {
          return;
        }

        const codeFilePath = join(
          basePath,
          yamlContent.codeFile
            .split('/')
            .filter((part: string) => part !== '..' && part !== '.')
            .join('/'),
        );

        // const codeFilePath = getGitAbsolutePath(
        //   join(templateRemotePath, file),
        //   yamlContent.codeFile,
        // );

        await downloadGitFiles({
          ...repositoryData,
          path: codeFilePath,
          localPath: localConfigData.codeFilesPath,
          fileExtension,
        });
      }),
    );
  } catch (error) {
    logger.info('Error getting code files from templates', error);
    throw error;
  }
}

export async function getNsCodeFiles({
  repositoryData,
  remoteConfigData,
  localPath,
}: {
  repositoryData: IMarmaladeRepository;
  remoteConfigData: IMarmaladeRemoteConfig;
  localPath: string;
}): Promise<void> {
  try {
    await Promise.all(
      remoteConfigData.namespacePaths.map(async (path) => {
        await downloadGitFiles({
          ...repositoryData,
          path,
          localPath,
          fileExtension: remoteConfigData.codefileExtension,
        });
      }),
    );
  } catch (error) {
    logger.info('Error getting namespace code files', error);
    throw error;
  }
}

export async function updateTemplateFilesWithCodeFile(
  templateFiles: string[],
  templateDirectory: string,
  codeFiles: string[],
  codeFileDirectory: string,
): Promise<void> {
  try {
    await Promise.all(
      templateFiles.map((templateFile) => {
        const templateFileContent = readFileSync(
          join(templateDirectory, templateFile),
          'utf8',
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const yamlContent = yaml.load(templateFileContent) as any;

        if (!yamlContent?.codeFile) {
          return;
        }

        const codeFileName = yamlContent.codeFile.split('/').pop();

        if (!codeFiles.includes(codeFileName)) {
          throw new Error(`Code file ${codeFileName} not found`);
        }
        const newCodeFilePath = relative(
          templateDirectory,
          join(codeFileDirectory, codeFileName),
        );

        const yamlString = templateFileContent.replace(
          yamlContent.codeFile,
          newCodeFilePath,
        );

        writeFileSync(join(templateDirectory, templateFile), yamlString);
      }),
    );
  } catch (error) {
    logger.info('Error updating template files with code files', error);
    throw error;
  }
}

export function validateConfig(
  repositoryConfig: IMarmaladeRepository,
  localConfig: IMarmaladeLocalConfig,
  remoteConfig: IMarmaladeRemoteConfig,
): void {
  validateObjectProperties(repositoryConfig, 'Repository');
  validateObjectProperties(localConfig, 'Local');
  validateObjectProperties(remoteConfig, 'Remote');
}
