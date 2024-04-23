import { handleStreamOrSingleExecutionResult } from 'graphql-yoga';
import type { IContext } from '../graph/builder';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const extensionsPlugin = () => ({
  onExecute: () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onExecuteDone(options: any) {
      handleStreamOrSingleExecutionResult(
        options,
        ({ result, args: { contextValue } }) => {
          result.extensions = {
            ...result.extensions,
            ...(contextValue as unknown as IContext).extensions,
          };
        },
      );
    },
  }),
});
