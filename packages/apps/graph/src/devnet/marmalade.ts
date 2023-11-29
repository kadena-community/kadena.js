import { IPactCommand, Pact, createTransaction } from '@kadena/client';
import { createPactCommandFromTemplate } from '@kadena/client-utils/nodejs';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';
import { join, relative, resolve } from 'path';
import { dotenv } from '../utils/dotenv';
import {
  downloadGitFiles,
  getGitAbsolutePath,
} from '../utils/downlaod-git-files';
import { clearDir } from '../utils/path';
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

export async function deployMarmaladeContracts(
  signerAccount: IAccount,
  templateDestinationPath: string = dotenv.MARMALADE_TEMPLATE_LOCAL_PATH,
  codeFileDestinationPath: string = dotenv.MARMALADE_TEMPLATE_LOCAL_PATH,
) {
  // await clearDir(templateDestinationPath);

  // if (templateDestinationPath !== codeFileDestinationPath) {
  //   await clearDir(codeFileDestinationPath);
  // }

  // console.log('Getting Marmalade Templates');
  // await getMarmaladeTemplates(templateDestinationPath);
  // await getCodeFiles(templateDestinationPath, codeFileDestinationPath);

  const templateFiles = readdirSync(templateDestinationPath).filter((file) =>
    file.endsWith(TEMPLATE_EXTENSION),
  );

  const codeFiles = readdirSync(codeFileDestinationPath).filter((file) =>
    file.endsWith(CODE_FILE_EXTENSION),
  );

  await updateTemplateFilesWithCodeFile(
    templateFiles,
    templateDestinationPath,
    codeFiles,
    codeFileDestinationPath,
  );

  console.log('Deploying Marmalade Contracts');

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

  console.log(pactCommand);

  const transaction = createTransaction(pactCommand);

  console.log(transaction);

  const signedTx = signAndAssertTransaction(signerAccount.keys)(transaction);

  console.log(signedTx);

  const commandResult = await dirtyRead(transaction);

  console.log(commandResult);

  // const commandResult = await submit(signedTx);
  // const result = await listen(commandResult);
  // }
}

export async function hardCodedDeployMarmaladeContract() {
  const pactCommand: IPactCommand = {
    payload: {
      exec: {
        data: {},
        code: "(namespace 'kip) (interface account-protocols-v1   (defconst SINGLE_KEY)   (defun enforce-reserved:bool (account:string guard:string) @doc ) )",
        // code: '(+ 1 1)',
      },
      cont: {},
    },
    meta: {
      chainId: '0',
      sender: 'sender00',
      gasLimit: 100000,
      gasPrice: 1e-7,
      ttl: 600,
      creationTime: 1701266277,
    },
    signers: [
      {
        pubKey:
          '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
        scheme: 'ED25519',
      },
    ],
    networkId: 'fast-development',
    nonce: '',
  };

  const transaction = createTransaction(pactCommand);
  const signedTx = signAndAssertTransaction(sender00.keys)(transaction);
  const commandResult = await dirtyRead(transaction);

  console.log(commandResult);
}

export async function getMarmaladeTemplates(
  destinationPath: string,
): Promise<void> {
  logger.info('Downloading marmalade templates');
  try {
    await downloadGitFiles(
      {
        owner: dotenv.MARMALADE_TEMPLATE_OWNER,
        name: dotenv.MARMALADE_TEMPLATE_REPO,
        path: dotenv.MARMALADE_TEMPLATE_PATH,
        branch: dotenv.MARMALADE_TEMPLATE_BRANCH,
      },
      destinationPath,
    );
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

      console.log('codeFileName', join(templateDirectory, templateFile));
      console.log('codeFileDirectory', join(codeFileDirectory, codeFileName));

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
