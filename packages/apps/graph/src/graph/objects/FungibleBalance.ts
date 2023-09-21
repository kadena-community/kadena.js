import { builder } from '../builder';

export default builder.objectType('FungibleBalance', {
  fields: (t) => ({
    module: t.exposeString('module'),
    balance: t.exposeFloat('balance'),
  }),
});
