import { Option } from 'commander';

import { input, select } from '@inquirer/prompts';
import {
  createPactCommandFromTemplate,
  getPartsAndHoles,
} from '@kadena/client-utils/nodejs';
import path from 'path';
import { z } from 'zod';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
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
    return { variables };
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

// type xprompt = ReturnType<typeof templateVariablesOption>['prompt'];
// type xtr = ReturnType<typeof templateVariablesOption>['transform'];
// type xex = ReturnType<typeof templateVariablesOption>['expand'];

function getTemplateVariables(template: string): string[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getPartsAndHoles(template)[1].map((hole: any) => hole.literal);
  } catch (e) {
    return [];
  }
}

export const createTransaction = async (
  templateFile: string,
): Promise<CommandResult<{}>> => {
  console.log('>', templateFile);
  const template = await services.filesystem.readFile(
    path.join(TEMPLATE_DIR, templateFile),
  );
  if (template === null) {
    return {
      success: false,
      errors: [`Template: ${templateFile} does not exist.`],
    };
  }

  // const variables = getTemplateVariables(template);
  const command = await createPactCommandFromTemplate(
    templateFile,
    {},
    TEMPLATE_DIR,
  );
  console.log(command);

  return { success: true, data: {} };
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
  },
);
