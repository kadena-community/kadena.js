import { builder } from '../builder';
import Account from '../objects/Account';

const AccountFilter = builder.inputType('AccountFilter', {
  fields: (t) => ({
    chains: t.stringList(),
  }),
});

builder.queryField('account', (t) => {
  return t.field({
    args: {
      accountName: t.arg.string({ required: true }),
      modules: t.arg.stringList({ required: true }),
      filter: t.arg({ type: AccountFilter }),
    },
    type: Account,
    resolve: async (root, args) => {
      return {
        id: `Account:${args.accountName}`,
        accountName: args.accountName,
        chainAccounts: [],
        totalBalances: [],
        transactions: [],
        transfers: [],
      };
    },
  });
});
