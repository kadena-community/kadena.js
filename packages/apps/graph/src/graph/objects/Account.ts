import { prismaClient } from '../../db/prismaClient';
import { IChainAccount, builder } from '../builder';
import { getBalance } from '../../services/node-service';

export default builder.objectType('Account', {
  fields: (t) => ({
    id: t.exposeString('id'),
    accountName: t.exposeString('id'),
    chainAccounts: t.field({
      args: {
        accountName: t.arg.string({ required: true }),
        modules: t.arg.stringList({ required: true }),
      },
      type: ['ChainAccount'],
      resolve: async (parent, args) => {
        const chainAccounts: IChainAccount[] = [];

        for (let i = 0; i < 20; i++) {
          for (let module of args.modules) {
            const balance = await getBalance(
              module,
              args.accountName,
              i.toString(),
            );

            if (balance) {
              chainAccounts.push({
                chainId: i.toString(),
                // guard: {
                //   keys: ['1'],
                //   predicate: 'KeysAll',
                // },
                balance,
                module,
                // transactions: [],
                transfers: [],
              });
            }
          }
        }

        return chainAccounts;
      },
    }),
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
      args: {
        accountName: t.arg.string({ required: true }),
      },
      cursor: 'blockHash_requestkey',
      resolve: (query, parent, args) => {
        return prismaClient.transaction.findMany({
          where: {
            sender: args.accountName,
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
      args: {
        accountName: t.arg.string({ required: true }),
      },
      cursor: 'block_chainid_idx_modulehash_requestkey',
      resolve: async (query, parent, args) => {
        return prismaClient.transfer.findMany({
          where: {
            OR: [
              {
                from_acct: args.accountName,
              },
              {
                to_acct: args.accountName,
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
