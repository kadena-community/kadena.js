import { builder } from '../builder';
import Account from '../objects/ModuleAccount';

const AccountFilter = builder.inputType('AccountFilter', {
  fields: (t) => ({
    chains: t.stringList(),
  }),
});

builder.queryField('account', (t) => {
  return t.field({
    args: {
      accountName: t.arg.string({ required: true }),
      moduleName: t.arg.string({ required: true }),
      filter: t.arg({ type: AccountFilter }),
    },
    type: Account,
    resolve: async (root, args) => {
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
