import type { PackageListConfig } from './rush.json';

import type { Link, Table, TableRow } from 'mdast';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { type VFile } from 'vfile';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootPath = join(__dirname, '../../../../..');
const packageListPath = join(rootPath, 'packages.json');
const contents = readFileSync(packageListPath, 'utf-8');
const packageList: PackageListConfig[] = JSON.parse(contents);

const repoUrl = 'https://github.com/kadena-community/kadena.js';
const badgeBase = 'https://img.shields.io/npm/v';

const headerRow: TableRow = {
  type: 'tableRow',
  children: [
    {
      type: 'tableCell',
      children: [{ type: 'text', value: 'Package' }],
    },
    {
      type: 'tableCell',
      children: [{ type: 'text', value: 'Release Notes' }],
    },
  ],
};

export function packageTable(vFile: VFile): Table {
  const projects = packageList
    .filter((project) => project.private !== true)
    .sort((a, b) => a.name.localeCompare(b.name));

  const rows: TableRow[] = projects.map((project) => {
    const packageLink: Link = {
      type: 'link',
      url: `${repoUrl}/tree/main/${project.path}`,
      children: [{ type: 'text', value: project.name }],
    };

    const changelogLink: Link = {
      type: 'link',
      url: join('.', project.path, 'CHANGELOG.md'),
      children: [
        {
          type: 'image',
          url: `${badgeBase}/${project.name}.svg`,
          alt: 'version',
        },
      ],
    };

    return {
      type: 'tableRow',
      children: [
        {
          type: 'tableCell',
          children: [packageLink],
        },
        {
          type: 'tableCell',
          children: [changelogLink],
        },
      ],
    };
  });

  return {
    type: 'table',
    align: ['left', 'left'],
    children: [headerRow, ...rows],
  };
}
