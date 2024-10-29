import type { IPactCommand, IUnsignedCommand } from '@kadena/client';
import { createTransaction as kadenaCreateTransaction } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import path from 'path';
import {
  createPactCommandFromStringTemplate,
  createPactCommandFromTemplate,
} from '../../../services/utils/yaml-converter.js';

import {
  TX_TEMPLATE_FOLDER,
  WORKING_DIRECTORY,
} from '../../../constants/config.js';
import { services } from '../../../services/index.js';
import type { CommandResult } from '../../../utils/command.util.js';
import { assertCommandError } from '../../../utils/command.util.js';
import { createCommand } from '../../../utils/createCommand.js';
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
): Promise<IUnsignedCommand> => {
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
  return kadenaCreateTransaction(fixed);
};

export const createAndWriteTransaction = async (
  variables: Record<string, string>,
  // eslint-disable-next-line @rushstack/no-new-null
  outFilePath: string | null,
  template: { template: string; path: string; cwd: string } | string,
): Promise<
  CommandResult<{ transaction: IUnsignedCommand; filePath: string }>
> => {
  try {
    const transaction = await createTransaction(variables, template);

    let filePath: string | null = null;
    if (outFilePath === null) {
      filePath = path.join(
        WORKING_DIRECTORY,
        `transaction-${transaction.hash.slice(0, 10)}.json`,
      );
    } else if (outFilePath === '-') {
      // "-" means print to stdout, which is always done anyways. So just don't write a file.
      return { status: 'success', data: { transaction, filePath: '-' } };
    } else {
      filePath = outFilePath;
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

    return { status: 'success', data: { transaction, filePath } };
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

    log.output(
      JSON.stringify(result.data.transaction, null, 2),
      result.data.transaction,
    );

    const relativePath = path.relative(WORKING_DIRECTORY, result.data.filePath);
    log.info(`\ntransaction saved to: ./${relativePath}`);

    return { outFile: relativePath };
  },
);
