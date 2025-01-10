import { CHAINS } from '@kadena/chainweb-node-client';
import { getFungibleChainAccount } from '@services/account-service';
import { COMPLEXITY } from '@services/complexity';
import { dotenv } from '@utils/dotenv';
import { normalizeError } from '@utils/errors';
import { isDefined } from '@utils/isDefined';
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
        defaultValue: dotenv.DEFAULT_FUNGIBLE_NAME,
        validate: {
          minLength: 1,
        },
      }),
      chainIds: t.arg.stringList({
        defaultValue: [...CHAINS],
        required: true,
        validate: {
          minLength: 1,
          items: {
            minLength: 1,
          },
        },
      }),
    },
    type: [FungibleChainAccount],
    nullable: true,
    complexity: COMPLEXITY.FIELD.CHAINWEB_NODE,
    async resolve(__parent, args) {
      try {
        return (
          await Promise.all(
            args.chainIds.map((chainId) =>
              getFungibleChainAccount({
                chainId: chainId,
                fungibleName: args.fungibleName as string,
                accountName: args.accountName,
              }),
            ),
          )
        ).filter(isDefined);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
