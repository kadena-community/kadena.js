import { runToolboxCommand } from '@kadena/toolbox/cli';
import { Command } from 'commander';

const SUBCOMMAND_ROOT = 'toolbox';
export function toolboxCommandFactory(program: Command, version: string) {
  program
    .command(SUBCOMMAND_ROOT)
    .description(`Kadena toolbox`)
    .action(() => runToolboxCommand())
    .version(version);
}
