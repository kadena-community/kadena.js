import type { RushConfig } from './rush.json';

import { Link, Table, TableRow } from 'mdast';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import stripJsonComments from 'strip-json-comments';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rushConfigPath = join(__dirname, '../../../../../rush.json');

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

export function packageTable(): Table {
  const contents = readFileSync(rushConfigPath, 'utf-8');
  const rushConfig: RushConfig = JSON.parse(stripJsonComments(contents));
  const projects = rushConfig.projects
    .filter((project) => project.shouldPublish)
    .sort((a, b) => b.packageName.localeCompare(a.packageName));

  const rows: TableRow[] = projects.map((project) => {
    const packageLink: Link = {
      type: 'link',
      url: `${repoUrl}/tree/main/${project.projectFolder}`,
      children: [{ type: 'text', value: project.packageName }],
    };

    const changelogLink: Link = {
      type: 'link',
      url: `./${project.projectFolder}/CHANGELOG.md`,
      children: [
        {
          type: 'image',
          url: `${badgeBase}/${project.packageName}.svg`,
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
