import 'json-bigint-patch';

import { getBlocks } from './lastBlock/Blocks';

import { blocks, PrismaClient } from '@prisma/client';
import {
  BigIntTypeDefinition,
  DateTypeDefinition,
  PositiveFloatTypeDefinition,
} from 'graphql-scalars';
import { createPubSub, createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';

const pubsub = createPubSub<{ NEW_BLOCKS: [NEW_BLOCKS: blocks[]] }>();
const blocksProvider: ReturnType<typeof getBlocks> = getBlocks(pubsub);
blocksProvider.start();

// Provide your schema
const yoga = createYoga({
  context: () => ({
    prisma: new PrismaClient(),
  }),
  schema: createSchema({
    typeDefs: [
      BigIntTypeDefinition,
      DateTypeDefinition,
      PositiveFloatTypeDefinition,
      /* GraphQL */ `
        type Query {
          lastBlockHeight: Int!
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
        lastBlockHeight: async (_parent, _args, ctx, _info) => {
          const prisma = (ctx as any).prisma as PrismaClient;
          const lastBlock = await prisma.blocks.findFirst({
            orderBy: {
              height: 'desc',
            },
          });
          return lastBlock?.height.toString();
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

const server = createServer(yoga);
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql');
});
