#!/usr/bin/env node
// commonjs import of module-alias/register to avoid sorting of imports.
const moduleAlias = require('module-alias');

moduleAlias.addAliases({
  '@db': `${__dirname}/db`,
  '@services': `${__dirname}/services`,
  '@utils': `${__dirname}/utils`,
  '@devnet': `${__dirname}/devnet`,
});

import { AttributeNames } from '@pothos/tracing-sentry';
import * as Sentry from '@sentry/node';
import { SystemCheckError, runSystemsCheck } from '@services/systems-check';
import { dotenv } from '@utils/dotenv';
import type { ExecutionArgs } from 'graphql';
import { useServer } from 'graphql-ws/lib/use/ws';
import { Plugin, createYoga } from 'graphql-yoga';
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

const plugins: Plugin[] = [extensionsPlugin()];

if (dotenv.COMPLEXITY_EXPOSED) {
  plugins.push(complexityPlugin(schema));
}

const tracingPlugin: Plugin = {
  onExecute: ({ setExecuteFn, executeFn }) => {
    setExecuteFn((options) =>
      Sentry.startSpan(
        {
          op: 'graphql.execute',
          name: options.operationName ?? '<unnamed operation>',
          forceTransaction: true,
          attributes: {
            [AttributeNames.OPERATION_NAME]: options.operationName ?? undefined,
            // [AttributeNames.SOURCE]: print(options.document),
          },
        },
        () => executeFn(options),
      ),
    );
  },
};

if (dotenv.SENTRY_DSN) {
  console.log(` ✔ starting with sentry ${dotenv.NODE_ENV}-${dotenv.NETWORK_HOST}`);
  Sentry.init({
    dsn: dotenv.SENTRY_DSN,
    tracesSampleRate: 1,
    environment: `${dotenv.NODE_ENV}-${dotenv.NETWORK_HOST}`,
  });
  plugins.push(tracingPlugin);
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
    // @ts-ignore
    execute: (args: ExecutionArgs) => args.rootValue.execute(args),
    // @ts-ignore
    subscribe: (args: ExecutionArgs) => args.rootValue.subscribe(args),
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
  .catch((error) => {
    if (error instanceof SystemCheckError) {
      console.log(
        '\nSystem checks failed. Unable to start the graph server.\n',
      );
    } else {
      console.log(
        '\nAn unexpected error occurred. Unable to start the graph server.\n',
      );
      console.error(error);
    }

    process.exit(1);
  });
