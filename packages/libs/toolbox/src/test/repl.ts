import { join } from 'node:path';
import readdir from 'tiny-readdir-glob';
import type { PactToolboxConfigObj } from '../config';
import { resolveConfig } from '../config';
import { execAsync, logger } from '../utils';

export async function runReplTests(config?: Required<PactToolboxConfigObj>) {
  if (!config) {
    config = await resolveConfig();
  }
  logger.start(`Running REPL tests`);
  const contractsDir = join(process.cwd(), config.contractsDir);
  const aborter = new AbortController();
  console.log(contractsDir);
  const result = await readdir(`${config.contractsDir}/**/*.repl`, {
    depth: 20,
    limit: 1_000_000,
    followSymlinks: true,
    ignore: ['prelude/**'],
    signal: aborter.signal,
  });
  for (const file of result.files) {
    logger.start(`Running REPL test for ${file}`);
    await execAsync(`pact ${file}`);
    logger.success(`REPL test for ${file} completed`);
  }
  logger.success(`REPL tests completed`);
}
