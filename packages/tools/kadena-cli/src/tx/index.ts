import { createTransactionCommandNew } from './commands/txCreateTransaction.js';
import { createSendTransactionCommand } from './commands/txSend.js';
import { createSignTransactionWithAliasFileCommand } from './commands/txSignWithAliasFile.js';
import { createSignTransactionWithKeyPairCommand } from './commands/txSignWithKeypair.js';
import { createSignTransactionWithLocalWalletCommand } from './commands/txSignWithLocalWallet.js';
import { createTestSignedTransactionCommand } from './commands/txTestSignedTransaction.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'tx' = 'tx';

export function txCommandFactory(program: Command, version: string): void {
  const txProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool for creating and managing transactions`);

  createSendTransactionCommand(txProgram, version);
  createSignTransactionWithKeyPairCommand(txProgram, version);
  createSignTransactionWithAliasFileCommand(txProgram, version);
  createSignTransactionWithLocalWalletCommand(txProgram, version);
  createTestSignedTransactionCommand(txProgram, version);
  createTransactionCommandNew(txProgram, version);

  // const command = txProgram.command('test').description('testing');
  // command.addOption(new Option('-t, --test'));
  // command.addArgument(new Argument('[file]'));
  // command.action(async (originalArgs, ...rest) => {
  //   console.log('originalArgs', originalArgs, typeof originalArgs);
  //   console.log('rest', rest);
  //   console.log(
  //     'mapped',
  //     rest.flatMap((r) => r.args),
  //   );
  // });
}
