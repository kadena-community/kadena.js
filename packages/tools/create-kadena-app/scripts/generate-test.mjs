#!/usr/bin/env zx
// This script is used to generate projects for every supported template and test them.

import 'zx/globals';

import { rm } from 'fs/promises';
import customLog from './custom-log.mjs';

$.log = customLog;

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
