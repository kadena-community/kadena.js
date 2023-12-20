import type { Plugin } from 'graphql-yoga';
import { handleStreamOrSingleExecutionResult } from 'graphql-yoga';
import type { IContext } from '../graph/builder';

export const extensionsPlugin = () =>
  ({
    onExecute: () => ({
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
  }) as Plugin;
