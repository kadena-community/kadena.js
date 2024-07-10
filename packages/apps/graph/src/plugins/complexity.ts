import { complexityFromQuery } from '@pothos/plugin-complexity';
import type { GraphQLSchema } from 'graphql';
import { handleStreamOrSingleExecutionResult } from 'graphql-yoga';

export const complexityPlugin = (schema: GraphQLSchema) => ({
  onExecute: () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onExecuteDone(options: any) {
      handleStreamOrSingleExecutionResult(
        options,
        ({ result, args: { contextValue, variableValues, document } }) => {
          result.extensions = {
            ...result.extensions,
            complexity: complexityFromQuery(document, {
              schema,
              variables: variableValues,
              ctx: contextValue,
            }),
          };
        },
      );
    },
  }),
});
