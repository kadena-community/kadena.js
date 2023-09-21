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
    totalBalances: t.field({
      args: {
        accountName: t.arg.string({ required: true }),
        modules: t.arg.stringList({ required: true }),
      },
      type: ['FungibleBalance'],
      resolve: async (parent, args) => {
        const moduleBalances = new Map();

        // Create an array of promises to fetch balances for all modules concurrently
        const promises = [];

        for (let i = 0; i < 20; i++) {
          for (let module of args.modules) {
            const promise = getBalance(module, args.accountName, i.toString());

            if (!moduleBalances.has(module)) {
              moduleBalances.set(module, []);
            }

            promises.push(
              promise.then((balance) => {
                moduleBalances.get(module).push(balance);
              }),
            );
          }
        }

        await Promise.all(promises);

        // Calculate the total balance for each module
        const balances = [];

        for (let [module, balanceArray] of moduleBalances) {
          const totalBalance = balanceArray.reduce(
            (sum: number, balance: number) => sum + balance,
            0,
          );
          balances.push({ module, balance: totalBalance });
        }

        return balances;
      },
    }),
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
