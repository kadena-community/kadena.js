import {
  ChainId,
  ICommand,
  IPactCommand,
  Pact,
  createTransaction,
} from '@kadena/client';
import { createPactCommandFromTemplate } from '@kadena/client-utils/nodejs';
import {
  existsSync,
  mkdir,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'fs';
import yaml from 'js-yaml';
import { join, normalize, relative, resolve } from 'path';
import { dotenv } from '../../utils/dotenv';
import {
  downloadGitFiles,
  getGitAbsolutePath,
  getGitData,
} from '../../utils/downlaod-git-files';
import { clearDir, flattenFolder } from '../../utils/path';
import { devnetConfig } from '../config';
import {
  IAccount,
  IKeyPair,
  dirtyRead,
  listen,
  logger,
  sender00,
  signAndAssertTransaction,
  submit,
} from '../helper';
import { marmaladeConfig } from './config/arguments';
import { IMarmaladeNamespaceConfig } from './config/namespaces';
import {
  IMarmaladeLocalConfig,
  IMarmaladeRemoteConfig,
  IMarmaladeRepository,
  marmaladeLocalConfig,
  marmaladeRemoteConfig,
  marmaladeRepository,
} from './config/repository';

// const MARMALADE_NAMESPACE_DEPLOYMENTS = [
//   {
//     namespace: 'marmalade-v2',
//     files: MARMALADE_NAMESPACE_FILES,
//   },
//   {
//     namespace: 'marmalade-sale',
//     files: MARMALADE_NAMESPACE_FILES,
//   },
//   {
//     namespace: 'kip',
//     files: ['ns-marmalade.pact'],
//   },
// ];

const MARMALADE_NAMESPACES = ['marmalade-v2', 'marmalade-sale'];

export async function deployMarmaladeContracts(
  signerAccount: IAccount,
  templateDestinationPath: string = marmaladeLocalConfig.templatePath,
  codeFileDestinationPath: string = marmaladeLocalConfig.codeFilesPath,
  nsDestinationPath: string = marmaladeLocalConfig.namespacePath,
) {
  logger.info('Preparing directories...');
  handleDirectorySetup(
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

  const templateFiles = readdirSync(templateDestinationPath).filter((file) =>
    file.endsWith(marmaladeRemoteConfig.templateExtension),
  );

  const codeFiles = readdirSync(codeFileDestinationPath).filter((file) =>
    file.endsWith(marmaladeRemoteConfig.codefileExtension),
  );

  console.log(templateFiles);
  console.log(codeFiles);

  await updateTemplateFilesWithCodeFile(
    templateFiles,
    templateDestinationPath,
    codeFiles,
    codeFileDestinationPath,
  );

  logger.info('Deploying Marmalade Namespaces');

  await deployNamespaceFiles();

  return;

  console.log('Deploying Marmalade Namespaces');

  const nsFiles = readdirSync(nsDestinationPath).filter((file) =>
    file.endsWith(CODE_FILE_EXTENSION),
  );

  console.log(nsFiles);

  const nsFile1 = nsFiles[0];
  const nsFilePath1 = join(nsDestinationPath, nsFile1);

  const nsFile2 = nsFiles[1];
  const nsFilePath2 = join(nsDestinationPath, nsFile2);

  const nsFile3 = nsFiles[2];
  const nsFilePath3 = join(nsDestinationPath, nsFile3);

  console.log('Deploying Marmalade Contracts');

  await deployNamespaceFiles(nsFilePath1, nsFilePath2, nsFilePath3);

  // sort the templates alphabetically so that the contracts are deployed in the correct order
  templateFiles.sort((a, b) => a.localeCompare(b));

  console.log(templateFiles);

  for (const templateFile of templateFiles) {
    const templateFilePath = join(templateDestinationPath, templateFile);

    console.log(templateFilePath);
    const pactCommand = await createPactCommandFromTemplate(
      templateFile,
      marmaladeConfig,
      templateDestinationPath,
    );

    const transaction = createTransaction(pactCommand);

    console.log(transaction);

    const signedTx = signAndAssertTransaction(signerAccount.keys)(transaction);

    const dirtyReadResult = await dirtyRead(transaction);
    console.log(dirtyReadResult);

    const commandResult = await submit(signedTx);
    const result = await listen(commandResult);

    console.log(result);
  }
}

export async function handleDirectorySetup(
  templateDestinationPath: string,
  codeFileDestinationPath: string,
  nsFilesDestinationPath: string,
): Promise<void> {
  //check if directory exists
  if (!existsSync(templateDestinationPath)) {
    mkdirSync(templateDestinationPath);
  } else {
    await clearDir(templateDestinationPath);
  }

  if (templateDestinationPath !== codeFileDestinationPath) {
    if (!existsSync(codeFileDestinationPath)) {
      mkdirSync(codeFileDestinationPath);
    } else {
      await clearDir(codeFileDestinationPath);
    }
  }

  if (!existsSync(nsFilesDestinationPath)) {
    mkdirSync(nsFilesDestinationPath);
  } else {
    await clearDir(nsFilesDestinationPath);
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

  const publicKeys = sender00.keys.map((key) => key.publicKey);

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

  await Promise.all(
    namespacesConfig.map((config) => {
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

      config.namespaces.forEach(async (namespace) => {
        let keysets;
        if (config.file === 'ns-contract-admin.pact') {
          keysets = [
            {
              name: `${namespace}.marmalade-contract-admin`,
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

        const transactionDescriptor = await submit(transaction);
        const commandResult = await listen(transactionDescriptor);
        console.log(commandResult);
      });
    }),
  );
}

export async function deployNamespaceFiles(
  nsMarmaladeFilepath: string,
  nsContractAdminFilepath: string,
  nsUtilsGuards1Filepath: string,
  sender: IAccount = sender00,
) {
  const publickeys = sender.keys.map((key) => key.publicKey);

  const transaction5 = await createPactCommandFromFile(nsUtilsGuards1Filepath, {
    namespace: {
      key: 'ns',
      data: 'util',
    },
    keysets: [
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
    ],
  });

  const result5 = await submit(transaction5);
  const listen5 = await listen(result5);
  console.log(listen5);

  for (const namespace of MARMALADE_NAMESPACES) {
    const transaction1 = await createPactCommandFromFile(nsMarmaladeFilepath, {
      namespace: {
        key: 'ns',
        data: namespace,
      },
      keysets: [
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
      ],
    });

    const result1 = await submit(transaction1);
    const listen1 = await listen(result1);
    console.log(listen1);

    const transaction2 = await createPactCommandFromFile(
      nsContractAdminFilepath,
      {
        namespace: {
          key: 'ns',
          data: namespace,
        },
        keysets: [
          {
            name: `${namespace}.marmalade-contract-admin`,
            keys: publickeys,
            pred: 'keys-all',
          },
        ],
      },
    );

    const result2 = await submit(transaction2);
    const listen2 = await listen(result2);
    console.log(listen2);
  }

  const transaction3 = await createPactCommandFromFile(nsMarmaladeFilepath, {
    namespace: {
      key: 'ns',
      data: 'kip',
    },
    keysets: [
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
    ],
  });

  const result3 = await submit(transaction3);
  const listen3 = await listen(result3);
  console.log(listen3);

  const transaction4 = await createPactCommandFromFile(nsMarmaladeFilepath, {
    namespace: {
      key: 'ns',
      data: 'util',
    },
    keysets: [
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
    ],
  });

  const result4 = await submit(transaction4);
  const listen4 = await listen(result4);
  console.log(listen4);
}
