import { dotenv } from '../utils/dotenv';
import { downloadGitFilesFromFolder } from '../utils/downlaod-git-files';
import { logger } from './helper';

export const MARMALADE_TEMPLATE_FOLDER = 'src/devnet/contracts/marmalade-v2';

export async function getMarmaladeTemplates(
  destinationPath: string = process.cwd(),
) {
  logger.info('Downloading marmalade templates');
  try {
    downloadGitFilesFromFolder(
      {
        owner: dotenv.MARMALADE_TEMPLATE_OWNER,
        name: dotenv.MARMALADE_TEMPLATE_REPO,
        folderPath: dotenv.MARMALADE_TEMPLATE_PATH,
        branch: dotenv.MARMALADE_TEMPLATE_BRANCH,
      },
      MARMALADE_TEMPLATE_FOLDER,
    );
  } catch (error) {
    logger.info('Error downloading marmalade templates', error);
    throw error;
  }
}
