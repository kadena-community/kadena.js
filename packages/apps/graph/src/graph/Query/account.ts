import { builder } from '../builder';
import Account from '../objects/ModuleAccount';

builder.queryField('account', (t) => {
  return t.field({
    args: {
      accountName: t.arg.string({ required: true }),
      moduleName: t.arg.string({ required: true }),
    },
    type: Account,
    resolve(__parent, args) {
      return {
        id: `Account:${args.accountName}`,
        accountName: args.accountName,
        moduleName: args.moduleName,
        chainAccounts: [],
        totalBalance: 0,
        transactions: [],
        transfers: [],
      };
    },
  });
});
