#!/usr/bin/env ./packages/tools/scripts/node_modules/.bin/zx
import micromatch from 'micromatch';
import { $ } from 'zx';

const allowed_file_globs = [
  'packages/apps/docs/src/docs/**/*',
  'packages/apps/docs/src/config.yaml',
  'packages/apps/docs/public/assets/**/*',
  'packages/apps/docs/src/redirects/**/*',
  'packages/**/README.md'
];

// Get the list of changed files
const changedFiles = await $`git diff --name-only origin/main`;

// Compare to the allowed file globs
const unmatched = micromatch.not(changedFiles.lines(), allowed_file_globs);

// Exit with 1 as soon as a file is found that's not allowed
if (unmatched.length > 0) {
  console.log('Disallowed files:');
  // Echo the file that's not allowed
  unmatched.forEach((file) => console.log(file));
  process.exit(1);
} else {
  // Exit with 0 if all files are allowed
  process.exit(0);
}
