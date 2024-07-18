import { handleStreamOrSingleExecutionResult } from 'graphql-yoga';
import type { IContext } from '../graph/builder';

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
