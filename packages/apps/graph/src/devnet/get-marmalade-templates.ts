import yaml from 'js-yaml';
import { dotenv } from '../utils/dotenv';
import {
  downloadGitFiles,
  getGitAbsolutePath,
} from '../utils/downlaod-git-files';
import { readDir, readFile } from '../utils/path';
import { logger } from './helper';

export async function getMarmaladeFiles(
  destinationPath: string = dotenv.MARMALADE_TEMPLATE_LOCAL_PATH,
): Promise<void> {
  await getMarmaladeTemplates(destinationPath);
  await getCodeFiles(destinationPath);
}

export async function getMarmaladeTemplates(
  destinationPath: string = dotenv.MARMALADE_TEMPLATE_LOCAL_PATH,
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
  templateDestinationPath: string = dotenv.MARMALADE_TEMPLATE_LOCAL_PATH,
  codeFileDestinationPath: string = dotenv.MARMALADE_TEMPLATE_LOCAL_PATH,
) {
  const templateFiles = await readDir(templateDestinationPath);

  templateFiles.forEach(async (file) => {
    const fileContent = await readFile(templateDestinationPath, file);
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
  });
}
