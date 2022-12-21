import 'json-bigint-patch';

import { getBlocks } from './lastBlock/Blocks';
import { mockBlocks } from './lastBlock/mocks/blocks.mock';

import { blocks, PrismaClient } from '@prisma/client';
import fs from 'fs';
import {
  BigIntTypeDefinition,
  DateTypeDefinition,
  PositiveFloatTypeDefinition,
} from 'graphql-scalars';
import { createPubSub, createSchema, createYoga, PubSub } from 'graphql-yoga';
import { createServer } from 'node:http';
import path from 'path';

const pubsub: PubSub<{ NEW_BLOCKS: [NEW_BLOCKS: blocks[]] }> = createPubSub<{
  NEW_BLOCKS: [NEW_BLOCKS: blocks[]];
}>();

const blocksProvider: ReturnType<typeof getBlocks> = getBlocks(
  pubsub,
  // mockBlocks,
);
blocksProvider.start();

function loadFileAsString(filePath: string) {
  return fs.readFileSync(path.join(__dirname, filePath), 'utf-8');
}
// eslint-disable-next-line @rushstack/typedef-var
const yoga = createYoga({
  context: {
    prisma: new PrismaClient(),
  },

  schema: createSchema({
    typeDefs: [
      BigIntTypeDefinition,
      DateTypeDefinition,
      PositiveFloatTypeDefinition,
      loadFileAsString('./graph.gql'),
    ],

    resolvers: {
      Query: {
        hello: (_, args) => {
          return {
            id: '1',
            name: 'hello',
          };
        },
        lastBlockHeight: async (parent, args, context) => {
          const lastBlock = await context.prisma.blocks.findFirst({
            orderBy: {
              height: 'desc',
            },
          });
          return lastBlock?.height;
        },
      },

      Block: {
        chainid: (parent) => BigInt(parent.chainid),
        height: (parent) => BigInt(parent.height),
      },

      Subscription: {
        newBlocks: {
          subscribe: () => pubsub.subscribe('NEW_BLOCKS'),
          resolve: (payload) => payload,
        },
      },
    },
  }),
});

// eslint-disable-next-line @rushstack/typedef-var
const server = createServer(yoga);

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql');
});
