import { getNonFungibleChainAccount } from '@services/account-service';
import { chainIds } from '@utils/chains';
import { builder } from '../builder';
import NonFungibleAccount from '../objects/non-fungible-account';
import type { NonFungibleChainAccount } from '../types/graphql-types';
import { NonFungibleAccountName } from '../types/graphql-types';

builder.queryField('nonFungibleAccount', (t) =>
  t.field({
    description: 'Retrieve a non-fungible specific account by its name.',
    nullable: true,
    args: {
      accountName: t.arg.string({ required: true }),
    },
    type: NonFungibleAccount,
    async resolve(__parent, args) {
      const chainAccounts = (
        await Promise.all(
          chainIds.map((chainId) => {
            return getNonFungibleChainAccount({
              chainId: chainId,
              accountName: args.accountName,
            });
          }),
        )
      ).filter(
        (chainAccount) => chainAccount !== null,
      ) as NonFungibleChainAccount[];

      if (chainAccounts.length === 0) {
        return null;
      }

      return {
        __typename: NonFungibleAccountName,
        accountName: args.accountName,
        nonFungibles: [],
        chainAccounts: chainAccounts,
        transactions: [],
      };
    },
  }),
);
