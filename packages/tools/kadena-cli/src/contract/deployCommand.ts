import type  { Command } from 'commander';

export function deployCommand(program: Command, version: string): void {
  program
    .command('deploy')
    .option('-n, --network <network>')
    .option('-f, --file <file>')
    .action((args) => {
      console.log(args);
    });
}
