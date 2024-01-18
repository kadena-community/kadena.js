import { input, select } from '@inquirer/prompts';
import { Option } from 'commander';
import path from 'path';
import { z } from 'zod';

import type { IUnsignedCommand } from '@kadena/client';
import { createTransaction as kadenaCreateTransaction } from '@kadena/client';
import {
  createPactCommandFromStringTemplate,
  getPartsAndHoles,
} from '@kadena/client-utils/nodejs';

import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { createOption } from '../../utils/createOption.js';

const TEMPLATE_DIR = new URL(`${path.dirname(import.meta.url)}/templates`)
  .pathname;

const templateOption = createOption({
  key: 'template',
  option: new Option('--template <template>', 'select a template'),
  validation: z.string(),
  async prompt() {
    const templates = await services.filesystem.readDir(TEMPLATE_DIR);
    if (templates.length === 1) return templates[0];

    return await select({
      message: 'What do you wish to do',
      choices: templates.map((template) => ({
        value: template,
        name: path.basename(template),
      })),
    });
  },
  async expand(templateFile: string) {
    if (templateFile === undefined) throw Error('template file not selected');
    const template = await services.filesystem.readFile(
      path.join(TEMPLATE_DIR, templateFile),
    );
    if (template === null) return { variables: [] };
    const variables = getTemplateVariables(template);
    return { template, variables };
  },
});

const templateVariablesOption = createOption({
  key: 'templateVariables',
  validation: z.string(),
  option: new Option(
    '--template-variables <templateVariables>',
    'template variables',
  ),
  async prompt(args) {
    const values = args.values as string[] | undefined;
    const variables = args.variables as string[] | undefined;

    if (!values || !variables) return {};

    const variableValues = {} as Record<string, string>;

    for (const variable of variables) {
      const match = values.find((value) => value.startsWith(`--${variable}=`));
      if (match !== undefined) variableValues[variable] = match.split('=')[1];
      else {
        const promptedValue = await input({
          message: `Template value ${variable}:`,
          validate: (value) => {
            if (value === '') return `${variable} cannot be empty`;
            return true;
          },
        });
        variableValues[variable] = promptedValue;
      }
    }

    return variableValues;
  },
});

function getTemplateVariables(template: string): string[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getPartsAndHoles(template)[1].map((hole: any) => hole.literal);
  } catch (e) {
    return [];
  }
}

export const createTransaction = async (
  template: string,
  variables: Record<string, string>,
): Promise<
  CommandResult<{ transaction: IUnsignedCommand; filePath: string }>
> => {
  // create transaction
  const command = await createPactCommandFromStringTemplate(
    template,
    variables,
  );

  const transaction = kadenaCreateTransaction(command);

  // write transaction to file
  const directoryPath = path.join(process.cwd(), './transactions');
  await services.filesystem.ensureDirectoryExists(directoryPath);

  const files = await services.filesystem.readDir(directoryPath);
  let fileNumber = files.length + 1;
  let filePath = null;
  while (filePath === null) {
    const checkPath = path.join(directoryPath, `transaction${fileNumber}.json`);
    if (!files.includes(checkPath)) {
      filePath = checkPath;
      break;
    }
    fileNumber++;
  }

  await services.filesystem.writeFile(filePath, JSON.stringify(transaction));

  return { success: true, data: { transaction, filePath } };
};

export const createTransactionCommandNew = createCommandFlexible(
  'create-transaction',
  'select a template and crete a transaction',
  [templateOption(), templateVariablesOption()],
  async (option, values) => {
    const template = await option.template();
    const templateVariables = await option.templateVariables({
      values,
      variables: template.templateConfig.variables,
    });

    console.log('create-transaction:action', {
      ...template,
      ...templateVariables,
    });

    if (template.templateConfig.template === undefined) {
      return console.log('template not found');
    }

    const result = await createTransaction(
      template.templateConfig.template,
      templateVariables.templateVariables,
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
