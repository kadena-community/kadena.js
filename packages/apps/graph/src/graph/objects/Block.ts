import { prismaClient } from '../../db/prismaClient';
import { dotenv } from '../../utils/dotenv';
import { builder } from '../builder';

import type { prismaModelName } from '@pothos/plugin-prisma';
import { Prisma } from '@prisma/client';

export default builder.prismaNode('Block', {
  id: { field: 'hash' },
  name: 'Block',
  fields: (t) => ({
    // database fields
    hash: t.exposeID('hash'),
    chainId: t.expose('chainId', { type: 'BigInt' }),
    creationTime: t.expose('creationTime', { type: 'DateTime' }),
    epoch: t.expose('epoch', { type: 'DateTime' }),
    height: t.expose('height', { type: 'BigInt' }),
    payload: t.exposeString('payload'),
    powHash: t.exposeString('powHash'),
    predicate: t.exposeString('predicate'),

    // computed fields
    parent: t.prismaField({
      type: 'Block',
      nullable: true,
      resolve(query, parent, args, context, info) {
        return prismaClient.block.findUnique({
          where: {
            hash: parent.parentBlockHash,
          },
        });
      },
    }),

    parentHash: t.string({
      nullable: true,
      resolve: (parent, args, context, info) => {
        // Access the parent block's hash from the parent object
        return parent.parentBlockHash;
      },
    }),

    // relations
    transactions: t.prismaConnection({
      type: 'Transaction',
      cursor: 'blockHash_requestKey',
      async totalCount(parent, args, context, info) {
        return prismaClient.transaction.count({
          where: {
            blockHash: parent.hash,
          },
        });
      },
      resolve: (query, parent, args, context, info) => {
        return prismaClient.transaction.findMany({
          ...query,
          where: {
            blockHash: parent.hash,
          },
          orderBy: {
            height: 'desc',
          },
        });
      },
    }),

    minerKeys: t.prismaField({
      type: ['Minerkey'],
      nullable: true,
      resolve(query, parent, args, context, info) {
        return prismaClient.minerkey.findMany({
          where: {
            blockHash: parent.hash,
          },
        });
      },
    }),

    confirmationDepth: t.int({
      resolve: async (parent, args, context, info) => {
        return getConfirmationDepth(parent.hash);
      },
    }),
  }),
});

async function getConfirmationDepth(blockhash: string): Promise<number> {
  const result = await prismaClient.$queryRaw<{ depth: number }[]>`
    WITH RECURSIVE BlockDescendants AS (
      SELECT hash, parent, 0 AS depth
      FROM blocks
      WHERE hash = ${blockhash}
      UNION ALL
      SELECT b.hash, b.parent, d.depth + 1 AS depth
      FROM BlockDescendants d
      JOIN blocks b ON d.hash = b.parent
      WHERE d.depth < ${dotenv.MAX_BLOCK_DEPTH}
    )
    SELECT MAX(depth) AS depth
    FROM BlockDescendants;
  `;

  if (result.length && result[0].depth) {
    return Number(result[0].depth);
  } else {
    return 0;
  }
}
