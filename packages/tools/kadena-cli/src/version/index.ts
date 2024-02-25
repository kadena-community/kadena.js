import type { Command } from 'commander';
import { log } from '../utils/logger.js';
export function versionCommand(program: Command, version: string): void {
  program
    .command('version')
    .description('display the version of the CLI')
    .action(() => {
      log.info(version);
    });
}
