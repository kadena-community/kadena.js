import { ChainId } from '@kadena/types';
import { readFileSync, readdirSync } from 'fs';
import { deployContract } from '../../built-in/deploy-contract';
import { submitClient } from '../../core';
import { IClientConfig } from '../../core/utils/helpers';
import { createPactCommandFromTemplate } from '../yaml-converter';

export interface ITransactionBody {
  chainId: ChainId;
  networkId: string;
  signers: string[];
  meta: {
    gasLimit: number;
    chainId: ChainId;
    ttl: number;
    senderAccount: string;
  };
  data?: { key: string; value: string };
  keysets?: { name: string; pred: string; keys: string[] }[];
}

interface IFilesConfig {
  /** The directory where the files can be found */
  path: string;
  /** The extension of the files*/
  extension: string;
  /** A sorting function in the case of there being a specific order to them*/
  sort?: (a: string, b: string) => number;
  /** A namespace extracting function if there being different namespaces for each file*/
  namespaceExtractor?: (file: string) => string;
}

interface ITemplateConfig extends IFilesConfig {
  deploymentArguments?: Record<string, any>;
}

interface ICodeFileConfig extends IFilesConfig {
  transactionBodyGenerator: (file: string) => ITransactionBody;
}

interface IDeployConfig {
  /** These multiple / single values provided for chain will overwrite the
   * arguments if provided via the deployArguments object
   */
  chainIds: ChainId[];
  templateConfig?: ITemplateConfig;
  codeFileConfig?: ICodeFileConfig;
  clientConfig: IClientConfig;
}

export const deployFromDirectory = async ({
  chainIds,
  templateConfig,
  codeFileConfig,
  clientConfig,
}: IDeployConfig) => {
  if (!templateConfig && !codeFileConfig) {
    throw new Error('Please provide a template or a code files directory');
  }

  let templateFiles: Array<string>;
  let codeFiles: Array<string>;

  if (templateConfig) {
    templateFiles = readdirSync(templateConfig!.path).filter((file) =>
      file.endsWith(templateConfig!.extension),
    );

    if (templateConfig.sort) {
      templateFiles.sort(templateConfig.sort);
    }
  }

  if (codeFileConfig) {
    codeFiles = readdirSync(codeFileConfig!.path).filter((file) =>
      file.endsWith(codeFileConfig!.extension),
    );

    if (codeFileConfig.sort) {
      codeFiles.sort(codeFileConfig.sort);
    }
  }

  await Promise.all(
    chainIds.map(async (chainId) => {
      // If there are template files, we'll build the pact commands from them
      if (templateFiles && templateFiles.length > 0) {
        for (const templateFile of templateFiles) {
          try {
            const deployArguments = templateConfig?.deploymentArguments || {};

            if (templateConfig?.namespaceExtractor) {
              const namespace = templateConfig.namespaceExtractor(templateFile);
              deployArguments.namespace = namespace;
            }

            deployArguments.chain = chainId;

            const command = await createPactCommandFromTemplate(
              templateFile,
              deployArguments,
              templateConfig?.path,
            );

            const commandResult =
              await submitClient(clientConfig)(command).executeTo('listen');

            if (commandResult.result.status === 'success') {
              console.log(
                `Successfully deployed ${templateFile} on chain ${chainId}`,
              );
            } else {
              console.log(
                `Failed to deploy ${templateFile} on chain ${chainId}. Error: ${commandResult.result.error}`,
              );
            }
          } catch (error) {
            console.error(error);
          }
        }
      } else if (
        codeFiles &&
        codeFiles.length > 0 &&
        codeFileConfig &&
        !templateConfig
      ) {
        if (!codeFileConfig.transactionBodyGenerator) {
          throw new Error(
            'Please provide a transaction body for the code files',
          );
        }

        for (const codeFile of codeFiles) {
          try {
            const code = readFileSync(codeFile, 'utf8');
            const transactionBody =
              codeFileConfig.transactionBodyGenerator(codeFile);

            const commandResult = await deployContract(
              {
                contractCode: code,
                transactionBody,
              },
              clientConfig,
            ).executeTo('listen');
            if (commandResult.result.status === 'success') {
              console.log(
                `Successfully deployed ${codeFile} on chain ${chainId}`,
              );
            } else {
              console.log(
                `Failed to deploy ${codeFile} on chain ${chainId}. Error: ${commandResult.result.error}`,
              );
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }),
  );
};
