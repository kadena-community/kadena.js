import { transform } from '@svgr/core';
import { downloadTemplate } from 'giget';
import { existsSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Options } from 'prettier';
import { format, resolveConfig, resolveConfigFile } from 'prettier';

import { pascalCase } from 'scule';

const REPO = 'gh:kadena-community/design-system/tokens/foundation/icon#main';
const SVGS_PATH = join(process.cwd(), 'svgs');
const SVG_TOKENS_FILE = join(SVGS_PATH, 'svg.tokens.json');
const OUT_DIR = join(process.cwd(), 'src');

// eslint-disable-next-line @typescript-eslint/naming-convention
interface IconToken {
  $type: 'icon';
  $name: string;
  $description: string;
  $value: string;
}
const defaultPrettierOptions: Options = {
  parser: 'typescript',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  proseWrap: 'always',
};
async function getPrettierConfigs() {
  const prettierConfigFile = await resolveConfigFile();
  let prettierConfig = defaultPrettierOptions;
  if (prettierConfigFile !== null) {
    const resolved = await resolveConfig(prettierConfigFile);
    if (resolved) {
      prettierConfig = resolved;
    }
  }
  prettierConfig.parser = defaultPrettierOptions.parser;
  return prettierConfig;
}
async function main() {
  await downloadTemplate(REPO, {
    dir: SVGS_PATH,
    forceClean: true,
  });
  const prettierConfig = await getPrettierConfigs();
  const svgTokens = await import(SVG_TOKENS_FILE);
  const icons = Object.values(svgTokens.kda.foundation.icon) as IconToken[];
  if (existsSync(OUT_DIR)) {
    await rm(OUT_DIR, { force: true, recursive: true });
  }
  await mkdir(OUT_DIR);
  const indexEntries: string[] = [];
  const processed = new Set();
  await Promise.all(
    icons.map(async (icon) => {
      const name = pascalCase(`Icon_${icon.$name}`) as string;
      if (processed.has(name.toLowerCase())) {
        console.warn(
          `Skipped proccessing ${icon.$name} because it will result in a duplicate icon ${name}!`,
        );
        return Promise.resolve();
      }
      processed.add(name.toLowerCase());
      const component = await transform(
        icon.$value,
        {
          svgProps: {
            // 24px
            fontSize: '1.5em',
            fill: 'currentColor',
          },
          typescript: true,
          icon: true,
          prettier: true,
          prettierConfig,
          expandProps: 'end',
          titleProp: true,
          plugins: [
            '@svgr/plugin-svgo',
            '@svgr/plugin-jsx',
            '@svgr/plugin-prettier',
          ],
        },
        {
          componentName: name,
        },
      );
      await writeFile(join(OUT_DIR, `${name}.tsx`), component);
      indexEntries.push(`export {default as ${name}} from './${name}';`);
    }),
  );
  const indexContent = indexEntries.join('\n');
  const formatted = await format(indexContent, prettierConfig!);
  await writeFile(join(OUT_DIR, 'index.ts'), formatted);
  console.log(`Wrote ${processed.size} icons successfully!`);
}

main()
  .then(() => console.log('Done'))
  .catch(console.error);
