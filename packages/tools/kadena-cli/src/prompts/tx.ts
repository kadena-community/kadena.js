import { input, select } from '@inquirer/prompts';
import { defaultTemplates } from '../tx/commands/templates/templates.js';
import type { IPrompt } from '../utils/createOption.js';

export const selectTemplate: IPrompt<string> = async () => {
  const defaultTemplateKeys = Object.keys(defaultTemplates);
  if (defaultTemplateKeys.length === 1) {
    return defaultTemplates[defaultTemplateKeys[0]];
  }

  return await select({
    message: 'What do you wish to do',
    choices: defaultTemplateKeys.map((template) => ({
      value: template,
      name: template,
    })),
  });
};

export const templateVariables: IPrompt<Record<string, string>> = async (
  args,
) => {
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
};

export const outFilePrompt: IPrompt<string | null> = async (args) => {
  const result = await input({
    message: 'Where do you want to save the output',
  });
  return result ? result : null;
};
