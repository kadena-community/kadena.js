import { builder } from '../builder';

export default builder.objectType('GasLimitEstimation', {
  fields: (t) => ({
    amount: t.exposeInt('amount', { nullable: false }),
    type: t.exposeString('type', { nullable: false }),
    usedPreflight: t.exposeBoolean('usedPreflight', { nullable: false }),
    usedSignatureVerification: t.exposeBoolean('usedSignatureVerification', {
      nullable: false,
    }),
    usedTransaction: t.exposeBoolean('usedTransaction', { nullable: false }),
  }),
});
