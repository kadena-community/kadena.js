// schema: createSchema({
//   typeDefs: [
//     BigIntTypeDefinition,
//     DateTypeDefinition,
//     PositiveFloatTypeDefinition,
//     loadFileAsString('./schema.graphql'),
//   ],

import { builder } from '../builder';

import { PrismaClient } from '@prisma/client';

//   resolvers: {
//     Query: {
//       hello: (_, args) => {
//         return {
//           id: '1',
//           name: 'hello',
//         };
//       },
//       lastBlockHeight: async (parent, args, context) => {
//         const lastBlock = await context.prisma.blocks.findFirst({
//           orderBy: {
//             height: 'desc',
//           },
//         });
//         return lastBlock?.height;
//       },
//     },

//     Block: {
//       chainid: (parent) => BigInt(parent.chainid),
//       height: (parent) => BigInt(parent.height),
//     },

//     Subscription: {
//       newBlocks: {
//         subscribe: () => pubsub.subscribe('NEW_BLOCKS'),
//         resolve: (payload) => payload,
//       },
//     },
//   },
// }),

builder.queryField('lastBlockHeight', (t) => {
  return t.field({
    type: 'BigInt',
    nullable: true,
    resolve: async () => {
      const lastBlock = await new PrismaClient().block.findFirst({
        orderBy: {
          height: 'desc',
        },
      });

      return lastBlock?.height;
    },
  });
});
