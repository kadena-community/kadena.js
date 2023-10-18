#!/usr/bin/env node
import { render } from 'ink';
import meow from 'meow';
import React from 'react';
import App from './app.js';

interface IFlags {
  flags: {
    task: string;
  };
}

const cli: IFlags = meow(
  `
  Usage
    $ kda

  Options
    --task  Task

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
    },
  },
);

render(<App task={cli.flags.task} />);
