import { dotenv } from '../utils/dotenv';
import { downloadGitFilesFromFolder } from '../utils/downlaod-git-files';
import { logger } from './helper';

export async function getMarmaladeFiles(
  destinationPath: string = process.cwd(),
): Promise<void> {
  await getMarmaladeTemplates(destinationPath);
  await getCodeFiles(destinationPath);
}

export async function getMarmaladeTemplates(
  destinationPath: string = process.cwd(),
): Promise<void> {
  logger.info('Downloading marmalade templates');
  try {
    await downloadGitFilesFromFolder(
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
  templateDestinationPath: string = process.cwd(),
) {}
