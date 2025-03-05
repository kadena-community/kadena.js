import type { IPactCommand, IUnsignedCommand } from '@kadena/client';
import { createTransaction as kadenaCreateTransaction } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import path from 'path';
import {
  createPactCommandFromStringTemplate,
  createPactCommandFromTemplate,
} from '../../../services/utils/yaml-converter.js';

import type { ICommandPayload } from '@kadena/types';
import {
  TX_TEMPLATE_FOLDER,
  WORKING_DIRECTORY,
} from '../../../constants/config.js';
import { services } from '../../../services/index.js';
import type { CommandResult } from '../../../utils/command.util.js';
import { assertCommandError } from '../../../utils/command.util.js';
import { createCommand } from '../../../utils/createCommand.js';
import { safeJsonParse } from '../../../utils/globalHelpers.js';
import { globalOptions } from '../../../utils/globalOptions.js';
import { log } from '../../../utils/logger.js';
import { relativeToCwd } from '../../../utils/path.util.js';
import { txOptions } from '../txOptions.js';
import { convertListToYamlWithEmptyValues } from '../utils/template.js';
import { fixTemplatePactCommand } from './templates/mapper.js';
import { writeTemplatesToDisk } from './templates/templates.js';

export const createTransaction = async (
  variables: Record<string, string>,
  template: { template: string; path: string; cwd: string } | string,
): Promise<IUnsignedCommand[]> => {
  // Handle decimal-amount conversion
  const updatedVariables = variables['decimal-amount']
    ? {
        ...variables,
        'decimal-amount': new PactNumber(
          variables['decimal-amount'],
        ).toPactDecimal().decimal,
      }
    : variables;

  let command: IPactCommand | undefined = undefined;

  if (typeof template === 'string') {
    // stdin
    command = await createPactCommandFromStringTemplate(
      template,
      updatedVariables,
    );
  } else if (typeof template === 'object') {
    const { path, cwd } = template;
    command = await createPactCommandFromTemplate(path, updatedVariables, cwd);
  } else {
    throw new Error('A valid template is required.');
  }

  const fixed = fixTemplatePactCommand(command);
  return fixed.map(kadenaCreateTransaction);
};

const allSettledToCommandResult = <T>(
  results: PromiseSettledResult<T>[],
): CommandResult<T[]> => {
  const allSuccess = results.every((result) => result.status === 'fulfilled');
  const allFailed = results.every((result) => result.status === 'rejected');
  const status = allSuccess ? 'success' : allFailed ? 'error' : 'partial';

  const commandResult = results.reduce(
    (memo, result) => {
      if (result.status === 'fulfilled') {
        memo.data.push(result.value);
      } else {
        memo.errors.push(result.reason);
      }
      return memo;
    },
    { status, data: [] as T[], errors: [] as any[] },
  );

  return commandResult as CommandResult<T[]>;
};

export const createAndWriteTransaction = async (
  variables: Record<string, string>,
  // eslint-disable-next-line @rushstack/no-new-null
  outFilePath: string | null,
  template: { template: string; path: string; cwd: string } | string,
): Promise<
  CommandResult<{ transaction: IUnsignedCommand; filePath: string }[]>
> => {
  try {
    const transactions = await createTransaction(variables, template);

    const transactionsWithPath = await Promise.allSettled(
      transactions.map(async (transaction, index) => {
        const chainId = safeJsonParse<ICommandPayload>(transaction.cmd)?.meta
          ?.chainId;
        const hash = `${transaction.hash.slice(0, 10)}`;

        let filePath: string | null = null;
        if (outFilePath === null) {
          let filename: string;

          if (transactions.length > 1 && chainId) {
            filename = `transaction-${chainId}-${hash}.json`;
          } else {
            filename = `transaction-${hash}.json`;
          }

          filePath = path.join(WORKING_DIRECTORY, filename);
        } else if (outFilePath === '-') {
          // "-" means print to stdout, which is always done anyways. So just don't write a file.
          return { transaction, filePath: '-' };
        } else {
          if (transactions.length > 1 && chainId) {
            if (!outFilePath.endsWith('.json')) {
              outFilePath += '.json';
            }
            filePath = outFilePath.replace(
              '.json',
              `-${chainId || index}.json`,
            );
          } else {
            filePath = outFilePath;
          }
        }

        // template dir
        // ./.kadena/transaction-templates

        // kadena tx create-transaction ./kadena/transaction-templates/transfer.yaml

        // --to-file

        // sign:
        // do not prompt but allow --directory (otherwise working directory)

        // output suggestion
        // ./{templateName}-{timestamp}-{hash}.json

        await services.filesystem.writeFile(
          filePath,
          JSON.stringify(transaction, null, 2),
        );

        return { transaction, filePath };
      }),
    );

    return allSettledToCommandResult(transactionsWithPath);
  } catch (error) {
    return {
      status: 'error',
      errors: ['Failed to create transaction from template', error.message],
    };
  }
};

export const createTransactionCommandNew = createCommand(
  'add',
  'Select a template and add a transaction.\nThe template can be passed via stdin.\nThe transaction will be saved to file.',
  [
    txOptions.selectTemplate({ isOptional: false }),
    txOptions.templateData({ isOptional: true }),
    txOptions.templateVariables(),
    txOptions.holes({ isOptional: true, disableQuestion: true }),
    globalOptions.outFileJson(),
  ],
  async (option, { values, stdin }) => {
    services.config.getDirectory();
    const templatesAdded = await writeTemplatesToDisk();
    if (templatesAdded.length > 0) {
      log.info(
        `Added default templates to ${relativeToCwd(
          TX_TEMPLATE_FOLDER,
        )}: ${templatesAdded.join(', ')}`,
      );
    }

    const template = await option.template({ stdin });
    const showHoles = await option.holes();

    if (showHoles.holes === true) {
      log.info('Template variables used in this template:');
      return log.output(
        convertListToYamlWithEmptyValues(template.templateConfig.variables),
        template.templateConfig.variables,
      );
    }

    const templateData = await option.templateData();
    const templateVariables = await option.templateVariables({
      values,
      variables: template.templateConfig.variables,
      data: templateData.templateDataConfig ?? {},
    });

    const outputFile = await option.outFile({
      values,
      variables: template.templateConfig.variables,
    });

    log.debug('create-transaction:action', {
      ...template,
      ...templateVariables,
      ...outputFile,
    });

    if (template.templateConfig.template === undefined) {
      return log.error('template not found');
    }

    const result = await createAndWriteTransaction(
      templateVariables.templateVariables,
      outputFile.outFile,
      template.template,
    );

    assertCommandError(result);

    if (result.data.length === 1) {
      log.output(
        JSON.stringify(result.data[0].transaction, null, 2),
        result.data[0].transaction,
      );

      const relativePath = path.relative(
        WORKING_DIRECTORY,
        result.data[0].filePath,
      );
      log.info(`\ntransaction saved to: ./${relativePath}`);
    } else {
      const transactions = result.data.map(({ transaction }) => transaction);
      log.output(JSON.stringify(transactions, null, 2), transactions);

      const relativePaths = result.data.map((result) =>
        path.relative(WORKING_DIRECTORY, result.filePath),
      );
      log.info(`\ntransaction saved to: ./${relativePaths}`);
    }

    return { outFiles: result.data.map(({ filePath }) => filePath) };
  },
);
