import { getChainFungibleAccount } from '@services/account-service';
import { chainIds } from '@utils/chains';
import { builder } from '../builder';
import Account from '../objects/fungible-account';
import type { ChainFungibleAccount } from '../types/graphql-types';
import { FungibleAccountName } from '../types/graphql-types';

builder.queryField('account', (t) =>
  t.field({
    description: 'Retrieve an account by its name and fungible, such as coin.',
    nullable: true,
    args: {
      accountName: t.arg.string({ required: true }),
      fungibleName: t.arg.string({ required: true }),
    },
    type: Account,
    async resolve(__parent, args) {
      const chainAccounts = (
        await Promise.all(
          chainIds.map(async (chainId) => {
            return await getChainFungibleAccount({
              chainId: chainId,
              fungibleName: args.fungibleName,
              accountName: args.accountName,
            });
          }),
        )
      ).filter(
        (chainAccount) => chainAccount !== null,
      ) as ChainFungibleAccount[];

      if (chainAccounts.length === 0) {
        return null;
      }

      return {
        __typename: FungibleAccountName,
        accountName: args.accountName,
        fungibleName: args.fungibleName,
        chainAccounts: chainAccounts,
        totalBalance: 0,
        transactions: [],
        transfers: [],
      };
    },
  }),
);
