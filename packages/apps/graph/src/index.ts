import 'json-bigint-patch';
import './graph';

import { builder } from './graph/builder';
import { writeSchema } from './utils/write-schema';

import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';

// eslint-disable-next-line @rushstack/typedef-var
const schema = builder.toSchema();

// eslint-disable-next-line @rushstack/typedef-var
const yoga = createYoga({
  schema,
});

// eslint-disable-next-line @rushstack/typedef-var
const server = createServer(yoga);

writeSchema();

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql');
});
