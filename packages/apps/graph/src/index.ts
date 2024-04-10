#!/usr/bin/env node
// commonjs import of module-alias/register to avoid sorting of imports.
const moduleAlias = require('module-alias');

moduleAlias.addAliases({
  '@db': `${__dirname}/db`,
  '@services': `${__dirname}/services`,
  '@utils': `${__dirname}/utils`,
  '@devnet': `${__dirname}/devnet`,
});

import { runSystemsCheck } from '@services/systems-check';
import { dotenv } from '@utils/dotenv';
import { NetworkConfig } from '@utils/network';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createYoga } from 'graphql-yoga';
import 'json-bigint-patch';
import { createServer } from 'node:http';
import type { Socket } from 'node:net';
import { WebSocketServer } from 'ws';
import './graph';
import { builder } from './graph/builder';
import { complexityPlugin } from './plugins/complexity';
import { extensionsPlugin } from './plugins/extensions';
import { writeSchema } from './utils/write-schema';

if (dotenv.NODE_ENV === 'development') {
  writeSchema();
}

const schema = builder.toSchema();

const plugins = [extensionsPlugin()];

export const networkConfig = NetworkConfig.create(dotenv.NETWORK_HOST);

if (dotenv.COMPLEXITY_EXPOSED) {
  plugins.push(complexityPlugin(schema));
}

const yogaApp = createYoga({
  schema,
  plugins,
  graphiql: {
    subscriptionsProtocol: 'WS',
    title: 'Kadena GraphQL',
  },
  context: async () => {
    return {
      extensions: {},
      networkId: (await networkConfig).networkId,
    };
  },
});

const httpServer = createServer(yogaApp);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: yogaApp.graphqlEndpoint,
});

useServer(
  {
    execute: (args: any) => args.rootValue.execute(args),
    subscribe: (args: any) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx, msg) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yogaApp.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: msg.payload,
        });

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe,
        },
      };

      const errors = validate(args.schema, args.document);
      if (errors.length) return errors;
      return args;
    },
  },
  wsServer,
);

const sockets = new Set<Socket>();
httpServer.on('connection', (socket) => {
  sockets.add(socket);
  httpServer.once('close', () => sockets.delete(socket));
});

runSystemsCheck()
  .then(() => {
    httpServer.listen(dotenv.PORT, () => {
      console.info(
        `\nServer is running on http://localhost:${dotenv.PORT}/graphql\n`,
      );
    });
  })
  .catch((e) => {
    console.log(e)
    console.log('\nSystem checks failed. Unable to start the graph server.\n');
    process.exit(1);
  });
