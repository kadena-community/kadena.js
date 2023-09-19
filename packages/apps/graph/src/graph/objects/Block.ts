import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

import type { prismaModelName } from '@pothos/plugin-prisma';
import { Prisma } from '@prisma/client';

export default builder.prismaNode('Block', {
  id: { field: 'hash' },
  name: 'Block',
  fields: (t) => ({
    // database fields
    hash: t.exposeID('hash'),
    chainid: t.expose('chainid', { type: 'BigInt' }),
    creationtime: t.expose('creationtime', { type: 'DateTime' }),
    epoch: t.expose('epoch', { type: 'DateTime' }),
    height: t.expose('height', { type: 'BigInt' }),
    powhash: t.exposeString('powhash'),
    parent_old: t.exposeString('parent'),

    // computed fields
    parent: t.prismaField({
      type: 'Block',
      nullable: true,
      resolve(query, parent, args, context, info) {
        return prismaClient.block.findUnique({
          where: {
            hash: parent.parent,
          },
        });
      },
    }),

    parentHash: t.string({
      nullable: true,
      resolve: (parent, args, context, info) => {
        // Access the parent block's hash from the parent object
        return parent.parent;
      },
    }),

    // relations
    transactions: t.prismaConnection({
      args: {
        events: t.arg.stringList({ required: false, defaultValue: [] }),
      },
      type: 'Transaction',
      cursor: 'blockHash_requestkey',
      async totalCount(parent, { events }, context, info) {
        return prismaClient.transaction.count({
          where: {
            blockHash: parent.hash,
            requestkey: {
              in: await getTransactionsRequestkeyByEvent(events || [], parent),
            },
          },
        });
      },
      async resolve(query, parent, { events }, context, info) {
        return prismaClient.transaction.findMany({
          ...query,
          where: {
            blockHash: parent.hash,
            requestkey: {
              in: await getTransactionsRequestkeyByEvent(events || [], parent),
            },
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

async function getTransactionsRequestkeyByEvent(
  events: string[] | undefined,
  parent: {
    hash: string;
  } & { [prismaModelName]?: 'Block' | undefined },
): Promise<string[]> {
  return (
    await prismaClient.$queryRaw<{ requestkey: string }[]>`
      SELECT t.requestkey
      FROM transactions t
      INNER JOIN events e
      ON e.block = t.block AND e.requestkey = t.requestkey
      WHERE e.qualname IN (${Prisma.join(events as string[])})
      AND t.block = ${parent.hash}`
  ).map((r) => r.requestkey);
}

async function getConfirmationDepth(blockHash: string): Promise<number> {
  const result = await prismaClient.$queryRaw<{ depth: number }[]>`
    WITH RECURSIVE BlockDescendants AS (
      SELECT hash, parent, 0 AS depth
      FROM blocks
      WHERE hash = ${blockHash}
      UNION ALL
      SELECT b.hash, b.parent, d.depth + 1 AS depth
      FROM BlockDescendants d
      JOIN blocks b ON d.hash = b.parent
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
