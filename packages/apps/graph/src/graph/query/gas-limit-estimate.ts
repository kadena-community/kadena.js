import { estimateGasLimit } from '@services/chainweb-node/estimate-gas-limit';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import GasLimitEstimation from '../objects/gas-limit-estimation';

builder.queryField('gasLimitEstimate', (t) =>
  t.field({
    description: 'Estimate the gas limit for a transaction.',
    type: GasLimitEstimation,
    args: {
      input: t.arg.string({ required: true }),
    },
    complexity: COMPLEXITY.FIELD.CHAINWEB_NODE,
    async resolve(__parent, args) {
      try {
        return await estimateGasLimit(args.input);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);

builder.queryField('gasLimitEstimates', (t) =>
  t.field({
    description: 'Estimate the gas limit for a list of transactions.',
    type: [GasLimitEstimation],
    args: {
      input: t.arg.stringList({ required: true }),
    },
    complexity: (args) => ({
      field: COMPLEXITY.FIELD.CHAINWEB_NODE * args.input.length,
    }),
    async resolve(__parent, args) {
      try {
        return await Promise.all(
          args.input.map((input) => estimateGasLimit(input)),
        );
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
