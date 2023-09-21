import { ChainId, Pact, createClient } from '@kadena/client';
import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';
import { getBalance } from '../../services/node-service';

export default builder.objectType('Account', {
  fields: (t) => ({
    id: t.exposeString('id'),
    accountName: t.exposeString('id'),
    // chainAccounts: t.field({
    //   type: ['ChainAccount'],
    //   resolve: async (parent, args) => {

    //     return [
    //       {
    //         chainId: '1',
    //         guard: {
    //           keys: ['1'],
    //           predicate: 'KeysAll',
    //         },
    //         balance: 1.234567,
    //         module: 'coin',
    //         transactions: [],
    //         transfers: [],
    //       },
    //     ];
    //   },
    // }),
    // totalBalances: t.field({
    //   type: ['FungibleBalance'],
    //   resolve: (parent, args) => {
    //     return [
    //       {
    //         module: 'coin',
    //         balance: 1.234567,
    //       },
    //     ];
    //   },
    // }),
    transactions: t.prismaConnection({
      type: 'Transaction',
      cursor: 'blockHash_requestkey',
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
      },
    }),
    transfers: t.prismaConnection({
      type: 'Transfer',
      cursor: 'block_chainid_idx_modulehash_requestkey',
      resolve: async (query, parent, args) => {
        for (let i = 0; i <= 19; i++) {
          console.log('result:', await getBalance('coin', parent.accountName, i.toString()));
        }

        return prismaClient.transfer.findMany({
          where: {
            OR: [
              {
                from_acct: parent.accountName,
              },
              {
                to_acct: parent.accountName,
              },
            ],
          },
          orderBy: {
            height: 'desc',
          },
          take: 10,
        });
      },
    }),
  }),
});
