import { COMPLEXITY } from '@services/complexity';
import { getAccountDetails } from '@services/node-service';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import ChainFungibleAccount from '../objects/chain-fungible-account';
import { ChainFungibleAccountName } from '../types/graphql-types';

builder.queryField('chainFungibleAccount', (t) =>
  t.field({
    description:
      'Retrieve an account by its name and fungible, such as coin, on a specific chain.',
    args: {
      accountName: t.arg.string({ required: true }),
      fungibleName: t.arg.string({ required: true }),
      chainId: t.arg.string({ required: true }),
    },
    type: ChainFungibleAccount,
    nullable: true,
    complexity: COMPLEXITY.FIELD.CHAINWEB_NODE,
    async resolve(__parent, args) {
      try {
        const accountDetails = await getAccountDetails(
          args.fungibleName,
          args.accountName,
          args.chainId,
        );

        return accountDetails
          ? {
              __typename: ChainFungibleAccountName,
              chainId: args.chainId,
              accountName: args.accountName,
              fungibleName: args.fungibleName,
              guard: {
                keys: accountDetails.guard.keys,
                predicate: accountDetails.guard.pred,
              },
              balance: accountDetails.balance,
              transactions: [],
              transfers: [],
            }
          : null;
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
