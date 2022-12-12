import 'json-bigint-patch';

import { getBlocks } from './lastBlock/Blocks';

import { blocks, PrismaClient } from '@prisma/client';
import {
  BigIntTypeDefinition,
  DateTypeDefinition,
  PositiveFloatTypeDefinition,
} from 'graphql-scalars';
import { createPubSub, createSchema, createYoga, PubSub } from 'graphql-yoga';
import { createServer } from 'node:http';

const pubsub: PubSub<{ NEW_BLOCKS: [NEW_BLOCKS: blocks[]] }> = createPubSub<{
  NEW_BLOCKS: [NEW_BLOCKS: blocks[]];
}>();
const blocksProvider: ReturnType<typeof getBlocks> = getBlocks(pubsub);
blocksProvider.start();

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
      /* GraphQL */ `
        type Query {
          lastBlockHeight: BigInt!
        }

        type Subscription {
          newBlocks: [Block!]!
        }

        type Block {
          chainid: BigInt!
          creationtime: Date!
          epoch: Date!
          flags: Float!
          hash: String!
          height: BigInt!
          miner: String!
          nonce: Float!
          parent: String!
          payload: String!
          powhash: String!
          predicate: String!
          target: PositiveFloat!
          weight: PositiveFloat!
        }
      `,
    ],
    resolvers: {
      Query: {
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
