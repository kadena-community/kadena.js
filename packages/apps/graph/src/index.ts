#!/usr/bin/env node
// commonjs import of module-alias/register to avoid sorting of imports.
const moduleAlias = require('module-alias');

moduleAlias.addAliases({
  '@db': `${__dirname}/db`,
  '@services': `${__dirname}/services`,
  '@utils': `${__dirname}/utils`,
  '@devnet': `${__dirname}/devnet`,
});

import { dotenv } from '@utils/dotenv';
import { createYoga } from 'graphql-yoga';
import 'json-bigint-patch';
import { createServer } from 'node:http';
import './graph';
import { builder } from './graph/builder';
import { complexityPlugin } from './plugins/complexity';
import { writeSchema } from './utils/write-schema';

writeSchema();

const schema = builder.toSchema();

const plugins = [];

if (dotenv.COMPLEXITY_EXPOSED) {
  plugins.push(complexityPlugin(schema));
}

createServer(
  createYoga({
    schema,
    plugins,
  }),
).listen(dotenv.PORT, () => {
  console.info('Server is running on http://localhost:4000/graphql');
});
