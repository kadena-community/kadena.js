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
import { join, relative, resolve } from 'path';
import { dotenv } from '../utils/dotenv';
import {
  downloadGitFiles,
  getGitAbsolutePath,
  getGitData,
} from '../utils/downlaod-git-files';
import { clearDir, flattenFolder } from '../utils/path';
import { devnetConfig } from './config';
import {
  IAccount,
  IKeyPair,
  dirtyRead,
  listen,
  logger,
  sender00,
  signAndAssertTransaction,
  submit,
} from './helper';
import { marmaladeConfig } from './simulation/config/marmalade';

const TEMPLATE_EXTENSION = 'yaml';
const CODE_FILE_EXTENSION = 'pact';
const EXCLUDE_TEMPLATE_FOLDERS = ['data'];
const MARMALADE_NAMESPACE_FILES = [
  'ns-marmalade.pact',
  'ns-contract-admin.pact',
];

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

export interface ITemplateFile {
  name: string;
  // relative path to the template base path
  relativePath: string;
}

export async function deployMarmaladeContracts(
  signerAccount: IAccount,
  templateDestinationPath: string = dotenv.MARMALADE_TEMPLATE_LOCAL_PATH,
  codeFileDestinationPath: string = dotenv.MARMALADE_TEMPLATE_LOCAL_PATH,
  nsDestinationPath: string = dotenv.MARMALADE_NS_LOCAL_PATH,
) {
  // console.log('Clearing Marmalade Templates');
  // handleDirectorySetup(templateDestinationPath, codeFileDestinationPath);

  // console.log('Getting Marmalade Templates');
  // await getMarmaladeTemplates(
  //   {
  //     owner: dotenv.MARMALADE_TEMPLATE_OWNER,
  //     name: dotenv.MARMALADE_TEMPLATE_REPO,
  //     path: dotenv.MARMALADE_TEMPLATE_PATH,
  //     branch: dotenv.MARMALADE_TEMPLATE_BRANCH,
  //   },
  //   templateDestinationPath,
  // );

  // await getCodeFiles(templateDestinationPath, codeFileDestinationPath);

  // // Get marmalade namespace definition files
  // await getNsCodeFiles(
  //   {
  //     owner: dotenv.MARMALADE_TEMPLATE_OWNER,
  //     name: dotenv.MARMALADE_TEMPLATE_REPO,
  //     path: dotenv.MARMALADE_NS_FILE_PATH,
  //     branch: dotenv.MARMALADE_TEMPLATE_BRANCH,
  //   },
  //   nsDestinationPath,
  // );

  const templateFiles = readdirSync(templateDestinationPath).filter((file) =>
    file.endsWith(TEMPLATE_EXTENSION),
  );

  const codeFiles = readdirSync(codeFileDestinationPath).filter((file) =>
    file.endsWith(CODE_FILE_EXTENSION),
  );

  // console.log(templateFiles);
  // console.log(codeFiles);

  // await updateTemplateFilesWithCodeFile(
  //   templateFiles,
  //   templateDestinationPath,
  //   codeFiles,
  //   codeFileDestinationPath,
  // );

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

  // await deployNamespaceFiles(nsFilePath1, nsFilePath2, nsFilePath3);

  // sort the templates alphabetically so that the contracts are deployed in the correct order
  templateFiles.sort((a, b) => a.localeCompare(b));

  console.log(templateFiles);
  let index = 0;

  for (const templateFile of templateFiles) {
    index++;
    // if (index === 1) continue;
    if (index < 14) continue;

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
): Promise<void> {
  //check if directory exists
  if (!existsSync(templateDestinationPath)) {
    mkdirSync(templateDestinationPath);
  } else {
    await clearDir(templateDestinationPath);
  }

  if (templateDestinationPath !== codeFileDestinationPath) {
    await clearDir(codeFileDestinationPath);
  }
}

export async function getMarmaladeTemplates(
  {
    owner,
    name,
    path,
    branch,
  }: { owner: string; name: string; path: string; branch: string },
  destinationPath: string,
  flatFolder: boolean = true,
): Promise<void> {
  logger.info('Downloading marmalade templates');
  try {
    await downloadGitFiles(
      {
        owner,
        name,
        path,
        branch,
      },
      destinationPath,
      TEMPLATE_EXTENSION,
      true,
    );

    if (flatFolder) {
      await flattenFolder(destinationPath, [TEMPLATE_EXTENSION]);
    }
  } catch (error) {
    logger.info('Error downloading marmalade templates', error);
    throw error;
  }
}

export async function getCodeFiles(
  templateDestinationPath: string,
  codeFileDestinationPath: string,
) {
  const templateFiles = readdirSync(templateDestinationPath);

  await Promise.all(
    templateFiles.map(async (file) => {
      const fileContent = readFileSync(
        join(templateDestinationPath, file),
        'utf8',
      );
      const yamlContent = yaml.load(fileContent) as any;

      if (!yamlContent?.codeFile) {
        return;
      }
      const codeFilePath = getGitAbsolutePath(
        dotenv.MARMALADE_TEMPLATE_PATH,
        yamlContent.codeFile,
      );

      await downloadGitFiles(
        {
          owner: dotenv.MARMALADE_TEMPLATE_OWNER,
          name: dotenv.MARMALADE_TEMPLATE_REPO,
          path: codeFilePath,
          branch: dotenv.MARMALADE_TEMPLATE_BRANCH,
        },
        codeFileDestinationPath,
      );
    }),
  );
}

export async function getNsCodeFiles(
  {
    owner,
    name,
    path,
    branch,
  }: { owner: string; name: string; path: string; branch: string },
  destinationPath: string,
) {
  await downloadGitFiles(
    {
      owner,
      name,
      path,
      branch,
    },
    destinationPath,
    CODE_FILE_EXTENSION,
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

  return;

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
