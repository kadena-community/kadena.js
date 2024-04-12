import { builder } from '../builder';
import NonFungibleAccount from '../objects/non-fungible-account';
import { NonFungibleAccountName } from '../types/graphql-types';

builder.queryField('nonFungibleAccount', (t) =>
  t.field({
    description: 'Retrieve a non-fungible specific account by its name.',
    nullable: true,
    args: {
      accountName: t.arg.string({
        required: true,
        validate: {
          minLength: 1,
        },
      }),
    },
    type: NonFungibleAccount,
    async resolve(__parent, args) {
      return {
        __typename: NonFungibleAccountName,
        accountName: args.accountName,
        nonFungibleTokenBalances: [],
        chainAccounts: [],
        transactions: [],
      };
    },
  }),
);
