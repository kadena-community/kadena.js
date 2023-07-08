#!/usr/bin/env node

import App from './App.js';
import type { Project } from './types.js';
import { render } from 'ink';
import React from 'react';

const defaults: Project = {
  type: 'lib',
  name: '@kadena-dev/new',
  dir: 'packages/libs/new',
  description: '',
  repoUrl: 'https://github.com/kadena-community/kadena.js.git',
  shouldPublish: false,
};

render(<App defaults={defaults} />);
