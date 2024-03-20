import { sendRawQuery } from '@services/chainweb-node/raw-query';
import type { CommandData } from '@services/chainweb-node/utils';
import { COMPLEXITY } from '@services/complexity';
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

builder.queryField('pactQuery', (t) =>
  t.field({
    description:
      'Execute arbitrary Pact code via a local call without gas-estimation or signature-verification (e.g. (+ 1 2) or (coin.get-details <account>)).',
    type: ['String'],
    args: {
      pactQuery: t.arg({ type: [PactQuery], required: true }),
    },
    complexity: (args) => ({
      field: COMPLEXITY.FIELD.CHAINWEB_NODE * args.pactQuery.length,
    }),
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
  }),
);
