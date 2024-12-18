import path from 'node:path';

import { services } from '../../../services/index.js';
import { assertCommandError } from '../../../utils/command.util.js';
import type { CommandOption } from '../../../utils/createCommand.js';
import { log } from '../../../utils/logger.js';
import type { options } from '../commands/txSignOptions.js';
import { parseTransactionsFromStdin } from './input.js';
import { getTransactionsFromFile } from './txHelpers.js';
/**
 * Creates a command for signing a Kadena transaction.
 *
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the command.
 */
export async function signWithSpireKey(
  option: CommandOption<typeof options>,
  values: string[],
  stdin?: string,
): Promise<void> {
  // const key = await option.keyPairs();

  const result = await (async () => {
    if (stdin !== undefined) {
      const command = await parseTransactionsFromStdin(stdin);
      log.debug('sign-with-keypair:action', {
        // ...key,
        command,
      });

      return null;
    } else {
      const { directory } = await option.directory();
      const files = await option.txUnsignedTransactionFiles({
        signed: false,
        path: directory,
      });
      const absolutePaths = files.txUnsignedTransactionFiles.map((file) =>
        path.resolve(path.join(directory, file)),
      );
      log.debug('sign-with-keypair:action', {
        // ...key,
        directory,
        ...files,
      });

      const unsignedCommandsUnfiltered = await getTransactionsFromFile(
        absolutePaths,
        false,
      );

      await services.spirekey.sign({
        networkId: 'testnet04',
        chainId: '0',
        transactions: unsignedCommandsUnfiltered,
      });

      return null;
    }
  })();

  // assertCommandError(result);

  // if (result.data.commands.length === 1) {
  //   log.output(
  //     JSON.stringify(result.data.commands[0].command, null, 2),
  //     result.data.commands[0].command,
  //   );
  // }
  // result.data.commands.forEach((tx) => {
  //   log.info(`Signed transaction saved to ${tx.path}`);
  // });
}
