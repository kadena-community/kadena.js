import { IPactCommand } from './interfaces/IPactCommand';
import { buildCommandFromTemplate } from './buildCommandFromTemplate';
import { createPactCommandFromTemplate, ICommandBuilder } from './pact';

import _debug, { Debugger } from 'debug';
import { parse } from 'yaml';

const debug: Debugger = _debug('client:buildUnsignedTransaction');

/**
 * @internal
 */
export function buildUnsignedTransaction(
  parts: string[],
  holes: string[],
  args: Record<string, string>,
): ICommandBuilder<{}> {
  const filledTemplate: string = buildCommandFromTemplate(parts, holes, args);
  const payload = parse(filledTemplate) as IPactCommand;

  try {
    const commandBuilder = createPactCommandFromTemplate(payload);
    debug('CommandBuilder generated from template', commandBuilder);
    return commandBuilder;
  } catch (e) {
    throw new Error(`An error occurred when parsing the filled template.
    ! Please check your template and make sure there aren't any syntax errors.
    The values:
    ${JSON.stringify(args)}

    Error: ${e}`);
  }
}
