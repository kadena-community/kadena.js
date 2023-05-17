import { $ } from 'zx';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const targetDir = join(__dirname, '..');

await $`cd ${targetDir} && node install-run-rush.js lint-staged`
