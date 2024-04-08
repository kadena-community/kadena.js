import { builder } from '../builder';

export default builder.objectType('TransactionSignature', {
  description: 'List of capabilities associated with/installed by this signer.',
  fields: (t) => ({
    sig: t.exposeString('sig'),
  }),
});
