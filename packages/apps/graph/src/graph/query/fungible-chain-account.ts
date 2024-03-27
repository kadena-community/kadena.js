import { getFungibleChainAccount } from '@services/account-service';
import { COMPLEXITY } from '@services/complexity';
import { dotenv } from '@utils/dotenv';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import FungibleChainAccount from '../objects/fungible-chain-account';

builder.queryField('fungibleChainAccount', (t) =>
  t.field({
    description:
      'Retrieve an account by its name and fungible, such as coin, on a specific chain.',
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
      chainId: t.arg.string({
        required: true,
        validate: {
          minLength: 1,
        },
      }),
    },
    type: FungibleChainAccount,
    nullable: true,
    complexity: COMPLEXITY.FIELD.CHAINWEB_NODE,
    async resolve(__parent, args) {
      try {
        return await getFungibleChainAccount({
          chainId: args.chainId,
          fungibleName: args.fungibleName || dotenv.DEFAULT_FUNGIBLE_NAME,
          accountName: args.accountName,
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
