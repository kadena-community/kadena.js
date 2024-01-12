import {
  createContext as createReactContext,
  useContext as useReactContext,
} from 'react';

export interface ICreateContextOptions<T> {
  strict?: boolean;
  hookName?: string;
  providerName?: string;
  errorMessage?: string;
  name?: string;
  defaultValue?: T;
}

export type CreateContextReturn<T> = [
  React.Provider<T>,
  () => T,
  React.Context<T>,
];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getErrorMessage(hook: string, provider: string) {
  return `${hook} returned \`undefined\`. Seems you forgot to wrap component within ${provider}`;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createContext<T>(options: ICreateContextOptions<T> = {}) {
  const {
    name,
    strict = true,
    hookName = 'useContext',
    providerName = 'Provider',
    errorMessage,
    defaultValue,
  } = options;

  const Context = createReactContext<T | undefined>(defaultValue);

  Context.displayName = name;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const useContext = () => {
    const context = useReactContext(Context);

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!context && strict) {
      const error = new Error(
        errorMessage ?? getErrorMessage(hookName, providerName),
      );
      error.name = 'ContextError';
      Error.captureStackTrace?.(error, useContext);
      throw error;
    }

    return context;
  };

  return [Context.Provider, useContext, Context] as CreateContextReturn<T>;
}
