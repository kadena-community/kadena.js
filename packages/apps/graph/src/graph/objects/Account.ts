import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

export default builder.objectType('Account', {
  fields: (t) => ({
    id: t.exposeString('id'),
    accountName: t.exposeString('id'),
    transactions: t.prismaConnection({
      type: 'Transaction',
      cursor: 'block_requestkey',
      resolve: (query, parent) => {
        return prismaClient.transaction.findMany({
          where: {
            sender: parent.accountName,
          },
          orderBy: {
            height: 'desc',
          },
          take: 10,
        });
      }
    }),
    transfers: t.prismaConnection({
      type: 'Transfer',
      cursor: 'block_chainid_idx_modulehash_requestkey',
      resolve: (query, parent) => {
        return prismaClient.transfer.findMany({
          where: {
            OR: [
              {
                from_acct: parent.accountName,
              },
              {
                to_acct: parent.accountName,
              }
            ],   
          },
          orderBy: {
            height: 'desc',
          },
          take: 10,
        });
      }
    }),
  }),
});
