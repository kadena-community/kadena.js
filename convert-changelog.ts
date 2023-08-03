import fg from 'fast-glob';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import writeChangeset from '@changesets/write';
import type { Changeset } from '@changesets/types';

// Convert Rush changelog (common/changes/**/*.json) to Changesets (.changesets/*.md) format
// Script only creates, not deletes files
// Usage: `npx tsx convert-changelog.ts` or `pnpm dlx tsx convert-changelog.ts`

const types = ['none', 'patch', 'minor', 'major'];

const baseDir = dirname(fileURLToPath(import.meta.url));

const main = async () => {
  const files = await fg('common/changes/**/*.json');
  const filePaths = files.map((file) => join(baseDir, file));
  const changelogs = await Promise.all(filePaths.map((p) => import(p)));

  const changesets = changelogs.reduce((changesets, item) => {
    item.changes.forEach((change) => {
      const changeset = changesets.find(
        (changeset) => changeset.summary === change.comment,
      );
      if (changeset) {
        const release = changeset.releases.find(
          (release) => release.name === change.packageName,
        );
        if (release) {
          const type = release?.type ? types.indexOf(release.type) : 0;
          changeset.releases[changeset.releases.indexOf(release)].type =
            types[Math.max(types.indexOf(change.type), type)];
        } else {
          changeset.releases.push({
            name: change.packageName,
            type: change.type,
          });
        }
      } else {
        changesets.push({
          summary: change.comment,
          releases: [{ name: change.packageName, type: change.type }],
        });
      }
    });
    return changesets;
  }, [] as Changeset[]);

  await Promise.all(
    changesets.map((changeset) => writeChangeset(changeset, baseDir)),
  );
};

main();
