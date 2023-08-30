import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

import { prismaModelName } from '@pothos/plugin-prisma';
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
    parent: t.exposeString('parent'),

    // computed fields

    // relations
    transactions: t.prismaConnection({
      args: {
        events: t.arg.stringList({ required: false, defaultValue: [] }),
      },
      type: 'Transaction',
      cursor: 'block_requestkey',
      async totalCount(parent, { events }, context, info) {
        return prismaClient.transaction.count({
          where: {
            block: parent.hash,
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
            block: parent.hash,
            requestkey: {
              in: await getTransactionsRequestkeyByEvent(events || [], parent),
            },
          },
        });
      },
    }),

    // Add the confirmationDepth field
    confirmationDepth1: t.int({
      resolve: async (parent, args, context, info) => {
        // Implement the logic to calculate confirmation depth here
        return getConfirmationDepth1(parent.hash);
      },
    }),

    // Add the confirmationDepth field
    confirmationDepth2: t.int({
      resolve: async (parent, args, context, info) => {
        // Implement the logic to calculate confirmation depth here
        return getConfirmationDepth2(parent.hash);
      },
    }),

    // Add the confirmationDepth field
    confirmationDepth3: t.int({
      resolve: async (parent, args, context, info) => {
        // Implement the logic to calculate confirmation depth here
        return getConfirmationDepth3(parent.hash);
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
  const results = await prismaClient.$queryRaw`
      SELECT b.payload
      FROM blocks b
      INNER JOIN blocks b1 ON (b.chainid = b1.chainid AND b.hash = b1.parent)
      INNER JOIN blocks b2 ON (b1.chainid = b2.chainid AND b1.hash = b2.parent)
      INNER JOIN blocks b3 ON (b2.chainid = b3.chainid AND b2.hash = b3.parent)
      INNER JOIN blocks b4 ON (b3.chainid = b4.chainid AND b3.hash = b4.parent)
      INNER JOIN blocks b5 ON (b4.chainid = b5.chainid AND b4.hash = b5.parent)
      `;

  const table = await prismaClient.block.findMany();
  console.log(results);

  // return results.length;

  return 1;
}

async function getConfirmationDepth1(blockHash: string): Promise<number> {
  let depth = 0;
  let currentHash = blockHash;

  while (currentHash) {
    const result = await prismaClient.$queryRaw<{ parent: string }[]>`
      SELECT parent
      FROM blocks
      WHERE hash = ${currentHash}
    `;

    if (result && result[0] && result[0].parent) {
      depth++;
      currentHash = result[0].parent;
    } else {
      break;
    }
  }

  return depth;
}
async function getConfirmationDepth2(blockHash: string): Promise<number> {
  const result = await prismaClient.$queryRaw<{ depth: number }[]>`
    WITH RECURSIVE BlockAncestors AS (
      SELECT hash, parent, 0 AS depth
      FROM blocks
      WHERE hash = ${blockHash}
      UNION ALL
      SELECT b.hash, b.parent, a.depth + 1 AS depth
      FROM BlockAncestors a
      JOIN blocks b ON a.parent = b.hash
    )
    SELECT MAX(depth) AS depth
    FROM BlockAncestors;
  `;

  if (result && result[0] && result[0].depth) {
    console.log(result[0].depth);
    return Number(result[0].depth);
  } else {
    return 0;
  }
}

async function getConfirmationDepth3(blockHash: string): Promise<number> {
  const blocksTable = await prismaClient.block.findMany();

  const block = blocksTable.find((b) => b.hash === blockHash);

  if (!block) {
    return 0;
  }

  let parent = block.parent;
  let depth = 0;

  while (parent) {
    const parentBlock = blocksTable.find((b) => b.hash === parent);

    if (!parentBlock) {
      break;
    }

    parent = parentBlock.parent;
    depth++;
  }

  return depth;
}
