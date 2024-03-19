import { existsSync, mkdirSync } from 'fs';
import { clearDir } from '../../services/path';
import type { ILocalConfig } from '../deployment/config';

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

export function deleteLocalFiles(localConfig: ILocalConfig): void {
  const paths = [
    localConfig.templatePath,
    localConfig.codeFilesPath,
    localConfig.namespacePath,
  ];

  const uniquePaths = [...new Set(paths)];

  uniquePaths.forEach((path) => clearDir(path));
}
