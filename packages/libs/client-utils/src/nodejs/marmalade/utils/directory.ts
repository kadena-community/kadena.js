import { existsSync, mkdirSync } from 'fs';
import { clearDir } from '../../services/path';

export function handleDirectorySetup(
  templateDestinationPath: string,
  codeFileDestinationPath: string,
  nsFilesDestinationPath: string,
): void {
  //check if directory exists
  if (!existsSync(templateDestinationPath)) {
    mkdirSync(templateDestinationPath);
  } else {
    clearDir(templateDestinationPath);
  }

  if (templateDestinationPath !== codeFileDestinationPath) {
    if (!existsSync(codeFileDestinationPath)) {
      mkdirSync(codeFileDestinationPath);
    } else {
      clearDir(codeFileDestinationPath);
    }
  }

  if (!existsSync(nsFilesDestinationPath)) {
    mkdirSync(nsFilesDestinationPath);
  } else {
    clearDir(nsFilesDestinationPath);
  }
}
