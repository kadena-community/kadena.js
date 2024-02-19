import type { Command } from 'commander';
import { log } from '../utils/logger.js';

export function deployCommand(program: Command, version: string): void {
  program
    .command('deploy')
    .option('-n, --network <network>')
    .option('-f, --file <file>')
    .action((args) => {
      log.debug('deploy', args);
    });
}
