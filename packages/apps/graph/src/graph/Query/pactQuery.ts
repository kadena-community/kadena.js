import { sendRawQuery } from '@/services/node-service';
import { normalizeError } from '@/utils/errors';
import { builder } from '../builder';

const PactQuery = builder.inputType('PactQuery', {
  fields: (t) => ({
    code: t.field({ type: 'String', required: true }),
    chainId: t.field({ type: 'String', required: true }),
  }),
});

builder.queryField('pactQueries', (t) => {
  return t.field({
    type: ['String'],
    args: {
      pactQuery: t.arg({ type: [PactQuery], required: true }),
    },
    async resolve(__parent, args) {
      try {
        return args.pactQuery.map(async (query) =>
          sendRawQuery(query.code, query.chainId),
        );
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
});

builder.queryField('pactQuery', (t) => {
  return t.field({
    type: 'String',
    args: {
      pactQuery: t.arg({ type: PactQuery, required: true }),
    },
    async resolve(__parent, args) {
      try {
        return sendRawQuery(args.pactQuery.code, args.pactQuery.chainId);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
});
