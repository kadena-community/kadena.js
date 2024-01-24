import path from 'path';

import type { IUnsignedCommand } from '@kadena/client';
import { createTransaction as kadenaCreateTransaction } from '@kadena/client';
import { createPactCommandFromStringTemplate } from '@kadena/client-utils/nodejs';

import debug from 'debug';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';

export const createTransaction = async (
  template: string,
  variables: Record<string, string>,
  outFilePath: string | null,
): Promise<
  CommandResult<{ transaction: IUnsignedCommand; filePath: string }>
> => {
  // create transaction
  const command = await createPactCommandFromStringTemplate(
    template,
    variables,
  );

  const transaction = kadenaCreateTransaction(command);

  let filePath = null;
  if (outFilePath === null) {
    // write transaction to file
    const directoryPath = path.join(process.cwd(), './transactions');
    await services.filesystem.ensureDirectoryExists(directoryPath);

    const files = await services.filesystem.readDir(directoryPath);
    let fileNumber = files.length + 1;
    while (filePath === null) {
      const checkPath = path.join(
        directoryPath,
        `transaction${fileNumber}.json`,
      );
      if (!files.includes(checkPath)) {
        filePath = checkPath;
        break;
      }
      fileNumber++;
    }
  } else {
    filePath = outFilePath;
  }

  await services.filesystem.writeFile(
    filePath,
    JSON.stringify(transaction, null, 2),
  );

  return { success: true, data: { transaction, filePath } };
};

export const createTransactionCommandNew = createCommandFlexible(
  'create-transaction',
  'select a template and crete a transaction',
  [
    globalOptions.selectTemplate(),
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

    debug.log('create-transaction:action', {
      ...template,
      ...templateVariables,
      ...outputFile,
    });

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

    console.log(
      `transaction saved to: ./${path.relative(
        process.cwd(),
        result.data.filePath,
      )}`,
    );
  },
);
