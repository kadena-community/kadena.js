import { builder } from '../builder';

builder.globalConnectionField('totalCount', (t) =>
  t.int({
    nullable: false,
    resolve(parent) {
      return parent.totalCount;
    },
  }),
);
