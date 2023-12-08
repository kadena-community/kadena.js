import type { ChainId, ICommand } from '@kadena/client';
import { Pact, createTransaction } from '@kadena/client';
import { createPactCommandFromTemplate } from '@kadena/client-utils/nodejs';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';
import { join, relative } from 'path';

import { downloadGitFiles } from '@utils/downlaod-git-files';
import { flattenFolder } from '@utils/path';
import { devnetConfig } from '../config';
import type { IAccount, IKeyPair } from '../helper';
import {
  inspect,
  listen,
  logger,
  sender00,
  signAndAssertTransaction,
  submit,
} from '../helper';
import { argumentConfig } from './config/arguments';
import type { IMarmaladeNamespaceConfig } from './config/namespaces';
import {
  marmaladeNamespaceConfig,
  marmaladeNamespaceOrder,
} from './config/namespaces';
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

export async function deployMarmaladeContracts(
  signerAccount: IAccount,
  templateDestinationPath: string = marmaladeLocalConfig.templatePath,
  codeFileDestinationPath: string = marmaladeLocalConfig.codeFilesPath,
  nsDestinationPath: string = marmaladeLocalConfig.namespacePath,
) {
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

  const codeFiles = readdirSync(codeFileDestinationPath).filter((file) =>
    file.endsWith(marmaladeRemoteConfig.codefileExtension),
  );
  await updateTemplateFilesWithCodeFile(
    templateFiles,
    templateDestinationPath,
    codeFiles,
    codeFileDestinationPath,
  );

  logger.info('Deploying Marmalade Namespaces...');

  await deployMarmamaladeNamespaces({
    localConfigData: marmaladeLocalConfig,
    namespacesConfig: marmaladeNamespaceConfig,
    sender: signerAccount,
    fileExtension: marmaladeRemoteConfig.codefileExtension,
  });

  /* sort the templates alphabetically so that the contracts are deployed in the correct order
  also taking into account the order provided in the configuration */

  templateFiles.sort((a, b) => {
    const indexA = marmaladeNamespaceOrder.findIndex((order) =>
      a.includes(order),
    );
    const indexB = marmaladeNamespaceOrder.findIndex((order) =>
      b.includes(order),
    );

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

  logger.info('Deploying Marmalade Contracts...');

  for (const templateFile of templateFiles) {
    logger.info(`Deploying ${templateFile}...`);

    /* Assuming that the template file name is the same as the namespace
    and that the filename contains the namespace*/
    argumentConfig.marmalade_namespace = templateFile.split('.')[0];

    const pactCommand = await createPactCommandFromTemplate(
      templateFile,
      argumentConfig,
      templateDestinationPath,
    );

    const transaction = createTransaction(pactCommand);
    const signedTx = signAndAssertTransaction(signerAccount.keys)(transaction);
    const commandResult = await submit(signedTx);
    const result = await listen(commandResult);
    inspect('Result')(result);
  }
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
}) {
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
}) {
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
}

export async function createPactCommandFromFile(
  filepath: string,
  {
    chainId = devnetConfig.CHAIN_ID,
    networkId = devnetConfig.NETWORK_ID,
    signers = sender00.keys,
    meta = {
      gasLimit: 70000,
      chainId,
      ttl: 8 * 60 * 60,
      senderAccount: sender00.account,
    },
    keysets,
    namespace,
  }: {
    chainId?: ChainId;
    networkId?: string;
    signers?: IKeyPair[];
    meta?: {
      gasLimit: number;
      chainId: ChainId;
      ttl: number;
      senderAccount: string;
    };
    keysets?: { name: string; pred: string; keys: string[] }[];
    namespace?: { key: string; data: string };
  },
): Promise<ICommand> {
  const fileContent = readFileSync(filepath, 'utf8');

  let transactionBuilder = Pact.builder
    .execution(fileContent)
    .setMeta(meta)
    .setNetworkId(networkId);

  transactionBuilder = signers.reduce((builder, signer) => {
    return builder.addSigner(signer.publicKey);
  }, transactionBuilder);

  if (keysets) {
    transactionBuilder = keysets.reduce((builder, keyset) => {
      return builder.addKeyset(keyset.name, keyset.pred, ...keyset.keys);
    }, transactionBuilder);
  }

  if (namespace) {
    transactionBuilder = transactionBuilder.addData(
      namespace.key,
      namespace.data,
    );
  }

  const transaction = transactionBuilder.createTransaction();

  const signedTx = signAndAssertTransaction(signers)(transaction);
  return signedTx;
}

export async function updateTemplateFilesWithCodeFile(
  templateFiles: string[],
  templateDirectory: string,
  codeFiles: string[],
  codeFileDirectory: string,
): Promise<void> {
  await Promise.all(
    templateFiles.map((templateFile) => {
      const templateFileContent = readFileSync(
        join(templateDirectory, templateFile),
        'utf8',
      );
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

      const yamlString = readFileSync(
        join(templateDirectory, templateFile),
        'utf8',
      ).replace(yamlContent.codeFile, newCodeFilePath);

      writeFileSync(join(templateDirectory, templateFile), yamlString);
    }),
  );
}

export async function deployMarmamaladeNamespaces({
  localConfigData,
  namespacesConfig,
  sender = sender00,
  fileExtension,
}: {
  localConfigData: IMarmaladeLocalConfig;
  namespacesConfig: IMarmaladeNamespaceConfig[];
  sender?: IAccount;
  fileExtension: string;
}) {
  const publickeys = sender.keys.map((key) => key.publicKey);

  const namespaceFiles = readdirSync(localConfigData.namespacePath).filter(
    (file) => file.endsWith(fileExtension),
  );

  for (const config of namespacesConfig) {
    const namespaceFilename = namespaceFiles.find((file) =>
      file.includes(config.file),
    );
    if (!namespaceFilename) {
      throw new Error(`Namespace file ${config.file} not found`);
    }

    const namespaceFile = join(
      localConfigData.namespacePath,
      namespaceFilename,
    );

    await Promise.all(
      config.namespaces.map(async (namespace) => {
        let keysets;
        if (config.file === 'ns-contract-admin.pact') {
          keysets = [
            {
              name: `${namespace}.marmalade-contract-admin`,
              keys: publickeys,
              pred: 'keys-all',
            },
          ];
        } else if (config.file === 'fungible-util.pact') {
          keysets = [
            {
              name: 'util-ns-admin',
              keys: publickeys,
              pred: 'keys-all',
            },
          ];
        } else {
          keysets = [
            {
              name: 'marmalade-admin',
              keys: publickeys,
              pred: 'keys-all',
            },
            {
              name: 'marmalade-user',
              keys: publickeys,
              pred: 'keys-all',
            },
          ];
        }

        const transaction = await createPactCommandFromFile(namespaceFile, {
          namespace: {
            key: 'ns',
            data: namespace,
          },
          keysets,
        });

        logger.info(
          `Deploying namespace file ${config.file} for ${namespace}...}`,
        );

        const transactionDescriptor = await submit(transaction);
        const commandResult = await listen(transactionDescriptor);
        inspect('Result')(commandResult);
      }),
    );
  }
}
