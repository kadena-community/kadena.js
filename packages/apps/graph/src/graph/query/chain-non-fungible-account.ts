import { COMPLEXITY } from '@services/complexity';
import { getAccountDetails } from '@services/node-service';
import { getTokenDetails } from '@services/token-service';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import ChainNonFungibleAccount from '../objects/chain-non-fungible-account';
import { ChainNonFungibleAccountName } from '../types/graphql-types';

builder.queryField('chainNonFungibleAccount', (t) =>
  t.field({
    description: 'Retrieve an account by its name on a specific chain.',
    args: {
      accountName: t.arg.string({ required: true }),
      chainId: t.arg.string({ required: true }),
    },
    type: ChainNonFungibleAccount,
    nullable: true,
    complexity:
      COMPLEXITY.FIELD.CHAINWEB_NODE +
      COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
    async resolve(__parent, args) {
      try {
        const accountDetails = await getAccountDetails(
          'coin',
          args.accountName,
          args.chainId,
        );
        const tokenDetails = await getTokenDetails(
          args.accountName,
          args.chainId,
        );

        return accountDetails
          ? {
              __typename: ChainNonFungibleAccountName,
              chainId: args.chainId,
              accountName: args.accountName,
              guard: {
                keys: accountDetails.guard.keys,
                predicate: accountDetails.guard.pred,
              },
              nonFungibles: tokenDetails,
              transactions: [],
            }
          : null;
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
