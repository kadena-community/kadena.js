import { getChainModuleAccount } from '@services/account-service';
import { chainIds } from '@utils/chains';
import { builder } from '../builder';
import Account from '../objects/ModuleAccount';
import type { ChainModuleAccount } from '../types/graphql-types';
import { ModuleAccountName } from '../types/graphql-types';

builder.queryField('account', (t) =>
  t.field({
    description: 'Retrieve an account by its name and fungible, such as coin.',
    nullable: true,
    args: {
      accountName: t.arg.string({ required: true }),
      moduleName: t.arg.string({ required: true }),
    },
    type: Account,
    async resolve(__parent, args) {
      const chainAccounts = (
        await Promise.all(
          chainIds.map(async (chainId) => {
            return await getChainModuleAccount({
              chainId: chainId,
              moduleName: args.moduleName,
              accountName: args.accountName,
            });
          }),
        )
      ).filter((chainAccount) => chainAccount !== null) as ChainModuleAccount[];

      if (chainAccounts.length === 0) {
        return null;
      }

      return {
        __typename: ModuleAccountName,
        accountName: args.accountName,
        moduleName: args.moduleName,
        chainAccounts: chainAccounts,
        totalBalance: 0,
        transactions: [],
        transfers: [],
      };
    },
  }),
);
