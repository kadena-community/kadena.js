import type { IUnsignedCommand } from '@kadena/client';
import { createTransaction as kadenaCreateTransaction } from '@kadena/client';
import { createPactCommandFromStringTemplate } from '@kadena/client-utils/nodejs';
import path from 'path';

import { IS_DEVELOPMENT, TRANSACTION_PATH } from '../../constants/config.js';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { fixTemplatePactCommand } from './templates/mapper.js';

export const createTransaction = async (
  template: string,
  variables: Record<string, string>,
  // eslint-disable-next-line @rushstack/no-new-null
  outFilePath: string | null,
): Promise<
  CommandResult<{ transaction: IUnsignedCommand; filePath: string }>
> => {
  try {
    // create transaction
    const command = await createPactCommandFromStringTemplate(
      template,
      variables,
    );

    // Map from legacy or partial template to full IPactCommand
    // This method could throw an error
    const fixed = fixTemplatePactCommand(command);

    const transaction = kadenaCreateTransaction(fixed);

    let filePath: string | null = null;
    if (outFilePath === null) {
      // write transaction to file
      await services.filesystem.ensureDirectoryExists(TRANSACTION_PATH);

      const files = await services.filesystem.readDir(TRANSACTION_PATH);
      let fileNumber = files.length + 1;
      while (filePath === null) {
        const checkPath = path.join(
          TRANSACTION_PATH,
          `transaction${fileNumber}.json`,
        );
        if (!files.includes(checkPath)) {
          filePath = checkPath;
          break;
        }
        fileNumber++;
      }
    } else {
      await services.filesystem.ensureDirectoryExists(TRANSACTION_PATH);
      filePath = outFilePath;
    }

    await services.filesystem.writeFile(
      filePath,
      JSON.stringify(transaction, null, 2),
    );

    return { success: true, data: { transaction, filePath } };
  } catch (error) {
    return {
      success: false,
      errors: ['Failed to create transaction from template', error.message],
    };
  }
};

export const createTransactionCommandNew = createCommandFlexible(
  'create-transaction',
  'select a template and create a transaction',
  [
    globalOptions.selectTemplate({ isOptional: false }),
    globalOptions.templateVariables(),
    globalOptions.outFileJson(),
  ],
  async (option, values) => {
    const template = await option.template();
    const templateVariables = await option.templateVariables({
      values,
      variables: template.templateConfig.variables,
    });
    const outputFile = await option.outFile({
      values,
      variables: template.templateConfig.variables,
    });

    if (IS_DEVELOPMENT) {
      console.log('create-transaction:action', {
        ...template,
        ...templateVariables,
        ...outputFile,
      });
    }

    if (template.templateConfig.template === undefined) {
      return console.log('template not found');
    }

    const result = await createTransaction(
      template.templateConfig.template,
      templateVariables.templateVariables,
      outputFile.outFile,
    );
    assertCommandError(result);

    console.log(result.data.transaction);

    const relativePath = path.relative(process.cwd(), result.data.filePath);
    console.log(`\ntransaction saved to: ./${relativePath}`);

    return { outFile: relativePath };
  },
);
