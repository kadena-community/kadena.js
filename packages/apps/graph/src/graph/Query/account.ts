import { builder } from '../builder';
import Account from '../objects/Account';

import _debug from 'debug';

const AccountFilter = builder.inputType('AccountFilter', {
  fields: (t) => ({
    module: t.string(),
  }),
});

builder.queryField('account', (t) => {
  return t.field({
    args: {
      accountName: t.arg.string({ required: true }),
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
