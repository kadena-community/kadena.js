import type { ChainId } from '@kadena/types';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { ITransactionBody } from '../built-in/deploy-contract';
import { deployContract } from '../built-in/deploy-contract';
import type { IClientConfig } from '../core/utils/helpers';
import { deployTemplate } from './deploy-template';

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

/**
 * Deploy marmalade templates or code files to the chain
 * @alpha
 * @param chainIds - The chain ids where the template / code files will be deployed
 * @param templateConfig - The template configuration for the deployment (the namespace and sort functions can be used to define the order and the namespace used for the deployment)
 * @param codeFileConfig - The code file configuration for the deployment (the transaction body generator function can be used to define the transaction body for each code file)
 * @param clientConfig - The client configuration for the deployment
 * @throws - If no template or code files are provided
 * @example
 * ```typescript
 * await deployFromDirectory({
 *    chainIds: [chainId],
 *    templateConfig: {
 *      path: 'path',
 *      extension: 'yaml',
 *      sort: () => 1,
 *      namespaceExtractor: () => 'namespace',
 *      deploymentArguments: {
 *        chain: chainId,
 *      },
 *    },
 *    clientConfig,
 * });
 * ```
 *
 */
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
  } else if (codeFileConfig) {
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

            const command = await deployTemplate(
              {
                deployArguments,
                workingDirectory: templateConfig?.path,
                templatePath: templateFile,
              },
              clientConfig,
            );

            const commandResult = await command.executeTo('listen');

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
            const code = readFileSync(
              join(codeFileConfig.path, codeFile),
              'utf8',
            );
            const transactionBody =
              codeFileConfig.transactionBodyGenerator(codeFile);

            const command = deployContract(
              {
                contractCode: code,
                transactionBody,
              },
              clientConfig,
            );

            const commandResult = await command.executeTo('listen');

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
