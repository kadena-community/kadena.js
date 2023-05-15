#!/usr/bin/env zx

import 'zx/globals';

// This script is used to generate projects for every supported template and test them.
const generateAndTest = (template) =>
  within(async () => {
    const directory = `test-${template}-project`;
    // echo "Generating the project"
    await $`node lib/index.js generate-project --name ${directory} --template ${template}`;
    await cd(directory);
    // echo "Running tests in the project"
    await $`npm run test:ci`;
  });

await generateAndTest('nextjs');
await generateAndTest('vuejs');
await generateAndTest('angular');
