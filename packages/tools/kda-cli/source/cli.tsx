#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
	Usage
	  $ kda-cli

	Options
		--name  Your name

	Examples
	  $ kda-cli --name=Jane
	  Hello, Jane
`,
	{
		importMeta: import.meta,
		flags: {
			task: {
				type: 'string',
			},
		},
	},
);

render(<App task={cli.flags.task} />);
