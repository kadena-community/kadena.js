import type { CommandData } from '@services/node-service';
import { sendRawQuery } from '@services/node-service';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

const PactData = builder.inputType('PactQueryData', {
  fields: (t) => ({
    key: t.field({ type: 'String', required: true }),
    value: t.field({ type: 'String', required: true }),
  }),
});

const PactQuery = builder.inputType('PactQuery', {
  fields: (t) => ({
    code: t.field({ type: 'String', required: true }),
    chainId: t.field({ type: 'String', required: true }),
    data: t.field({ type: [PactData] }),
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
        return args.pactQuery.map(
          async (query) =>
            await sendRawQuery(
              query.code,
              query.chainId,
              query.data as CommandData[],
            ),
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
        return await sendRawQuery(
          args.pactQuery.code,
          args.pactQuery.chainId,
          args.pactQuery.data as CommandData[],
        );
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
});
