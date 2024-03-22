import { estimateGasLimit } from '@services/chainweb-node/estimate-gas-limit';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import GasLimitEstimation from '../objects/gas-limit-estimation';

builder.queryField('gasLimitEstimate', (t) =>
  t.field({
    description: `Estimate the gas limit for one or more transactions. Throws an error when the transaction fails or is invalid. The input accepts a JSON object and based on the parameters passed it will determine what type of format it is and return the gas limit estimation. The following types are supported:
       
      - \`full-transaction\`: A complete transaction object. Required parameters: \`cmd\`, \`hash\` and \`sigs\`.
      - \`stringified-command\`: A JSON stringified command. Required parameters: \`cmd\`. It also optionally accepts \`sigs\`.
      - \`full-command\`: A full command. Required parameters: \`payload\`, \`meta\` and \`signers\`.
      - \`partial-command\`: A partial command. Required parameters: \`payload\` and either \`meta\` or \`signers\`. In case \`meta\` is not given, but \`signers\` is given, you can also add \`chainId\` as a parameter.
      - \`payload\`: A just the payload of a command. Required parameters: \`payload\` and \`chainId\`.
      - \`code\`: The code of an execution. Required parameters: \`code\` and \`chainId\`.
       
      Every type accepts an optional parameter called \`networkId\` to override the default value from the environment variables.
       
      Example of the input needed for a type \`code\` query: \`gasLimitEstimate(input: "{\\"code\\":\\"(coin.details \\\\\\"k:1234\\\\\\")\\",\\"chainId\\":\\"3\\"}")\``,
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
