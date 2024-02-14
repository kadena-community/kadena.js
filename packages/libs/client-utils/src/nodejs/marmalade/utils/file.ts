import { readFileSync, readdirSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';
import { join, relative } from 'path';
import { downloadGitFiles } from '../../services/download-git-files';
import { flattenFolder } from '../../services/path';
import type {
  ILocalConfig,
  IRemoteConfig,
  IRepositoryConfig,
} from '../deployment/config';

export async function getMarmaladeTemplates({
  repositoryConfig,
  remoteConfig,
  localConfig,
  flatFolder = true,
}: {
  repositoryConfig: IRepositoryConfig;
  remoteConfig: IRemoteConfig;
  localConfig: ILocalConfig;
  flatFolder: boolean;
}): Promise<void> {
  try {
    await downloadGitFiles({
      ...repositoryConfig,
      path: remoteConfig.templatePath,

      localPath: localConfig.templatePath,
      fileExtension: remoteConfig.templateExtension,
      drillDown: true,
      excludeFolder: remoteConfig.exclude || [],
    });

    const templateFiles = readdirSync(localConfig.templatePath);

    if (templateFiles.length === 0) {
      throw new Error(
        'No template files found. Please double-check the provided credentials.',
      );
    }

    if (flatFolder) {
      await flattenFolder(localConfig.templatePath, [
        remoteConfig.templateExtension,
      ]);
    }
  } catch (error) {
    console.log('Error downloading marmalade templates', error);
    throw error;
  }
}

export async function getCodeFiles({
  repositoryConfig,
  remoteConfig,
  localConfig,
  basePath = 'pact',
}: {
  repositoryConfig: IRepositoryConfig;
  remoteConfig: IRemoteConfig;
  localConfig: ILocalConfig;
  basePath?: string;
}) {
  try {
    const templateFiles = readdirSync(localConfig.templatePath);

    if (templateFiles.length === 0) {
      throw new Error('No template files found');
    }

    await Promise.all(
      templateFiles.map(async (file) => {
        const fileContent = readFileSync(
          join(localConfig.templatePath, file),
          'utf8',
        );
        const yamlContent = yaml.load(fileContent) as any;

        if (!yamlContent?.codeFile) {
          return;
        }

        const codeFilePath = join(
          basePath,
          yamlContent.codeFile
            .split('/')
            .filter((part: string) => part !== '..' && part !== '.')
            .join('/'),
        );

        // * Might be needed in the future
        // const codeFilePath = getGitAbsolutePath(
        //   join(templateRemotePath, file),
        //   yamlContent.codeFile,
        // );

        await downloadGitFiles({
          ...repositoryConfig,
          path: codeFilePath,
          localPath: localConfig.codeFilesPath,
          fileExtension: remoteConfig.codefileExtension,
        });
      }),
    );
  } catch (error) {
    console.log('Error getting code files from templates', error);
    throw error;
  }
}

export async function getNsCodeFiles({
  repositoryConfig,
  remoteConfig,
  localConfig,
}: {
  repositoryConfig: IRepositoryConfig;
  remoteConfig: IRemoteConfig;
  localConfig: ILocalConfig;
}) {
  try {
    await Promise.all(
      remoteConfig.namespacePaths.map(async (path) => {
        await downloadGitFiles({
          ...repositoryConfig,
          path,
          localPath: localConfig.namespacePath,
          fileExtension: remoteConfig.codefileExtension,
        });
      }),
    );
  } catch (error) {
    console.log('Error getting namespace code files', error);
    throw error;
  }
}

export async function updateTemplateFilesWithCodeFile(
  templateFiles: string[],
  templateDirectory: string,
  codeFiles: string[],
  codeFileDirectory: string,
): Promise<void> {
  try {
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

        const yamlString = templateFileContent.replace(
          yamlContent.codeFile,
          newCodeFilePath,
        );

        writeFileSync(join(templateDirectory, templateFile), yamlString);
      }),
    );
  } catch (error) {
    console.log('Error updating template files with code files', error);
    throw error;
  }
}
