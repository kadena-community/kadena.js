import { ChainId } from '@kadena/types';
import { readdirSync } from 'fs';
import { submitClient } from '../../core';
import { IAccount, IClientConfig } from '../../core/utils/helpers';
import { createPactCommandFromTemplate } from '../yaml-converter';

interface IFilesConfig {
  /** The directory where the files can be found */
  path: string;
  /** The extension of the files*/
  extension: string;
  /** A sorting function in the case of there being a specific order to them*/
  sort?: (a: string, b: string) => number;
  /** A namespace extracting function if there being different namespaces for each file*/
  namespaceExtractor: (file: string) => string;
}

interface IDeployConfig {
  sender: IAccount;
  chainIds: ChainId[];
  template?: IFilesConfig;
  codeFile?: IFilesConfig;
  deployArguments?: Record<string, any>;
  clientConfig: IClientConfig;
}

export const deployFromDirectory = async ({
  sender,
  chainIds,
  template,
  codeFile,
  deployArguments,
  clientConfig,
}: IDeployConfig) => {
  if (!template && !codeFile) {
    throw new Error('Please provide a template path or a code files path');
  }

  let templateFiles: Array<string>;
  let codeFiles: Array<string>;

  if (template) {
    templateFiles = readdirSync(template!.path).filter((file) =>
      file.endsWith(template!.extension),
    );

    if (template.sort) {
      templateFiles.sort(template.sort);
    }
  }

  if (codeFile) {
    codeFiles = readdirSync(codeFile!.path).filter((file) =>
      file.endsWith(codeFile!.extension),
    );

    if (codeFile.sort) {
      codeFiles.sort(codeFile.sort);
    }
  }

  await Promise.all(
    chainIds.map(async (chainId) => {
      // If there are template files, we'll build the pact commands from them
      if (templateFiles && templateFiles.length > 0) {
        for (const templateFile of templateFiles) {
          if (deployArguments) {
            if (template?.namespaceExtractor) {
              const namespace = template.namespaceExtractor(templateFile);
              deployArguments.namespace = namespace;
            }

            deployArguments.chainId = chainId;

            const command = await createPactCommandFromTemplate(
              templateFile,
              deployArguments,
              template?.path,
            );

            try {
              const commandResult = submitClient(clientConfig)(command);
            } catch (error) {}
          }
        }
      } else if (codeFiles && codeFiles.length > 0 && !template) {
      }
    }),
  );
};
