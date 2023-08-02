import fg from 'fast-glob';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import writeChangeset from '@changesets/write';
import type { Changeset } from '@changesets/types';

// Convert Rush changelog (common/changes/**/*.json) to Changesets (.changesets/*.md) format
// Script only creates, not deletes files
// Usage: `npx tsx convert-changelog.ts` or `pnpm dlx tsx convert-changelog.ts`

const baseDir = dirname(fileURLToPath(import.meta.url));

const main = async () => {
  const files = await fg('common/changes/**/*.json');
  const filePaths = files.map((file) => join(baseDir, file));
  const changelogs = await Promise.all(filePaths.map((p) => import(p)));

  const changesets = changelogs.reduce((acc, item) => {
    item.changes.forEach((change) => {
      const existingItem = acc.find((item) => item.summary === change.comment);
      if (existingItem) {
        existingItem.releases.push({
          name: change.packageName,
          type: change.type,
        });
      } else {
        acc.push({
          summary: change.comment,
          releases: [{ name: change.packageName, type: change.type }],
        });
      }
    });
    return acc;
  }, [] as Changeset[]);

  await Promise.all(
    changesets.map((changeset) => writeChangeset(changeset, baseDir)),
  );
};

main();
