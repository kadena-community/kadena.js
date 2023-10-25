import { getAccountDetails } from '../../services/node-service';
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
    resolve: async (parent, args) => {
      const accountDetails = await getAccountDetails(
        args.moduleName,
        args.accountName,
        args.chainId,
      );

      return {
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
      };
    },
  });
});
