#!/usr/bin/env node
import App from './app.js';

import { render } from 'ink';
import meow from 'meow';
import React from 'react';

interface IFlags {
  flags: {
    task: string;
  };
}

const cli: IFlags = meow(
  `
	Usage
	  $ kda-cli

	Options
		--task  Task

	Examples
	  $ kda-cli --task=rerun
	  $ kda-cli --task=start
	  $ kda-cli --task=stop
	  $ kda-cli --task=fund
	  $ kda-cli --task=deploy
	  $ kda-cli --task=local
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
