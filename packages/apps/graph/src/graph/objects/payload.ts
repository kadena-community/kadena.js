import { nullishOrEmpty } from '@utils/nullish-or-empty';
import { builder } from '../builder';

builder.objectType('ExecPayload', {
  description: 'The payload of an exec transaction.',
  fields: (t) => ({
    code: t.exposeString('code', { nullable: true }),
    data: t.exposeString('data'),
  }),
});

builder.objectType('ContPayload', {
  description: 'The payload of an cont transaction.',
  fields: (t) => ({
    pactId: t.exposeString('pactId', { nullable: true }),
    step: t.exposeInt('step', { nullable: true }),
    rollback: t.exposeBoolean('rollback', { nullable: true }),
    data: t.exposeString('data'),
    proof: t.exposeString('proof', { nullable: true }),
  }),
});

export default builder.unionType('Payload', {
  description: 'The payload of a transaction.',
  types: ['ExecPayload', 'ContPayload'],
  resolveType(payload) {
    if ('pactId' in payload) {
      if (payload.pactId === null) {
        return 'ExecPayload';
      } else {
        return 'ContPayload';
      }
    }
  },
});
