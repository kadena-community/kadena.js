import { ChainId } from '@kadena/types';
import { readFileSync, readdirSync } from 'fs';
import { deployContract } from '../../built-in/deploy-contract';
import { submitClient } from '../../core';
import { IAccount, IClientConfig } from '../../core/utils/helpers';
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
}

interface ITemplateConfig extends IFilesConfig {
  /** A namespace extracting function if there being different namespaces for each file*/
  namespaceExtractor?: (file: string) => string;
}

interface ICodeFileConfig extends IFilesConfig {
  transactionBody: ITransactionBody;
}

interface IDeployConfig {
  sender: IAccount;
  /** These multiple / single values provided for chain will overwrite the
   * arguments if provided via the deployArguments object
   */
  chainIds: ChainId[];
  templateConfig?: ITemplateConfig;
  codeFileConfig?: ICodeFileConfig;
  deployArguments?: Record<string, any>;
  clientConfig: IClientConfig;
}

export const deployFromDirectory = async ({
  sender,
  chainIds,
  templateConfig,
  codeFileConfig,
  deployArguments,
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
            deployArguments = deployArguments || {};

            if (templateConfig?.namespaceExtractor) {
              const namespace = templateConfig.namespaceExtractor(templateFile);
              deployArguments.namespace = namespace;
            }

            deployArguments.chainId = chainId;

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
            }
          } catch (error) {
            console.log(
              `Failed to deploy ${templateFile} on chain ${chainId}. Error: ${error}`,
            );
          }
        }
      } else if (
        codeFiles &&
        codeFiles.length > 0 &&
        codeFileConfig &&
        !templateConfig
      ) {
        for (const codeFile of codeFiles) {
          try {
            const code = readFileSync(codeFile, 'utf8');

            const commandResult = await deployContract(
              {
                contractCode: code,
                transactionBody: codeFileConfig?.transactionBody,
              },
              clientConfig,
            ).executeTo('listen');
            if (commandResult.result.status === 'success') {
              console.log(
                `Successfully deployed ${codeFile} on chain ${chainId}`,
              );
            }
          } catch (error) {
            console.log(
              `Failed to deploy ${codeFile} on chain ${chainId}. Error: ${error}`,
            );
          }
        }
      }
    }),
  );
};
