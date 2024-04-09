import { sendRawQuery } from '@services/chainweb-node/raw-query';
import type { CommandData } from '@services/chainweb-node/utils';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

const PactData = builder.inputType('PactQueryData', {
  fields: (t) => ({
    key: t.string({
      required: true,
      validate: {
        minLength: 1,
      },
    }),
    value: t.string({
      required: true,
      validate: {
        minLength: 1,
      },
    }),
  }),
});

const PactQuery = builder.inputType('PactQuery', {
  fields: (t) => ({
    code: t.string({
      required: true,
      validate: {
        minLength: 1,
      },
    }),
    chainId: t.string({
      required: true,
      validate: {
        minLength: 1,
      },
    }),
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
        const queries = args.pactQuery.map((query) =>
          sendRawQuery(query.code, query.chainId, query.data as CommandData[]),
        );

        const results = (await Promise.race([
          Promise.allSettled(queries),
          new Promise(
            (_, reject) =>
              setTimeout(
                () => reject(new Error('Total query time exceeded')),
                5000,
              ), // 5000 ms = 5 seconds
          ),
        ])) as PromiseSettledResult<any>[];

        console.log(results);

        if (results instanceof Error) {
          throw results;
        }

        return results.map((result) =>
          result.status === 'fulfilled' ? result.value : null,
        );
      } catch (error) {
        throw normalizeError(error);
      }
    },
    // async resolve(__parent, args) {
    //   try {
    //     return args.pactQuery.map(
    //       async (query) =>
    //         await sendRawQuery(
    //           query.code,
    //           query.chainId,
    //           query.data as CommandData[],
    //         ),
    //     );
    //   } catch (error) {
    //     throw normalizeError(error);
    //   }
    // },
  }),
);
