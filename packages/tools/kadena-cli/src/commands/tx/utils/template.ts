import { getPartsAndHoles } from '@kadena/client-utils/nodejs';
import yaml from 'js-yaml';
import z, { ZodError } from 'zod';
import { CommandError } from '../../../utils/command.util.js';
import {
  formatZodError,
  isNotEmptyString,
  notEmpty,
} from '../../../utils/globalHelpers.js';
import { log } from '../../../utils/logger.js';
import { getTemplate } from '../commands/templates/templates.js';

const holeSchema = z.object({
  literal: z.string().refine((x) => x.trim() === x, {
    message: 'Variable can not have whitespace around it',
  }),
});

export function getTemplateVariables(template: string): string[] {
  try {
    const holes = getPartsAndHoles(template)[1]
      .map((hole) => {
        const parsed = holeSchema.safeParse(hole);
        if (!parsed.success) throw parsed.error;
        return parsed.data.literal;
      })
      .filter(notEmpty);
    const unique = Array.from(new Set(holes));
    return unique;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new CommandError({
        errors: [
          'There was a problem parsing the ktpl template:',
          formatZodError(error),
        ],
        exitCode: 1,
      });
    }
    return [];
  }
}

export async function getVariablesByTemplate(
  templateInput: { template: string; path: string; cwd: string } | string,
  args: Record<string, unknown>,
): Promise<{
  template: string;
  variables: string[];
}> {
  // option 1. --template="transfer.yaml"
  // option 2. --template="./transfer.ktpl"
  // option 3. cat send.yaml | kadena tx create-transaction

  let template: string | undefined;

  if (templateInput === '-' && isNotEmptyString(args.stdin)) {
    log.debug('using stdin');
    template = args.stdin;
  } else if (typeof templateInput === 'string') {
    const data = await getTemplate(templateInput);
    template = data.template;
  } else if (typeof templateInput === 'object') {
    template = templateInput.template;
  }

  if (template === undefined) {
    throw new Error('Template not found');
  }

  const variables = getTemplateVariables(template);
  return { template, variables };
}

export function convertListToYamlWithEmptyValues(keys: string[]): string {
  const data = keys.reduce<Record<string, string>>((obj, key) => {
    obj[key] = '';
    return obj;
  }, {});

  const yamlStr = yaml.dump(data);
  return yamlStr;
}
