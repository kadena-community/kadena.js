import { getFungibleChainAccount } from '@services/account-service';
import { chainIds } from '@utils/chains';
import { dotenv } from '@utils/dotenv';
import { builder } from '../builder';
import FungibleAccount from '../objects/fungible-account';
import type { FungibleChainAccount } from '../types/graphql-types';
import { FungibleAccountName } from '../types/graphql-types';

builder.queryField('fungibleAccount', (t) =>
  t.field({
    description:
      'Retrieve an fungible specific account by its name and fungible, such as coin.',
    nullable: true,
    args: {
      accountName: t.arg.string({
        required: true,
        validate: {
          minLength: 1,
        },
      }),
      fungibleName: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
    },
    type: FungibleAccount,
    async resolve(__parent, args) {
      const chainAccounts = (
        await Promise.all(
          chainIds.map(async (chainId) => {
            return getFungibleChainAccount({
              chainId: chainId,
              fungibleName: args.fungibleName || dotenv.DEFAULT_FUNGIBLE_NAME,
              accountName: args.accountName,
            });
          }),
        )
      ).filter(
        (chainAccount) => chainAccount !== null,
      ) as FungibleChainAccount[];

      if (chainAccounts.length === 0) {
        return null;
      }

      return {
        __typename: FungibleAccountName,
        accountName: args.accountName,
        fungibleName: args.fungibleName || dotenv.DEFAULT_FUNGIBLE_NAME,
        chainAccounts: chainAccounts,
        totalBalance: 0,
        transactions: [],
        transfers: [],
      };
    },
  }),
);
