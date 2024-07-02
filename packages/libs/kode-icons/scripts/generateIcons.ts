import { transform } from '@svgr/core';
import { downloadTemplate } from 'giget';
import { existsSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Options } from 'prettier';
import { pascalCase } from 'scule';
import { updatePackageJson } from './updatePackageJson';
import { formatCode, getPrettierConfigs } from './utils';

const REPO = 'gh:kadena-community/design-system/builds/tokens#main';
const SVGS_PATH = join(process.cwd(), 'svgs');
const ICONS_FILE = join(SVGS_PATH, 'kda-design-system.raw.svg.tokens.json');
const OUT_DIR = join(process.cwd(), 'src');

// eslint-disable-next-line @typescript-eslint/naming-convention
interface IconToken {
  $type: 'icon';
  $name: string;
  $description: string;
  $value: string;
}

async function transformIcons(
  icons: IconToken[],
  out: string,
  prettierConfig: Options,
) {
  const processed = new Set<string>();
  const outDir = join(OUT_DIR, out);
  await mkdir(outDir);
  const indexEntries: string[] = [];
  await Promise.all(
    icons.map(async (icon) => {
      const name = pascalCase(icon.$name) as string;
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
            height: '1em',
          },
          dimensions: false,
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
      await writeFile(join(outDir, `${name}.tsx`), component);
      indexEntries.push(`export {default as ${name}} from './${name}';`);
    }),
  );
  const indexContent = indexEntries.join('\n');
  const formatted = await formatCode(indexContent, prettierConfig);
  await writeFile(join(outDir, 'index.ts'), formatted);
  console.log(`Wrote ${icons.length} icons to ${OUT_DIR}`);
}

function isIconToken(value: any): value is IconToken {
  return value.$type === 'icon';
}

function buildIconsArray(group: Record<string, object>, name = '') {
  const icons: IconToken[] = [];
  for (const [key, value] of Object.entries(group)) {
    if (isIconToken(value)) {
      value.$name = `${name}_${key}` || value.$name;
      icons.push(value as IconToken);
    } else {
      icons.push(
        ...buildIconsArray(
          value as Record<string, object>,
          name ? `${name}_${key}` : key,
        ),
      );
    }
  }
  return icons;
}

async function main() {
  const prettierConfig = await getPrettierConfigs();
  await downloadTemplate(REPO, {
    dir: SVGS_PATH,
    forceClean: true,
  });
  if (existsSync(OUT_DIR)) {
    await rm(OUT_DIR, { force: true, recursive: true });
  }
  await mkdir(OUT_DIR);
  const svgTokens = await import(ICONS_FILE);
  const groups = Object.entries(svgTokens.kda.foundation.icon);
  await Promise.all(
    groups.map(async ([key, group]) => {
      const icons = buildIconsArray(group as Record<string, object>);
      await transformIcons(icons, key, prettierConfig);
    }),
  );
  await updatePackageJson(
    groups.map(([key]) => key),
    'system',
  );
}

main()
  .then(() => console.log('Done'))
  .catch(console.error);
