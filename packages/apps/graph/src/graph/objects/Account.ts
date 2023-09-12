import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

export default builder.queryType({
  fields: (t) => ({
    id: t.field({
      type: 'ID',
      args: {
        accountName: t.arg.string({ required: true }),
      },
      nullable: false,
      resolve: (parent, args, context, info) => {
        return `Account:${args.accountName}`;
      },
    }),
    accountName: t.field({
      type: 'String',
      args: {
        accountName: t.arg.string({ required: true }),
      },
      nullable: false,
      resolve: (parent, args, context, info) => {
        return args.accountName;
      },
    }),
  }),
});
