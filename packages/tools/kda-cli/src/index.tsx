#!/usr/bin/env node
import App from './app.js';

import { render } from 'ink';
import meow from 'meow';
import React from 'react';

interface IFlags {
  flags: {
    task: string;
    profile: string;
  };
}

const cli: IFlags = meow(
  `
  Usage
    $ kda

  Options
    --task     Task
    --profile  Profile

  Examples
    $ kda --task=rerun
    $ kda --task=start
    $ kda --task=stop
    $ kda --task=fund
    $ kda --task=deploy
    $ kda --task=local
`,
  {
    importMeta: import.meta,
    flags: {
      task: {
        type: 'string',
        default: '',
        alias: 't',
      },
      profile: {
        type: 'string',
        default: '',
        alias: 'p',
      },
    },
  },
);

render(<App task={cli.flags.task} profile={cli.flags.profile} />);
