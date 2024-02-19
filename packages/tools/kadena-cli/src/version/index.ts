import type { Command } from 'commander';

export function versionCommand(program: Command, version: string): void {
  program
    .command('version')
    .description('display the version of the CLI')
    .action(() => {
      console.log(version);
    });
}
