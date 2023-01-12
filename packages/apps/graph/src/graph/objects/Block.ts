import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

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
      type: 'Transaction',
      cursor: 'block_requestkey',
      totalCount(parent, args, context, info) {
        return prismaClient.transaction.count({
          where: {
            block: {
              equals: parent.hash,
            },
          },
        });
      },
      resolve(query, parent, args, context, info) {
        return prismaClient.transaction.findMany({
          ...query,
          where: {
            block: {
              equals: parent.hash,
            },
          },
        });
      },
    }),
  }),
});
