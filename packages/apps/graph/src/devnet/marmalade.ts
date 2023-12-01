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
  console.log('Clearing Marmalade Templates');
  handleDirectorySetup(templateDestinationPath, codeFileDestinationPath);

  console.log('Getting Marmalade Templates');
  await getMarmaladeTemplates(
    {
      owner: dotenv.MARMALADE_TEMPLATE_OWNER,
      name: dotenv.MARMALADE_TEMPLATE_REPO,
      path: dotenv.MARMALADE_TEMPLATE_PATH,
      branch: dotenv.MARMALADE_TEMPLATE_BRANCH,
    },
    templateDestinationPath,
  );

  await getCodeFiles(templateDestinationPath, codeFileDestinationPath);

  // Get marmalade namespace definition files
  await getNsCodeFiles(
    {
      owner: dotenv.MARMALADE_TEMPLATE_OWNER,
      name: dotenv.MARMALADE_TEMPLATE_REPO,
      path: dotenv.MARMALADE_NS_FILE_PATH,
      branch: dotenv.MARMALADE_TEMPLATE_BRANCH,
    },
    nsDestinationPath,
  );

  const templateFiles = readdirSync(templateDestinationPath).filter((file) =>
    file.endsWith(TEMPLATE_EXTENSION),
  );

  const codeFiles = readdirSync(codeFileDestinationPath).filter((file) =>
    file.endsWith(CODE_FILE_EXTENSION),
  );

  // if (flattenSubfolders) {
  //   flattenFolder(destinationPath, [TEMPLATE_EXTENSION]);
  // }

  console.log(templateFiles);
  console.log(codeFiles);

  await updateTemplateFilesWithCodeFile(
    templateFiles,
    templateDestinationPath,
    codeFiles,
    codeFileDestinationPath,
  );

  return;

  console.log('Deploying Marmalade Namespaces');

  const nsFiles = readdirSync(nsDestinationPath).filter((file) =>
    file.endsWith(CODE_FILE_EXTENSION),
  );

  const nsFile = nsFiles[0];
  const nsFilePath = join(nsDestinationPath, nsFile);

  console.log('Deploying Marmalade Contracts');

  const nsTransaction = await createPactCommandFromFile(nsFilePath);
  const dirtyReadResult1 = await dirtyRead(nsTransaction);
  console.log(dirtyReadResult1);

  return;

  // sort the templates alphabetically so that the contracts are deployed in the correct order
  templateFiles.sort((a, b) => a.localeCompare(b));

  console.log(templateFiles);

  // for (const templateFile of templateFiles) {

  const templateFile = templateFiles[0];
  const templateFilePath = join(templateDestinationPath, templateFile);

  console.log(templateFilePath);
  const pactCommand = await createPactCommandFromTemplate(
    templateFile,
    marmaladeConfig,
    templateDestinationPath,
  );

  const transaction = createTransaction(pactCommand);

  const signedTx = signAndAssertTransaction(signerAccount.keys)(transaction);

  const dirtyReadResult = await dirtyRead(transaction);
  console.log(dirtyReadResult);

  // const commandResult = await submit(signedTx);
  // const result = await listen(commandResult);

  // console.log(result);
  // }
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
  nsFilePath: string,
  chainId: ChainId = devnetConfig.CHAIN_ID,
): Promise<ICommand> {
  const fileContent = readFileSync(nsFilePath, 'utf8');

  const transaction = Pact.builder
    .execution(fileContent)
    .addSigner(sender00.keys.map((key) => key.publicKey))
    .addData('ns', 'marmalade-v2')
    .setNetworkId(devnetConfig.NETWORK_ID)
    .setMeta({
      gasLimit: 1500,
      chainId,
      senderAccount: sender00.account,
      ttl: 8 * 60 * 60, //8 hours
    })

    .createTransaction();

  console.log(transaction);

  const signedTx = signAndAssertTransaction(sender00.keys)(transaction);
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
