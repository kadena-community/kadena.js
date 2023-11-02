require('module-alias/register');
import { createYoga } from 'graphql-yoga';
import 'json-bigint-patch';
import { createServer } from 'node:http';
import './graph';
import { builder } from './graph/builder';
import { writeSchema } from './utils/write-schema';

writeSchema();

createServer(
  createYoga({
    schema: builder.toSchema(),
  }),
).listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql');
});
