import { builder } from '../builder';
import Account from '../objects/Account';

import type { Debugger } from 'debug';
import _debug from 'debug';

const log: Debugger = _debug('graph:Query:account');

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
