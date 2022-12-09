import { createYoga, createSchema } from 'graphql-yoga';
import { createServer } from 'node:http';
import 'json-bigint-patch';

import {
  BigIntTypeDefinition,
  DateTypeDefinition,
  PositiveFloatTypeDefinition,
} from 'graphql-scalars';

import { PrismaClient } from '@prisma/client';
import { BlocksSingleton, getBlocks } from './lastBlock/Blocks';

const blocksProvider = getBlocks();

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
          subscribe: async function* (
            _,
            _args,
            ctx: { blocks: BlocksSingleton },
          ) {
            let newBlocks = await blocksProvider.getLatestBlocks();
            yield {
              newBlocks,
            };
            let count = 0;
            while (true) {
              count++;
              await new Promise((resolve) => {
                const interval = setInterval(async () => {
                  const foundBlocks = await blocksProvider.getLatestBlocks();
                  if (foundBlocks.length > 0) {
                    newBlocks = foundBlocks;
                    clearInterval(interval);
                    resolve(undefined);
                  }
                }, 1000);
              });
              yield { newBlocks };
            }
          },
        },
      },
    },
  }),
});

const server = createServer(yoga);
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql');
});
