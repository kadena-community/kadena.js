import { builder } from '../builder';

builder.globalConnectionField('totalCount', (t) => {
  return t.int({
    nullable: false,
    resolve: (parent) => {
      return parent.totalCount;
    },
  });
});
