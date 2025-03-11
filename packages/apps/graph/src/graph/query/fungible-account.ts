import { getFungibleChainAccount } from '@services/account-service';
import { dotenv } from '@utils/dotenv';
import { isDefined } from '@utils/isDefined';
import { networkData } from '@utils/network';
import { builder } from '../builder';
import FungibleAccount from '../objects/fungible-account';
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
        defaultValue: dotenv.DEFAULT_FUNGIBLE_NAME,
        validate: {
          minLength: 1,
        },
      }),
    },
    type: FungibleAccount,
    async resolve(__parent, args) {
      const chainAccounts = (
        await Promise.all(
          networkData.chainIds.map(async (chainId) => {
            return getFungibleChainAccount({
              chainId: chainId,
              fungibleName: args.fungibleName as string,
              accountName: args.accountName,
            });
          }),
        )
      ).filter(isDefined);

      if (chainAccounts.length === 0) {
        return null;
      }

      return {
        __typename: FungibleAccountName,
        accountName: args.accountName,
        fungibleName: args.fungibleName as string,
        chainAccounts: chainAccounts,
        totalBalance: 0,
        transactions: [],
        transfers: [],
      };
    },
  }),
);
