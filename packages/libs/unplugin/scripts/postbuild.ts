import { logger } from '@kadena/toolbox/utils';
import fg from 'fast-glob';
import { promises as fs } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

async function run() {
  // fix cjs exports
  const files = await fg('*.cjs', {
    ignore: ['chunk-*'],
    absolute: true,
    cwd: resolve(dirname(fileURLToPath(import.meta.url)), '../dist'),
  });
  for (const file of files) {
    let code = await fs.readFile(file, 'utf8');
    code = code.replace('exports.default =', 'module.exports =');
    code += 'exports.default = module.exports;';
    await fs.writeFile(file, code);
    logger.success(`Fixed ${basename(file)}`);
  }
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });
