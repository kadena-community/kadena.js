import fs from 'node:fs/promises';
import fg from 'fast-glob';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Generate `packages.json` in root
// Usage: `npx tsx packages/tools/scripts/generate-packages-json.ts`

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseDir = join(__dirname, '../../..');

const main = async () => {
  const files = await fg('packages/*/*/package.json', { cwd: baseDir });
  const filePaths = ['package.json', ...files].map((file) =>
    join(baseDir, file),
  );
  const manifests = await Promise.all(filePaths.map((p) => fs.readFile(p)));

  const packages = manifests
    .map((pkg) => JSON.parse(String(pkg)))
    .map((pkg, index) => {
      return {
        name: pkg.name,
        version: pkg.version,
        private: Boolean(pkg.private),
        path: relative(baseDir, dirname(filePaths[index])) || '.',
      };
    });

  await fs.writeFile(
    join(baseDir, 'packages.json'),
    JSON.stringify(packages, null, 2),
  );
};

main();
