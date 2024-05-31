import type { IUnsignedCommand } from '@kadena/types';
import { IUnsignedCommandSchema } from '../../../prompts/tx.js';
import { formatZodError } from '../../../utils/globalHelpers.js';
import { log } from '../../../utils/logger.js';

export const parseTransactionsFromStdin = async (
  stdin: string,
): Promise<IUnsignedCommand> => {
  try {
    log.debug('Using stdin');
    const command = IUnsignedCommandSchema.safeParse(JSON.parse(stdin));
    if (command.success) {
      return command.data as IUnsignedCommand;
    } else {
      throw new Error(
        `Invalid JSON in stdin: ${formatZodError(command.error)}`,
      );
    }
  } catch (e) {
    throw new Error(`Failed to parse stdin: ${e}`);
  }
};
