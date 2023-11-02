import { getAccountDetails } from '@/services/node-service';
import { normalizeError } from '@/utils/errors';
import { builder } from '../builder';
import ChainModuleAccount from '../objects/ChainModuleAccount';

builder.queryField('chainAccount', (t) => {
  return t.field({
    args: {
      accountName: t.arg.string({ required: true }),
      moduleName: t.arg.string({ required: true }),
      chainId: t.arg.string({ required: true }),
    },
    type: ChainModuleAccount,
    nullable: true,
    async resolve(__parent, args) {
      try {
        const accountDetails = await getAccountDetails(
          args.moduleName,
          args.accountName,
          args.chainId,
        );

        return accountDetails
          ? {
              chainId: args.chainId,
              accountName: args.accountName,
              moduleName: args.moduleName,
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
  });
});
