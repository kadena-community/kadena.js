import { createCommandFlexible } from '../utils/createCommandFlexible.js';
import { globalOptions } from '../utils/globalOptions.js';
import { createTransactionCommandNew } from './commands/txCreateTransaction.js';
import { createSendTransactionCommand } from './commands/txSend.js';
import { createSignCommand } from './commands/txSign.js';
import { createTestSignedTransactionCommand } from './commands/txTestSignedTransaction.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'tx' = 'tx';

// execute with: pnpm run dev tx testing --account-name="123" --public-keys="123,123"
export const testCommand: (program: Command, version: string) => void =
  createCommandFlexible(
    'testing',
    '',
    [globalOptions.accountName(), globalOptions.publicKeys()],
    async (option, { collect }) => {
      // TODO: runtime value is correct, but type is not. Objects need to be merged in the types
      const config = await collect(option);
      console.log(config);
    },
  );

export function txCommandFactory(program: Command, version: string): void {
  const txProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool for creating and managing transactions`);

  createSendTransactionCommand(txProgram, version);
  createSignCommand(txProgram, version);
  createTestSignedTransactionCommand(txProgram, version);
  createTransactionCommandNew(txProgram, version);
  testCommand(txProgram, version);
}
