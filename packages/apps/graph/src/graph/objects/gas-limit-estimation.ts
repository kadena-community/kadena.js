import { builder } from '../builder';

export default builder.objectType('GasLimitEstimation', {
  fields: (t) => ({
    amount: t.exposeInt('amount', { nullable: false }),
    inputType: t.exposeString('inputType', { nullable: false }),
    usedPreflight: t.exposeBoolean('usedPreflight', { nullable: false }),
    usedSignatureVerification: t.exposeBoolean('usedSignatureVerification', {
      nullable: false,
    }),
    transaction: t.exposeString('transaction', { nullable: false }),
  }),
});
