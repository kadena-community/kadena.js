import { builder } from '../builder';

export default builder.objectType('PactQueryResponse', {
  description: 'Information related to a token.',
  fields: (t) => ({
    status: t.exposeString('status'),
    result: t.exposeString('result', { nullable: true }),
    error: t.exposeString('error', { nullable: true }),
    chainId: t.exposeString('chainId'),
    code: t.exposeString('code'),
  }),
});
