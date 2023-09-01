import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

import { type prismaModelName } from '@pothos/plugin-prisma';
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
