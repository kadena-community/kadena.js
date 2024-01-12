import type { Command } from 'commander';
import { Option } from 'commander';
import debug from 'debug';

import { select } from '@inquirer/prompts';
import {
  createPactCommandFromTemplate,
  getPartsAndHoles,
} from '@kadena/client-utils/nodejs';
import path from 'path';
import { z } from 'zod';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import {
  createCommand,
  executeOption,
  getCommandExecution,
} from '../../utils/createCommand.js';
import {
  IOptionCreatorObject,
  createOption,
} from '../../utils/createOption.js';
import { globalOptions } from '../../utils/globalOptions.js';

const TEMPLATE_DIR = new URL(`${path.dirname(import.meta.url)}/templates`)
  .pathname;

// typescriptFile: createOption({
//   key: 'typescriptFile' as const,
//   prompt: typescript.typescriptFile,
//   validation: z.string().optional(),
//   option: new Option(
//     '--typescript-file <file>',
//     'Generate d.ts from Pact contract file(s) (comma separated)',
//   ),
//   expand: async (file: string) => {
//     return file
//       .split(',')
//       .map((value) => value.trim())
//       .filter((f) => f.length);
//   },
// }),

const templateOption = createOption({
  key: 'template',
  async prompt(): Promise<string> {
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
  validation: z.string().optional(),
  option: new Option('--template <template>', 'select a template'),
});

const templateVariablesOption = createOption({
  key: 'templateVariables',
  validation: z.object({}).passthrough(),
  option: new Option(
    '--template-variables <templateVariables>',
    'template variables',
  ),
  async prompt(args): Promise<Record<string, string>> {
    console.log('prompt', args);
    // 1. readfile
    const templateFile = args.template as string | undefined;
    if (templateFile === undefined) throw Error('template file not selected');
    const template = await services.filesystem.readFile(
      path.join(TEMPLATE_DIR, templateFile),
    );
    if (template === null) return {};

    // 2. get variables
    const variables = getTemplateVariables(template);
    console.log(variables);

    // 3. parse restArgs

    // 4. prompt variables not in restArgs

    // 5. return all data
    return {};
  },
  expand(value: Record<string, string>) {
    return { foo: 'bar' };
  },
  transform(value: Record<string, string>) {
    return value;
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

  const variables = getTemplateVariables(template);
  const command = await createPactCommandFromTemplate(
    templateFile,
    {},
    TEMPLATE_DIR,
  );
  console.log(command);

  return { success: true, data: {} };
};

// export const createTransactionCommand: (
//   program: Command,
//   version: string,
// ) => void = createCommand(
//   'create-transaction',
//   'select a template and crete a transaction',
//   [templateOption(), templateVariablesOption()],
//   async (config) => {
//     debug('tx-send:action')({ config });

//     const result = await createTransaction(config.template);
//     assertCommandError(result);

//     console.log('done', result.data);
//   },
//   { allowUnknownOption: true },
// );

// type Option = {key:string}[];
// type OptionMap = { [K in Option[number]['key']]: Extract<Option[number], { key: K }> };

const createCommandNew =
  <T extends IOptionCreatorObject[]>(
    name: string,
    description: string,
    options: T,
    action: (
      args: Record<string, unknown>,
      options: { [K in T[number]['key']]: Extract<T[number], { key: K }> },
      values: string[],
    ) => Promise<void>,
  ): any =>
  (program: Command, version: string) => {
    const command = program
      .command(name)
      .description(description)
      .allowUnknownOption();
    command.addOption(globalOptions.quiet().option);
    options.forEach((option) => {
      command.addOption(option.option);
    });
    command.action(async (args, ...rest) => {
      const optionsMap = options.reduce((acc, option) => {
        acc[option.key] = option;
        return acc;
      }, {} as any);
      const values = rest.flatMap((r) => r.args);
      await action(args, optionsMap, values);
    });
  };

export const createTransactionCommandNew = createCommandNew(
  'create-transaction',
  'select a template and crete a transaction',
  [templateOption(), templateVariablesOption()],
  async (args, options, values) => {
    console.log('args', args);
    console.log('values', values);

    const template = await executeOption(options.template, args);
    const variables = await executeOption(options.templateVariables, {
      ...args,
      ...template,
    });
    console.log(variables);
  },
);

// export const createTransactionCommand = (
//   program: Command,
//   version: string,
// ): void => {
//   const command = program
//     .command('create-transaction')
//     .description('select a template and crete a transaction')
//     .allowUnknownOption();
//   command.addOption(globalOptions.quiet().option);
//   command.addOption(templateOption().option);

//   command.action(async (args, ...rest) => {
//     const values = rest.flatMap((r) => r.args);
//     console.log('args', args);
//     console.log('values', values);

//     const template = await executeOption(templateOption({}), args);
//     const variables = await executeOption(templateVariablesOption({}), {
//       ...args,
//       ...template,
//     });
//     console.log(variables);
//   });
// };
