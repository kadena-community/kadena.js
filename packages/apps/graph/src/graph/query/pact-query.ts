import { sendRawQuery } from '@services/chainweb-node/raw-query';
import type { ICommandData } from '@services/chainweb-node/utils';
import { COMPLEXITY } from '@services/complexity';
import { dotenv } from '@utils/dotenv';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import GQLPactQueryResponse from '../objects/pact-query-response';
import type { IPactQueryResponse } from '../types/graphql-types';

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
    type: [GQLPactQueryResponse],
    args: {
      pactQuery: t.arg({ type: [PactQuery], required: true }),
    },
    complexity: (args) => ({
      field: COMPLEXITY.FIELD.CHAINWEB_NODE * args.pactQuery.length,
    }),
    async resolve(__parent, args) {
      try {
        return Promise.all(
          args.pactQuery.map(async (query) => {
            const timeout: Promise<IPactQueryResponse> = new Promise(
              (resolve) =>
                setTimeout(
                  () =>
                    resolve({
                      status: 'timeout',
                      result: null,
                      error:
                        'The query took too long to execute and was aborted',
                      chainId: query.chainId,
                      code: query.code,
                    }),
                  dotenv.TIMEOUT_PACT_QUERY, //timeout in ms
                ),
            );
            const sendQuery = sendRawQuery(
              query.code,
              query.chainId,
              query.data as ICommandData[],
            )
              .then((result) => ({
                status: 'success',
                result,
                error: null,
                chainId: query.chainId,
                code: query.code,
              }))
              .catch((error) => {
                const pactErrorMessage =
                  error.pactError?.message ||
                  JSON.stringify(error.pactError || error);

                return {
                  status: 'error',
                  result: null,
                  error: pactErrorMessage,
                  chainId: query.chainId,
                  code: query.code,
                };
              });
            return Promise.race([sendQuery, timeout]);
          }),
        );
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
