import { clearDir } from '@services/git/path';
import { existsSync, mkdirSync } from 'fs';

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
