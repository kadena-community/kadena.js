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
import { logger } from './helper';

const TEMPLATE_EXTENSION = 'yaml';
const CODE_FILE_EXTENSION = 'pact';

export async function deployMarmaladeContracts(
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

  console.log(templateFiles);
  console.log(codeFiles);

  updateTemplateFilesWithCodeFile(
    templateFiles,
    templateDestinationPath,
    codeFiles,
    codeFileDestinationPath,
  );
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

export function updateTemplateFilesWithCodeFile(
  templateFiles: string[],
  templateDirectory: string,
  codeFiles: string[],
  codeFileDirectory: string,
): void {
  templateFiles.forEach(async (templateFile) => {
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

    yamlContent.codeFile = newCodeFilePath;
    writeFileSync(
      join(templateDirectory, templateFile),
      yaml.dump(yamlContent),
    );
  });
}
