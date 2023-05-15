#!/usr/bin/env zx
// This script is used to generate projects for every supported template and test them.

import 'zx/globals';

import { rm } from 'fs/promises';

// the default log uses stderr for write output of commands, even for commands that do not generate errors or warnings.
// This can cause Rush to treat everything as a warning message. This function changes this behavior.
$.log = (entry) => {
  switch (entry.kind) {
    case 'stderr':
      log(entry);
      break;
    case 'cmd':
      console.log(entry.cmd);
      break;
    default:
      if (entry.data) {
        process.stdout.write(entry.data);
      }
  }
};

const generateAndTest = (template) =>
  within(async () => {
    const directory = `test-${template}-project`;
    const script = path.join('lib', 'index.js');

    await echo(`Generating ${template} project`);
    await $`node ${script} generate-project --name ${directory} --template ${template}`;

    await echo(`Running tests in ${template} project`);
    await $`npm run --prefix ${directory} test:ci`;

    await echo(`deleting ${template}`);
    await rm(directory, { recursive: true, force: true });
  });

await generateAndTest('nextjs');
await generateAndTest('vuejs');
await generateAndTest('angular');
